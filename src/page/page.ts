import { bind, wireRender } from "../dom/dom";
import { View } from "../shared/view/view";
import { ArticleListPresenter } from "../shared/presenter/article_list_presenter";
import { ProfilePresenter } from "../shared/presenter/profile_presenter";
import { AboutPresenter } from "../shared/presenter/about_presenter";
import { ErrorPresenter } from "../shared/presenter/error_presenter";

class Context {
    readonly body: Element;
    view: View;
}

export class Page {
    private readonly renderBody: wireRender;
    private readonly view: View;

    constructor(ctx: Context) {
        this.renderBody = bind(ctx.body);
        this.view = ctx.view;
    }

    articleList(p: ArticleListPresenter): void {
        this.view.renderArticleList(this.renderBody, p);
        document.title = p.title;
    }

    profile(p: ProfilePresenter): void {
        this.view.renderProfile(this.renderBody, p);
        document.title = p.title;
    }

    about(p: AboutPresenter): void {
        this.view.renderAbout(this.renderBody, p);
        document.title = p.title;
    }

    error(p: ErrorPresenter): void {
        this.view.renderError(this.renderBody, p);
        document.title = p.title;
    }
}
