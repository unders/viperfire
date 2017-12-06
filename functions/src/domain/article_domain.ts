import * as admin from "firebase-admin";
import { ArticleList } from "../shared/data/article_list";
import { User } from "../shared/data/user";

interface Context {
    firestore: admin.firestore.Firestore;
}

interface AllContext {
    readonly size: number;
}

export class ArticleDomain {
    private readonly db: admin.firestore.Firestore;

    constructor(ctx: Context) {
        this.db = ctx.firestore;
    }

    all(ctx: AllContext): ArticleList {
        // TODO: fetch article from firestore.
        return new ArticleList({ message: "Hello World" });
    }
}
