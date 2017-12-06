import { PageLoader, Presenter } from "./presenter";
import { User } from "../data/user";
import { articleListPath } from "../path/path";
import { ArticleList } from "../data/article_list";

interface Context {
    readonly pageLoader: PageLoader;
    readonly currentUser: User;
    readonly message: string;
}

interface Serialize {
    readonly pageLoader: PageLoader;
    readonly title: string;
    readonly isPresenter: boolean;
    readonly path: string;
    readonly currentUser: User;
    readonly message: string;
}

export class ArticleListPresenter implements Presenter {
    readonly pageLoader: PageLoader;
    readonly title: string = "Articles";
    readonly isPresenter: boolean = true;
    readonly path: string = articleListPath;
    readonly currentUser: User;
    readonly message: string;

    constructor(ctx: Context) {
        this.pageLoader = ctx.pageLoader;
        this.currentUser = ctx.currentUser;
        this.message = ctx.message;
    }

    static Next(p: Presenter, articleList: ArticleList): ArticleListPresenter {
        return new ArticleListPresenter({
            pageLoader: p.pageLoader,
            currentUser: p.currentUser,
            message: articleList.message
        });
    }

    static Init(p: Presenter): ArticleListPresenter {
        const pr = p as ArticleListPresenter;
        return new ArticleListPresenter({
            pageLoader: p.pageLoader,
            currentUser: pr.currentUser,
            message: pr.message
        });
    }

    toJSON(): string {
        return JSON.stringify(this.toObject());
    }

    private toObject(): Serialize {
        return {
            pageLoader: this.pageLoader,
            title: this.title,
            isPresenter: this.isPresenter,
            path:        this.path,
            currentUser: this.currentUser,
            message:      this.message
        };
    }
}
