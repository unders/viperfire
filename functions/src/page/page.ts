import { wire } from '../dom/dom'
import { View } from "../shared/view/view";
import { renderMainPageLayout } from "../shared/view/layout";
import { ProfilePresenter } from "../shared/presenter/profile_presenter";
import { AboutPresenter } from "../shared/presenter/about_presenter";
import { ArticleListPresenter } from "../shared/presenter/article_list_presenter";
import { ErrorPresenter } from "../shared/presenter/error_presenter";
import { User } from "../shared/data/user";
import { ArticleList } from "../shared/data/article_list";
import { PageLoader } from "../shared/presenter/presenter";
import { UserProfile } from "../shared/data/user_profile";

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

    articleList(articleList: ArticleList, currentUser: User): Result {
        const p = new ArticleListPresenter({
            pageLoader: PageLoader.Neutral,
            currentUser: currentUser,
            message: articleList.message,
        });
        return this.renderPage(p.currentUser, (): string =>  {
            const html = this.view.renderArticleList(wire(), p);
            const ctx = { title: p.title, html: html, initialState: p.toJSON() };
            return renderMainPageLayout(wire(), ctx);
        });
    }

    profile(userProfile: UserProfile, currentUser: User): Result {
        const p = new ProfilePresenter({
            pageLoader: PageLoader.Neutral,
            userProfile: userProfile,
            currentUser: currentUser
        });

        return this.renderPage(p.currentUser, (): string => {
            const html = this.view.renderProfile(wire(), p);
            const ctx = {title: p.title, html: html, initialState: p.toJSON()};
            return renderMainPageLayout(wire(), ctx);
        });
    }

    about(currentUser: User): Result {
        const p = new AboutPresenter({
            pageLoader: PageLoader.Neutral,
            currentUser: currentUser,
        });
        return this.renderPage(p.currentUser, (): string => {
            const html = this.view.renderAbout(wire(), p);
            const ctx = {title: p.title, html: html, initialState: p.toJSON()};
            return renderMainPageLayout(wire(), ctx);
        });
    }

    error(code: number, currentUser: User): string {
        try {
            const p = ErrorPresenter.FromCode(code, currentUser, PageLoader.Neutral);
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


