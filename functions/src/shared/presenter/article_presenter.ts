import { PageLoader, Presenter } from "./presenter";
import { User } from "../data/user";
import { path } from "../path/url";
import { Article } from "../data/article";

interface Context {
    readonly pageLoader: PageLoader;
    readonly currentUser: User;
    readonly article: Article;
}

interface Serialize {
    readonly pageLoader: PageLoader;
    readonly title: string;
    readonly isPresenter: boolean;
    readonly path: string;
    readonly currentUser: User;
    readonly article: Article;
}

export class ArticlePresenter implements Presenter {
    readonly pageLoader: PageLoader;
    readonly title: string = "Article";
    readonly isPresenter: boolean = true;
    readonly path: string = path.articleRegExp;
    readonly currentUser: User;
    readonly article: Article;

    constructor(ctx: Context) {
        this.pageLoader = ctx.pageLoader;
        this.currentUser = ctx.currentUser;
        this.article = ctx.article;
    }

    static Next(p: Presenter, article: Article): ArticlePresenter {
        return new ArticlePresenter({
            pageLoader: p.pageLoader,
            currentUser: p.currentUser,
            article: article
        });
    }

    static Init(p: Presenter): ArticlePresenter {
        const pr = p as ArticlePresenter;
        return new ArticlePresenter({
            pageLoader: p.pageLoader,
            currentUser: pr.currentUser,
            article: pr.article
        });
    }

    toJSON(): string {
        return JSON.stringify(this.toObject());
    }

    private toObject(): Serialize {
        return {
            pageLoader: this.pageLoader,
            title:       this.title,
            isPresenter: this.isPresenter,
            path:        this.path,
            currentUser: this.currentUser,
            article:     this.article,
        };
    }
}
