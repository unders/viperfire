import * as admin from "firebase-admin";
import { Claims, defaultClaims } from "../shared/data/user";

export interface Context {
    readonly admin: admin.app.App;
}
interface SetClaimsResult {
    claimError: string|null
}

export class Auth {
    private readonly admin: admin.app.App;

    constructor(ctx: Context) {
        this.admin = ctx.admin;
    }

    async setDefaultClaims(uid: string): Promise<SetClaimsResult> {
        return this.setClaims(uid, defaultClaims)
    }

    async setClaims(uid: string, claims: Claims): Promise<SetClaimsResult> {
        try {
            await this.admin.auth().setCustomUserClaims(uid, claims);
            return { claimError: null };
        } catch (e) {
            return { claimError: e.message };
        }
    }
}
