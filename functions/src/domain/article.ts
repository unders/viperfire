import * as admin from "firebase-admin";
import { ArticleListPresenter } from "../shared/presenter/article_list";
import { User } from "../shared/data/user";

export interface Context {
    firestore: admin.firestore.Firestore;
}

interface AllContext {
    readonly currentUser: User;
}

export class Article {
    private readonly db: admin.firestore.Firestore;

    constructor(ctx: Context) {
        this.db = ctx.firestore;
    }

    all(ctx: AllContext): ArticleListPresenter {
        return new ArticleListPresenter({ currentUser: ctx.currentUser, message: "Hello World" });
    }
}
