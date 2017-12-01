import * as firebase from "firebase";
import { base64 } from "../lib/base64";

export interface Claims { admin: boolean; }

export interface ResultClaims {
    claims: Claims;
    err: string|null;
}

export interface User {
    readonly signedIn: boolean;
    readonly uid: string;
    readonly name: string;
    readonly email: string;
    readonly claims: Claims;
}

export class userBuilder {
    static readonly adminClaim = "admin";
    static readonly defaultClaims: Claims = { admin: false };

    static parseIdToken(t: string): ResultClaims {
        try {
            const payload = JSON.parse(base64.decodeUnicode(t.split('.')[1]));
            return { claims: { admin: payload[userBuilder.adminClaim] }, err: null };
        } catch(e) {
            return { claims: userBuilder.defaultClaims, err: e.message };
        }
    }

    static withClaims(data: User, claims: Claims): User {
        return {
            signedIn: data.signedIn,
            uid: data.uid,
            name: data.name,
            email: data.email,
            claims: claims
        };
    }

    static signedOut(): User {
        return {
            signedIn: false,
            uid: "",
            name: "",
            email: "",
            claims: userBuilder.defaultClaims
        };
    }

    static fromFirebase(userInfo: firebase.UserInfo): User {
        return {
            signedIn: true,
            uid: userInfo.uid,
            name: userInfo.displayName || "",
            email: userInfo.email || "",
            claims: userBuilder.defaultClaims
        };
    }
}

