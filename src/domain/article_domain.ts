import * as firebase from "firebase";
import { ArticleList } from "../shared/data/article_list";

interface Context {
    firestore: firebase.firestore.Firestore;
}

interface AllContext {
    readonly size: number;
}

export class ArticleDomain {
    private readonly db: firebase.firestore.Firestore;

    constructor(ctx: Context) {
        this.db = ctx.firestore;
    }

    all(ctx: AllContext): ArticleList {
        return new ArticleList({ message: "Hello World" });
    }
}
