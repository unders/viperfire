import * as firebase from "firebase";
import { base64 } from "../lib/base64";

export interface Claims { admin: boolean; }
export const defaultClaims: Claims = { admin: false };

export interface ResultClaims {
    claims: Claims;
    err: string|null;
}

export interface UserContext {
    readonly signedIn: boolean;
    readonly uid: string;
    readonly name: string;
    readonly email: string;
    readonly claims: Claims;
}

export class User {
    readonly signedIn: boolean;
    readonly uid: string;
    readonly name: string;
    readonly email: string;
    readonly claims: Claims;

    constructor(ctx: UserContext) {
        this.signedIn = ctx.signedIn;
        this.uid = ctx.uid;
        this.name = ctx.name;
        this.email = ctx.email;
        this.claims = ctx.claims;
    }

    withClaims(claims: Claims): User {
        return new User({
            signedIn: this.signedIn,
            uid: this.uid,
            name: this.name,
            email: this.email,
            claims: claims
        });
    }

    static parseIdToken(t: string): ResultClaims {
        try {
            const payload = JSON.parse(base64.decodeUnicode(t.split('.')[1]));
            return { claims: { admin: payload["admin"] }, err: null };
        } catch(e) {
            return { claims: defaultClaims, err: e.message };
        }
    }

    static signedOut(): User {
        return new User({
            signedIn: false,
            uid: "",
            name: "",
            email: "",
            claims: defaultClaims
        });
    }

    static fromFirebase(user: firebase.UserInfo): User {
        return new User({
            signedIn: true,
            uid: user.uid,
            name: user.displayName || "",
            email: user.email || "",
            claims: defaultClaims
        });
    }
}
