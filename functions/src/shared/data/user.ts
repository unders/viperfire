import * as firebase from "firebase";

interface Context {
    readonly signedIn: boolean
    readonly uid: string;
    readonly name: string
    readonly email: string
}

export class User {
    readonly signedIn: boolean;
    readonly uid: string;
    readonly name: string;
    readonly email: string;

    constructor(ctx: Context) {
        this.signedIn = ctx.signedIn;
        this.uid = ctx.uid;
        this.name = ctx.name;
        this.email = ctx.email;
    }

    static signedOut(): User {
        return new User({ uid: "", name: "", signedIn: false, email: "" });
    }

    static fromFirebase(user: firebase.UserInfo): User {
        return new User({
            uid: user.uid,
            name: user.displayName || "",
            signedIn: true,
            email: user.email || ""
        });
    }
}
