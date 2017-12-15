import * as admin from "firebase-admin";
import { ErrorContext, errorBuilder } from "../shared/data/error";
import { path } from "../shared/path/db";

interface Context {
    firestore: admin.firestore.Firestore;
}

export class ErrorDomain {
    private readonly db: admin.firestore.Firestore;

    constructor(ctx: Context) {
        this.db = ctx.firestore;
    }

    async log(ctx: ErrorContext): Promise<void> {
        const data = errorBuilder.Data(ctx);
        try {
            await this.db.collection(path.errors).add(data);
            console.error(`Error (see errors collection): ${errorBuilder.toJSON(data)}`);
        } catch(e) {
            console.error(`Could not save error: ${errorBuilder.toJSON(data)}; error: ${e.message}`);
        }
    }
}
