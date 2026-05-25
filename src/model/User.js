import {collection, doc, onSnapshot, getDoc, setDoc} from "firebase/firestore";
import {Firebase} from "../utils/Firebase.js";
import { Model } from "./Model.js";

export class User extends Model{
    constructor(id){
        super();
        if(id){
            this.getById(id);
        }
    }

    get name(){
        return this._data.name;
    }

    set name(value){
        this._data.name = value;
    }

    get email(){
        return this._data.email;
    }

    set email(value){
        this._data.email = value;
    }

    get photo() {
        return this._data.photo;
    }

    set photo(value){
        this._data.photo = value;
    }

    


    getById(id){
        return new Promise((s, f) => {
            onSnapshot(
                User.findByEmail(id),
                (doc) => {
                    this.fromJSON(doc.data());
                    s(doc);
                
                }, (err => {
                    f(err);
                })
            );
        });
    }

    save(){
        return setDoc(
            User.findByEmail(this.email),
            this.toJSON()
        )
    }

    static getRef(){
        return collection(Firebase.db(), 'users');
    }

    static findByEmail(email){
        return doc(User.getRef(), email);
    }

    static getContactsRef(id){
        const userDoc = doc(User.getRef(), id);
        return collection(userDoc, 'contacts');
    }

    addContact(contact){
        const contactDoc = doc(User.getContactsRef(this.email), btoa(contact.email));
        return setDoc(contactDoc, contact.toJSON());
    }

    getContacts(){
        return new Promise((s, f) => {
            onSnapshot(
                User.getContactsRef(this.email),
                (docs) => {
                    let contacts = [];
                    docs.forEach(doc => {
                        let data  = doc.data();
                        data.id = doc.id;
                        contacts.push(data);
                    });
                    this.trigger('contactschange', docs);
                    s(contacts);
                }
            );
        });
    }
}
