import * as admin from "firebase-admin";
import { ErrorContext, Error } from "../shared/data/error";
import { errorCollection } from "../shared/domain/error";

export interface Context {
    firestore: admin.firestore.Firestore;
}

export class Err {
    private readonly db: admin.firestore.Firestore;

    constructor(ctx: Context) {
        this.db = ctx.firestore;
    }

    async log(ctx: ErrorContext): Promise<void> {
        const error = new Error(ctx);
        try {
            const x = await this.db.collection(errorCollection).add(error.toData());
        } catch(e) {
            console.error(`Could not save error: ${error.toJSON()}; error: ${e.message}`);
        }
    }
}
