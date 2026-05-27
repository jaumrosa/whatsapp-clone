import {collection, doc, onSnapshot, getDoc, setDoc, query, where} from "firebase/firestore";
import {Firebase} from "../utils/Firebase.js";
import {ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";

export class Upload {
    static send(file, from){
        return new Promise((s, f) => {
            const storageRef = ref(Firebase.hd(), `${from}/${Date.now()}_${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed', e => {
                console.info('upload', e);
            }, err => {
                f(err);
            }, () => {
                s(uploadTask.snapshot.ref);
            });
        })
    }
}