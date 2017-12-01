import * as admin from "firebase-admin";
import { Claims } from "../shared/data/user";

interface Context {
    readonly admin: admin.app.App;
}
interface SetClaimsResult {
    claimError: string|null
}

export class AuthDomain {
    private readonly admin: admin.app.App;

    constructor(ctx: Context) {
        this.admin = ctx.admin;
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
