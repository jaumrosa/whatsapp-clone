const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

/**
 * Base64 encode
 */
function encode64(text) {
    return Buffer.from(text).toString("base64");
}

/**
 * Base64 decode
 */
function decode64(text) {
    return Buffer.from(text, "base64").toString("utf8");
}

/**
 * Atualiza última mensagem do contato
 */
exports.saveLastMessage = onDocumentCreated(
    "chats/{chatId}/messages/{messageId}",
    async (event) => {

        try {

            const chatId = event.params.chatId;
            const messageId = event.params.messageId;

            console.log("[CHAT ID]", chatId);
            console.log("[MESSAGE ID]", messageId);

            /**
             * Mensagem criada
             */
            const messageDoc = event.data.data();

            if (!messageDoc) {
                console.error("[ERROR] Mensagem não encontrada");
                return null;
            }

            console.log("[MESSAGE DATA]", messageDoc);

            const userFrom = messageDoc.from;

            if (!userFrom) {
                console.error("[ERROR] Campo FROM ausente");
                return null;
            }

            /**
             * Busca chat
             */
            const chatSnap = await db
                .collection("chats")
                .doc(chatId)
                .get();

            if (!chatSnap.exists) {
                console.error("[ERROR] Chat não encontrado");
                return null;
            }

            const chatDoc = chatSnap.data();

            console.log("[CHAT DATA]", chatDoc);

            /**
             * Descobre destinatário
             */
            const users = Object.keys(chatDoc.users);

            const userToEncoded = users.filter(user => {
                return user !== encode64(userFrom);
            })[0];

            if (!userToEncoded) {
                console.error("[ERROR] Destinatário não encontrado");
                return null;
            }

            const userTo = decode64(userToEncoded);

            console.log("[FROM]", userFrom);
            console.log("[TO]", userTo);

            /**
             * Atualiza contato do destinatário
             */
            await db
                .collection("users")
                .doc(userTo)
                .collection("contacts")
                .doc(encode64(userFrom))
                .set({
                    lastMessage: messageDoc.content || "",
                    lastMessageTime: admin.firestore.FieldValue.serverTimestamp()
                }, { merge: true });

            /**
             * Atualiza contato do remetente
             */
            await db
                .collection("users")
                .doc(userFrom)
                .collection("contacts")
                .doc(encode64(userTo))
                .set({
                    lastMessage: messageDoc.content || "",
                    lastMessageTime: admin.firestore.FieldValue.serverTimestamp()
                }, { merge: true });

            console.log("[FINISH]", new Date());

            return true;

        } catch (err) {

            console.error("[ERROR]", err);

            return null;

        }

    }
);