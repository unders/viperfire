import { wire } from '../dom/dom'
import { View } from "../shared/view/view";
import { renderMainPageLayout } from "../shared/view/layout";
import { ProfilePresenter } from "../shared/presenter/profile";
import { AboutPresenter } from "../shared/presenter/about";
import { ArticleListPresenter } from "../shared/presenter/article_list";
import { ErrorPresenter } from "../shared/presenter/error";
import { User } from "../shared/data/user";

class Context {
    view: View;
}

export class Page {
    private readonly view: View;

    constructor(ctx: Context) {
        this.view = ctx.view;
    }

    articleList(p: ArticleListPresenter): string {
        const html = this.view.renderArticleList(wire(), p);
        const ctx = { title: "Index page", html: html, initialState: p.toJSON() };
        return renderMainPageLayout(wire(), ctx);
    }

    profile(p: ProfilePresenter): string {
        const html = this.view.renderProfile(wire(), p);
        const ctx = { title: "Profile page", html: html, initialState: p.toJSON() };
        return renderMainPageLayout(wire(), ctx);
    }

    about(p: AboutPresenter): string {
        const html = this.view.renderAbout(wire(), p);
        const ctx = { title: "About page", html: html, initialState: p.toJSON() };
        return renderMainPageLayout(wire(), ctx);
    }

    error(code: number, currentUser: User): string {
        const p = ErrorPresenter.FromCode(code, currentUser);
        const html = this.view.renderError(wire(), p);
        const ctx = { title: p.message, html: html, initialState: p.toJSON() };
        return renderMainPageLayout(wire(), ctx);
    }
}

