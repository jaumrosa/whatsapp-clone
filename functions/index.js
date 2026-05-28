const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

function encode64(text) {
    return Buffer.from(text).toString("base64");
}

function decode64(text) {
    return Buffer.from(text, "base64").toString("utf8");
}

function getLastMessagePreview(msg) {
    switch (msg.type) {
        case 'image':    return '📷 Imagem';
        case 'audio':    return '🎤 Áudio';
        case 'document': return `📄 ${msg.filename || 'Documento'}`;
        case 'contact':  return '👤 Contato';
        default:         return msg.content || '';
    }
}

exports.saveLastMessage = onDocumentCreated(
    "chats/{chatId}/messages/{messageId}",
    async (event) => {
        try {
            const chatId    = event.params.chatId;
            const messageId = event.params.messageId;
            const messageDoc = event.data.data();

            if (!messageDoc) {
                console.error("[ERROR] Mensagem não encontrada");
                return null;
            }

            const userFrom = messageDoc.from;
            if (!userFrom) {
                console.error("[ERROR] Campo FROM ausente");
                return null;
            }

            let userTo = null;

            const chatSnap = await db.collection("chats").doc(chatId).get();

            if (chatSnap.exists) {
                const chatDoc = chatSnap.data();
                const users = Object.keys(chatDoc.users);
                const userToEncoded = users.find(u => u !== encode64(userFrom));
                if (userToEncoded) userTo = decode64(userToEncoded);

            } else {
                console.warn("[WARN] Ghost document detectado. Buscando destinatário via contacts...");

                const contactsSnap = await db
                    .collection("users")
                    .doc(userFrom)
                    .collection("contacts")
                    .get();

                for (const contactDoc of contactsSnap.docs) {
                    const data = contactDoc.data();
                    if (data.chatId === chatId) {
                        userTo = data.email;
                        break;
                    }
                }

                if (userTo) {
                    const users = {};
                    users[encode64(userFrom)] = true;
                    users[encode64(userTo)]   = true;

                    await db.collection("chats").doc(chatId).set({
                        users,
                        timeStamp: admin.firestore.FieldValue.serverTimestamp()
                    });
                    console.log("[INFO] Chat document recriado com sucesso:", chatId);
                }
            }

            if (!userTo) {
                console.error("[ERROR] Destinatário não encontrado");
                return null;
            }

            console.log("[FROM]", userFrom);
            console.log("[TO]",   userTo);

            const lastMessage     = getLastMessagePreview(messageDoc);
            const lastMessageTime = admin.firestore.FieldValue.serverTimestamp();

            await db
                .collection("users").doc(userTo)
                .collection("contacts").doc(encode64(userFrom))
                .set({ lastMessage, lastMessageTime }, { merge: true });

            await db
                .collection("users").doc(userFrom)
                .collection("contacts").doc(encode64(userTo))
                .set({ lastMessage, lastMessageTime }, { merge: true });

            console.log("[FINISH]", new Date());
            return true;

        } catch (err) {
            console.error("[ERROR]", err);
            return null;
        }
    }
);
