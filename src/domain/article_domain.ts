import * as firebase from "firebase";
import { ArticleListPresenter } from "../shared/presenter/article_list_presenter";
import { User } from "../shared/data/user";

interface Context {
    firestore: firebase.firestore.Firestore;
}

interface AllContext {
    readonly currentUser: User;
}

export class ArticleDomain {
    private readonly db: firebase.firestore.Firestore;

    constructor(ctx: Context) {
        this.db = ctx.firestore;
    }

    all(ctx: AllContext): ArticleListPresenter {
        return new ArticleListPresenter({ currentUser: ctx.currentUser, message: "Hello World" });
    }
}
