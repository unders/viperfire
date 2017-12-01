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

interface Result {
    body: string;
    pageError: string|null;
}

export class Page {
    private readonly view: View;

    constructor(ctx: Context) {
        this.view = ctx.view;
    }

    articleList(p: ArticleListPresenter): Result {
        return this.renderPage(p.currentUser, (): string =>  {
            const html = this.view.renderArticleList(wire(), p);
            const ctx = { title: p.title, html: html, initialState: p.toJSON() };
            return renderMainPageLayout(wire(), ctx);
        });
    }

    profile(p: ProfilePresenter): Result {
        return this.renderPage(p.currentUser, (): string => {
            const html = this.view.renderProfile(wire(), p);
            const ctx = {title: p.title, html: html, initialState: p.toJSON()};
            return renderMainPageLayout(wire(), ctx);
        });
    }

    about(p: AboutPresenter): Result {
        return this.renderPage(p.currentUser, (): string => {
            const html = this.view.renderAbout(wire(), p);
            const ctx = {title: p.title, html: html, initialState: p.toJSON()};
            return renderMainPageLayout(wire(), ctx);
        });
    }

    error(code: number, currentUser: User): string {
        try {
            const p = ErrorPresenter.FromCode(code, currentUser);
            const html = this.view.renderError(wire(), p);
            const ctx = { title: p.title, html: html, initialState: p.toJSON() };
            return renderMainPageLayout(wire(), ctx);
        } catch(e) {
            console.error(`page.error() failed; error=${e.message}`);
            return "Internal Error";
        }
    }

    private renderPage = (currentUser: User, callback: () => string): Result => {
        try {
            return { body: callback(), pageError: null };
        } catch(e) {
            return { body: this.error(500, currentUser), pageError: e.message };
        }
    };

}


