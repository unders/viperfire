import { Presenter } from "./presenter";
import { User } from "../data/user";
import { articleListPath } from "../path/path";

interface Context {
    readonly currentUser: User;
    readonly message: string;
}

interface Serialize {
    readonly title: string;
    readonly isPresenter: boolean;
    readonly path: string;
    readonly currentUser: User;
    readonly message: string;
}

export class ArticleListPresenter implements Presenter {
    readonly title: string = "Articles";
    readonly isPresenter: boolean = true;
    readonly path: string = articleListPath;
    readonly currentUser: User;
    readonly message: string;

    constructor(ctx: Context) {
        this.currentUser = ctx.currentUser;
        this.message = ctx.message;
    }

    toJSON(): string {
        return JSON.stringify(this.toObject());
    }

    static Init(p: Presenter): ArticleListPresenter {
        const pr = p as ArticleListPresenter;
        return new ArticleListPresenter({
            currentUser: pr.currentUser,
            message: pr.message
        });
    }

    private toObject(): Serialize {
        return {
            title: this.title,
            isPresenter: this.isPresenter,
            path:        this.path,
            currentUser: this.currentUser,
            message:      this.message
        };
    }
}
