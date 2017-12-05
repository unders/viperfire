import * as admin from "firebase-admin";
import { ErrorContext, errorBuilder } from "../shared/data/error";
import { errorCollection } from "../shared/domain/error_domain";

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
            const x = await this.db.collection(errorCollection).add(data);
            console.error(`Error (see errors collection): ${errorBuilder.toJSON(data)}`);
        } catch(e) {
            console.error(`Could not save error: ${errorBuilder.toJSON(data)}; error: ${e.message}`);
        }
    }
}
