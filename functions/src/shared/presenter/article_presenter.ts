import { ContextPresenter, SerializePresenter } from "./presenter";
import { path } from "../path/url";
import { Article } from "../data/article";
import { time } from "../lib/time";
import { Presenter } from "./base_presenter";

interface Context extends ContextPresenter {
    readonly article: Article;
}

interface Serialize extends SerializePresenter {
    readonly article: Article;
}

export class ArticlePresenter extends Presenter {
    readonly article: Article;

    constructor(ctx: Context) {
        super(ctx);
        super.init({ title: "Article", path: path.articleRegExp });
        this.article = ctx.article;
    }

    static Next(p: Presenter, article: Article): ArticlePresenter {
        return new ArticlePresenter({
            pageLoader: p.pageLoader,
            currentUser: p.currentUser,
            ago: time.ago(),
            article: article
        });
    }

    static Init(p: Presenter): ArticlePresenter {
        const pr = p as ArticlePresenter;
        return new ArticlePresenter({
            pageLoader: p.pageLoader,
            currentUser: pr.currentUser,
            ago: time.ago(),
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
