import { bind, wireRender } from "../dom/dom";
import { View } from "../shared/view/view";
import { ArticleListPresenter } from "../shared/presenter/article_list_presenter";
import { ArticleList } from "../shared/data/article_list";
import { ProfilePresenter } from "../shared/presenter/profile_presenter";
import { AboutPresenter } from "../shared/presenter/about_presenter";
import { ErrorPresenter } from "../shared/presenter/error_presenter";
import { Presenter } from "../shared/presenter/presenter";
import { articleListPath, aboutPath, profilePath, errorPath } from '../shared/path/path';
import { UserProfile } from "../shared/data/user_profile";
import { Logger } from "../log/log";
import { loader }  from "./loader"

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
        const p = AboutPresenter.Init(this.presenter);
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
        const presenter =  this.presenter;
        const path = presenter.path;

        try {
            switch(path) {
                case articleListPath:
                    this.renderArticleList(presenter as ArticleListPresenter);
                    break;
                case aboutPath:
                    this.renderAbout();
                    break;
                case profilePath:
                    this.renderProfile(presenter as ProfilePresenter);
                    break;
                case errorPath:
                    this.renderError(presenter as ErrorPresenter);
                    break;
                default:
                    throw new Error(`path=${path} not found`);
            }
        } catch(e) {
            this.logger.error(`page.Render() failed; error=${e.message}`);
        }
    }
}
