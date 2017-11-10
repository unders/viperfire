import * as admin from "firebase-admin";

export interface Context {
    readonly admin: admin.app.App;
}

interface Claims {
    admin: boolean;
}

interface Result {
    ok: boolean
    err: string
}

export class Auth {
    private readonly admin: admin.app.App;

    constructor(ctx: Context) {
        this.admin = ctx.admin;
    }

    async setClaims(uid: string, claims: Claims): Promise<Result> {
        try {
            await this.admin.auth().setCustomUserClaims(uid, claims);
            return { ok: true, err: "" };
        } catch (e) {
            return { ok: false, err: e.message };
        }
    }
}
