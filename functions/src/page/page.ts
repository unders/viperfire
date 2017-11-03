import { wire } from '../dom/dom'
import { View } from "../shared/view/view";
import { AboutState, ArticleListState } from "../shared/data/state";
import { renderMainPageLayout } from "../shared/view/layout";

class Context {
    view: View;
}

export class Page {
    private readonly view: View;

    constructor(ctx: Context) {
        this.view = ctx.view;
    }

    articleList(state: ArticleListState): string {
        const html = this.view.renderArticleList(wire(), state);
        const ctx = { title: "Index page", html: html, initialState: state.toJSON() };
        return renderMainPageLayout(wire(), ctx);
    }

    about(state: AboutState): string {
        const html = this.view.renderAbout(wire(), state);
        const ctx = { title: "About page", html: html, initialState: state.toJSON() };
        return renderMainPageLayout(wire(), ctx);
    }
}

