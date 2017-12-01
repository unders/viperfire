import { userBuilder, Claims, User } from "./user";

export interface UserProfile {
    readonly uid: string;
    readonly name: string;
    readonly email: string;
    readonly admin: boolean;
    readonly claims: Claims;
}

export class userProfileBuilder {
    static empty(uid: string): UserProfile {
        return {
            uid: uid,
            name: "",
            email: "",
            admin: false,
            claims: userBuilder.defaultClaims
        }
    }

    static fromDB(data: UserProfile): UserProfile {
        const claims = getClaims(data.claims);

        return {
            uid: data.uid,
            name: data.name,
            email: data.email,
            admin: claims[userBuilder.adminClaim],
            claims: claims
        }
    }

    static fromUser(data: User): UserProfile {
        const claims = getClaims(data.claims);

        return {
            uid: data.uid,
            name: data.name,
            email: data.email,
            admin: claims[userBuilder.adminClaim],
            claims: claims
        }
    }

    static toUser(data: UserProfile, signedIn: boolean): User {
        return {
            signedIn: signedIn,
            uid: data.uid,
            name: data.name,
            email: data.email,
            claims: data.claims
        };
    }
}

const getClaims = (claims: Claims): Claims => {
    if (!claims) {
        return userBuilder.defaultClaims
    }
    if (!claims.hasOwnProperty(userBuilder.adminClaim)) {
        return userBuilder.defaultClaims;
    }

    return claims;
};


