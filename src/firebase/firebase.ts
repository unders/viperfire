import * as firebase from "firebase";

const authOperationNotAllowed = "auth/operation-not-allowed";

interface AuthResult {
    user: firebase.UserInfo|null;
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
            const user = result.user as firebase.UserInfo;
            return { user: user, err: "" };
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
