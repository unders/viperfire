import { SerializePresenter, ContextPresenter } from "./presenter";
import { path } from "../path/url";
import { ArticleList } from "../domain/article_domain";
import { time } from "../lib/time";
import { Presenter } from "./base_presenter";

interface Context extends ContextPresenter {
    readonly articleList: ArticleList;
}

interface Serialize extends SerializePresenter {
    readonly articleList: ArticleList;
}

export class ArticleListPresenter extends Presenter {
    readonly articleList: ArticleList;

    constructor(ctx: Context) {
        super(ctx);
        super.init({ title: "Articles", path: path.articles });
        this.articleList = ctx.articleList;
    }

    static Next(p: Presenter, articleList: ArticleList): ArticleListPresenter {
        return new ArticleListPresenter({
            pageLoader: p.pageLoader,
            currentUser: p.currentUser,
            ago: time.ago(),
            articleList: articleList
        });
    }

    static Init(p: Presenter): ArticleListPresenter {
        const pr = p as ArticleListPresenter;
        return new ArticleListPresenter({
            pageLoader: p.pageLoader,
            currentUser: pr.currentUser,
            ago: time.ago(),
            articleList: pr.articleList,
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
