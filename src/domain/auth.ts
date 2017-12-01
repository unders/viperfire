import * as firebase from "firebase";
import { User, userBuilder, ResultClaims } from "../shared/data/user";

export class Auth {
    private readonly firebase: firebase.app.App;
    private readonly cache: CurrentUserCache;

    constructor(firebase: firebase.app.App) {
        this.firebase = firebase;
        this.cache = new CurrentUserCache(firebase.options as Config);
    }

    async getClaims(user: firebase.User): Promise<ResultClaims> {
        const t = await user.getIdToken(true);
        return userBuilder.parseIdToken(t);
    }

    onAuthStatChanged(callback: (user: firebase.User) => void): void {
        this.firebase.auth().onAuthStateChanged(async (user: firebase.User) => {
            callback(user);
        });
    }

    currentUser(): CurrentUserCache { return this.cache; }
    GooglePopup(): SignInWithPopup {
        const provider = new firebase.auth.GoogleAuthProvider();
        return new SignInWithPopup({firebase: this.firebase, provider: provider});
    }
}

interface Config { apiKey: string; }

interface UserResult {
    currentUser: User|null;
    err: string
}

class CurrentUserCache {
    private readonly key: string;

    constructor(c: Config) {
        this.key = `firebase:authUser:${c.apiKey}:[DEFAULT]`;
    }

    getFromCache(): UserResult {
        if(!window.localStorage) {
            return { currentUser: null, err: "no local storage in this browser" };
        }

        const text = localStorage.getItem(this.key);
        if (!text) {
            return { currentUser: null, err: `no user exists in local storage; apiKey=${this.key}` };
        }
        try {
            const u = JSON.parse(text) as firebase.UserInfo;
            return { currentUser: userBuilder.fromFirebase(u), err: "" };
        } catch(e) {
            return { currentUser: null, err: `local storage JSON.parse(text); test=${text}; error=${e.message}` };
        }
    }
}

interface PopupContext {
    readonly firebase: firebase.app.App;
    readonly provider: firebase.auth.AuthCredential;
}

class SignInWithPopup {
    private readonly firebase: firebase.app.App;
    private readonly provider: firebase.auth.AuthCredential;

    constructor(ctx: PopupContext) {
        this.firebase = ctx.firebase;
        this.provider = ctx.provider;
    }

    async signInWithPopup(): Promise<UserResult> {
        try {
            const result = await this.firebase.auth().signInWithPopup(this.provider);
            const u = result.user as firebase.UserInfo;
            return { currentUser: userBuilder.fromFirebase(u), err: "" };
        } catch (e) {
            const err = e as firebase.auth.Error;
            return { currentUser: null, err: err.message}
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
