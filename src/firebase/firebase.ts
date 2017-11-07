import * as firebase from "firebase";
import { User } from "../shared/data/user";

const authOperationNotAllowed = "auth/operation-not-allowed";

interface AuthResult {
    user: User|null;
    err: string
}

export interface Auth {
    signInWithPopup(): Promise<AuthResult>
    signOut(): Promise<boolean>
}

export class Firebase {
    readonly firebase: firebase.app.App;

    constructor(firebase: firebase.app.App) {
        this.firebase = firebase;
    }

    authGoogle(event: OnAuthStateChanged): Auth {
        return new AuthGoogle(this.firebase, event);
    }

    userCache(): AuthResult {
        return new UserCache(this.firebase.options as Config).get();
    }
}


interface Config {
    apiKey: string;
}

class UserCache {
    readonly key: string;

    constructor(c: Config) {
        this.key = `firebase:authUser:${c.apiKey}:[DEFAULT]`;
    }

    get(): AuthResult {
        if(!window.localStorage) {
            return { user: null, err: `no local storage in this browser` };
        }

        const text = localStorage.getItem(this.key);
        if (!text) {
            return { user: null, err: `no user exists in local storage; apiKey=${this.key}` };
        }
        try {
            const u = JSON.parse(text) as firebase.UserInfo;
            return { user: User.fromFirebase(u), err: "" };
        } catch {
            return { user: null, err: `local storage JSON.parse(text) error of text: ${text}` };
        }
    }
}

interface OnAuthStateChanged {
    OnAuthStateChanged(user: firebase.UserInfo): void
}

class AuthGoogle {
    readonly firebase: firebase.app.App;

    constructor(firebase: firebase.app.App, event: OnAuthStateChanged) {
        this.firebase = firebase;

        this.firebase.auth().onAuthStateChanged((user: firebase.User) => {
            event.OnAuthStateChanged(user);
        });
    }

    async signInWithPopup(): Promise<AuthResult> {
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            const result = await this.firebase.auth().signInWithPopup(provider);
            const u = result.user as firebase.UserInfo;
            return { user: User.fromFirebase(u), err: "" };
        } catch (e) {
            const err = e as firebase.auth.Error;
            switch (err.code) {
                case authOperationNotAllowed:
                    return { user: null, err: err.message };
                default:
                    return { user: null, err: err.message };
            }
        }
    }

    async signOut(): Promise<boolean> {
        try {
            await this.firebase.auth().signOut();
            return true;
        } catch  {
            return false;
        }
    }
}
