import * as admin from "firebase-admin";
import { ArticleListPresenter } from "../shared/presenter/article_list_presenter";
import { User } from "../shared/data/user";

interface Context {
    firestore: admin.firestore.Firestore;
}

interface AllContext {
    readonly currentUser: User;
}

export class ArticleDomain {
    private readonly db: admin.firestore.Firestore;

    constructor(ctx: Context) {
        this.db = ctx.firestore;
    }

    all(ctx: AllContext): ArticleListPresenter {
        // TODO: fetch article from firestore.
        return new ArticleListPresenter({ currentUser: ctx.currentUser, message: "Hello World" });
    }
}
