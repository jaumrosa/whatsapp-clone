import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider,
         signInWithPopup } from "firebase/auth";

export class Firebase {
    constructor() {
        this._config = {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.FIREBASE_APP_ID,
            measurementId: process.env.FIREBASE_MEASUREMENT_ID
        };

        this.init();
    }

    init() {
        if (!Firebase._initialized) {
            Firebase._app = initializeApp(this._config);
            Firebase._analytics = getAnalytics(Firebase._app);
            Firebase._db = getFirestore(Firebase._app);
            Firebase._storage = getStorage(Firebase._app);
            Firebase._auth = getAuth(Firebase._app);
            Firebase._initialized = true;
        }
    }

    static db() {
        return Firebase._db;
    }

    static hd() {
        return Firebase._storage;
    }

    initAuth() {
        return new Promise((s, f) => {
            const provider = new GoogleAuthProvider();              
            signInWithPopup(Firebase._auth, provider)              
                .then(result => {
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential?.accessToken;
                    const user = result.user; 

                    s({
                        user,
                        token
                    });
                })
                .catch(err => {
                    f(err);
                });
        });
    }
}
