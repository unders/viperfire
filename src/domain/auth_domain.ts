import * as firebase from "firebase";
import { User, userBuilder, ResultClaims } from "../shared/data/user";

export class AuthDomain {
    private readonly firebase: firebase.app.App;
    private readonly cache: CurrentUserCache;

    constructor(firebase: firebase.app.App) {
        this.firebase = firebase;
        this.cache = new CurrentUserCache(firebase.options as Config);
    }

    async getClaims(user: firebase.User): Promise<ResultClaims> {
        try {
            const t = await user.getIdToken();
            return userBuilder.parseIdToken(t);
        } catch(e) {
            return { claims: userBuilder.defaultClaims, err: e.message }
        }
    }

    onAuthStatChanged(callback: (user: firebase.User | null) => void): void {
        this.firebase.auth().onAuthStateChanged( async (user: firebase.User | null) => {
            callback(user);
        });
    }

    currentUser(): CurrentUserCache { return this.cache; }

    async signInWithGooglePopup(): Promise<UserResult>  {
        const provider = new firebase.auth.GoogleAuthProvider();
        const ctx = { firebase: this.firebase, provider: provider };
        return new SignInWithPopup(ctx).signIn();
    }

    async signInWithFacebookPopup(): Promise<UserResult>  {
        const provider = new firebase.auth.FacebookAuthProvider();
        const ctx = { firebase: this.firebase, provider: provider };
        return new SignInWithPopup(ctx).signIn();
    }

    async signInWithTwitterPopup(): Promise<UserResult>  {
        const provider = new firebase.auth.TwitterAuthProvider();
        const ctx = { firebase: this.firebase, provider: provider };
        return new SignInWithPopup(ctx).signIn();
    }

    async signInWithEmail(ctx: EmailAndPassword): Promise<UserResult> {
        try {
            const provider = new firebase.auth.EmailAuthProvider();
            const user = await this.firebase.auth().signInWithEmailAndPassword(ctx.email, ctx.password);
            const u = user as firebase.UserInfo;
            return { currentUser: userBuilder.fromFirebase(u), err: "" };
        } catch (e) {
            const err = e as firebase.auth.Error;
            return { currentUser: null, err: err.message }
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

interface EmailAndPassword {
    email: string;
    password: string;
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
    readonly provider: firebase.auth.AuthProvider;
}

class SignInWithPopup {
    private readonly firebase: firebase.app.App;
    private readonly provider: firebase.auth.AuthProvider;

    constructor(ctx: PopupContext) {
        this.firebase = ctx.firebase;
        this.provider = ctx.provider;
    }

    async signIn(): Promise<UserResult> {
        try {
            const result = await this.firebase.auth().signInWithPopup(this.provider);
            const u = result.user as firebase.UserInfo;
            return { currentUser: userBuilder.fromFirebase(u), err: "" };
        } catch (e) {
            const err = e as firebase.auth.Error;
            return { currentUser: null, err: err.message }
        }
    }
}
