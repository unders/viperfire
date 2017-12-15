import { bind, wireRender } from "../dom/dom";
import { View } from "../shared/view/view";
import { ArticleListPresenter } from "../shared/presenter/article_list_presenter";
import { ProfilePresenter } from "../shared/presenter/profile_presenter";
import { AboutPresenter } from "../shared/presenter/about_presenter";
import { ErrorPresenter } from "../shared/presenter/error_presenter";
import { Presenter } from "../shared/presenter/presenter";
import { path } from '../shared/path/url';
import { UserProfile } from "../shared/data/user_profile";
import { Logger } from "../log/log";
import { loader }  from "./loader"
import { ArticleList } from "../shared/domain/article_domain";
import { Article } from "../shared/data/article";
import { ArticlePresenter } from "../shared/presenter/article_presenter";

class Context {
    readonly body: Element;
    readonly view: View;
    readonly presenter: Presenter;
    readonly logger: Logger;
}

export class Page {
    private readonly logger: Logger;
    private readonly renderBody: wireRender;
    private readonly view: View;
    presenter: Presenter;
    pageNumber: number = 0;

    constructor(ctx: Context) {
        this.renderBody = bind(ctx.body);
        this.view = ctx.view;
        this.presenter = ctx.presenter;
        this.logger = ctx.logger;
    }

    loading(msg: string): number {
        loader.start(this);
        this.pageNumber++;
        this.logger.info(`loading(${this.pageNumber})=${msg}`);
        return this.pageNumber;
    }

    showArticleList(pageNumber: number, articleList: ArticleList): void {
        const show = (): void => {
            const p = ArticleListPresenter.Next(this.presenter, articleList);
            this.renderArticleList(p);
        };

        this.showPage(pageNumber, show);
    }

    private renderArticleList(p: ArticleListPresenter): void {
        document.title = p.title;
        this.view.renderArticleList(this.renderBody, p);
        this.presenter = p;
    }

    showArticle(pageNumber: number, article: Article): void {
        const show = (): void => {
            const p = ArticlePresenter.Next(this.presenter, article);
            this.renderArticle(p);
        };

        this.showPage(pageNumber, show);
    }

    private renderArticle(p: ArticlePresenter): void {
        document.title = p.title;
        this.view.renderArticle(this.renderBody, p);
        this.presenter = p;
    }

    showProfile(pageNumber: number, userProfile: UserProfile): void {
        const show = (): void => {
            const p = ProfilePresenter.Next(this.presenter, userProfile);
            this.renderProfile(p);
        };

        this.showPage(pageNumber, show);
    }

    private renderProfile(p: ProfilePresenter): void {
        document.title = p.title;
        this.view.renderProfile(this.renderBody, p);
        this.presenter = p;
    }

    showAbout(pageNumber: number): void {
        const show = (): void => {
            this.renderAbout();
        };

        this.showPage(pageNumber, show)
    }

    renderAbout(): void {
        const p = AboutPresenter.Next(this.presenter);
        this.view.renderAbout(this.renderBody, p);
        document.title = p.title;
        this.presenter = p;
    }

    private showPage(pageNumber: number, show: () => void): void {
        try {
            if (pageNumber === this.pageNumber) {
                loader.done(this);
                show();
                loader.reset(this);
            } else {
                this.logger.info(`cancel visit => ${pageNumber} !== ${this.pageNumber}`);
            }
        } catch(e) {
            this.showError(pageNumber, 500, e.message);
        }
    }

    showError(pageNumber: number, code: number, err: string): void {
        this.logger.error(`visit error; code=${code}; error=${err}`);
        if (pageNumber === this.pageNumber) {
            loader.done(this);
            const p = ErrorPresenter.FromCode(code, this.presenter);
            this.renderError(p);
            loader.reset(this);
        } else {
            this.logger.info(`cancel error visit => ${pageNumber} !== ${this.pageNumber}`);
        }
    }

    private renderError(p: ErrorPresenter): void {
        this.view.renderError(this.renderBody, p);
        document.title = p.title;
        this.presenter = p;
    }

    render(): void {
        // Note: update presenter/presenter.ts also.
        try {
            switch(this.presenter.path) {
                case path.articles:
                    this.renderArticleList(this.presenter as ArticleListPresenter);
                    break;
                case path.articleRegExp:
                    this.renderArticle(this.presenter as ArticlePresenter);
                    break;
                case path.about:
                    this.renderAbout();
                    break;
                case path.profileReqExp:
                    this.renderProfile(this.presenter as ProfilePresenter);
                    break;
                case path.error:
                    this.renderError(this.presenter as ErrorPresenter);
                    break;
                default:
                    this.logger.error(`page.Render() failed; error=path=${path} not found`);
            }
        } catch(e) {
            // TODO: show an popup error message.
            this.logger.error(`page.Render() failed; error=${e.message}`);
        }
    }
}
