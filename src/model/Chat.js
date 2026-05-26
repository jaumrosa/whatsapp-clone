import { collection, doc, addDoc,
         getDoc, getDocs, query, where } from "firebase/firestore";  // ✅ imports v9+
import { Firebase } from "../utils/Firebase.js";
import { Model }   from "./Model.js";

export class Chat extends Model {
    constructor() {
        super();
    }

    get users(){ 
        return this._data.users; 
    }
    set users(value){ 
        this._data.users = value; 
    }

    get timeStamp(){ 
        return this._data.timeStamp; 
    }
    set timeStamp(value){ 
        this._data.timeStamp = value; 
    }

    static getRef() {
        return collection(Firebase.db(), 'chats');
    }

    static create(myEmail, contactEmail) {
        return new Promise((resolve, reject) => {
            let users = {};
            users[btoa(myEmail)]      = true;
            users[btoa(contactEmail)] = true;

            addDoc(Chat.getRef(), { 
                users,
                timeStamp: new Date()
            })
            .then(docRef => {
                getDoc(doc(Chat.getRef(), docRef.id))
                    .then(chat => resolve(chat))
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
        });
    }

    static find(myEmail, contactEmail) {
        const q = query(        
            Chat.getRef(),
            where(`users.${btoa(myEmail)}`,      '==', true),
            where(`users.${btoa(contactEmail)}`, '==', true)
        );
        return getDocs(q);             
    }

    static createIfNotExists(myEmail, contactEmail) {
        return new Promise((resolve, reject) => {
            Chat.find(myEmail, contactEmail)
                .then(chats => {
                    if (chats.empty) {
                        Chat.create(myEmail, contactEmail)
                            .then(chat => resolve(chat))
                            .catch(err => reject(err));
                    } else {
                        chats.forEach(chat => resolve(chat));
                    }
                })
                .catch(err => reject(err));
        });
    }
}
