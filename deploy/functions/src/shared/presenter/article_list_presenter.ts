import { PageLoader, Presenter } from "./presenter";
import { User } from "../data/user";
import { path } from "../path/url";
import { ArticleList } from "../domain/article_domain";

interface Context {
    readonly pageLoader: PageLoader;
    readonly currentUser: User;
    readonly articleList: ArticleList;
}

interface Serialize {
    readonly pageLoader: PageLoader;
    readonly title: string;
    readonly isPresenter: boolean;
    readonly path: string;
    readonly currentUser: User;
    readonly articleList: ArticleList;
}

export class ArticleListPresenter implements Presenter {
    readonly pageLoader: PageLoader;
    readonly title: string = "Articles";
    readonly isPresenter: boolean = true;
    readonly path: string = path.articles;
    readonly currentUser: User;
    readonly articleList: ArticleList;

    constructor(ctx: Context) {
        this.pageLoader = ctx.pageLoader;
        this.currentUser = ctx.currentUser;
        this.articleList = ctx.articleList;
    }

    static Next(p: Presenter, articleList: ArticleList): ArticleListPresenter {
        return new ArticleListPresenter({
            pageLoader: p.pageLoader,
            currentUser: p.currentUser,
            articleList: articleList
        });
    }

    static Init(p: Presenter): ArticleListPresenter {
        const pr = p as ArticleListPresenter;
        return new ArticleListPresenter({
            pageLoader: p.pageLoader,
            currentUser: pr.currentUser,
            articleList: pr.articleList
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
            articleList: this.articleList,
        };
    }
}
