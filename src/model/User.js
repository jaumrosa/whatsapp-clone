import {collection, doc} from "firebase/firestore";
import {ClassEvent} from "../utils/ClassEvent.js";
import {Firebase} from "../utils/Firebase.js";

export class User extends ClassEvent {
    static getRef() {
        return collection(Firebase.db(), 'users');
    }

    static findByEmail(email) {
        return doc(User.getRef(), email);
    }
}
