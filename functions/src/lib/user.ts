import * as admin from "firebase-admin";
import { User, Claims } from "../shared/data/user";

export const fromUserRecord = (user: admin.auth.UserRecord): User => {
    // user.photoURL || default image;
    // user.emailVerified
    return new User({
        signedIn: true,
        uid: user.uid,
        name: user.displayName || "",
        email: user.email || "",
        claims: user.customClaims as Claims
    });
};
