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
    private pageNumber: number = 0;

    constructor(ctx: Context) {
        this.renderBody = bind(ctx.body);
        this.view = ctx.view;
        this.presenter = ctx.presenter;
        this.logger = ctx.logger;
    }

    // visit(msg: string): number {
    //     // this.setLoadingPageLoader();
    //
    //     this.pageNumber++;
    //     this.logger.info(`nextPage(${this.pageNumber})=${msg}`);
    //     return this.pageNumber;
    // }
    //
    // showArticleList(pageNumber: number, articleList: ArticleList): void {
    //
    // }

    articleList(articleList: ArticleList): void {
        const p = ArticleListPresenter.Next(this.presenter, articleList);
        this.articleListP(p);
    }
    private articleListP(p: ArticleListPresenter): void {
        document.title = p.title;
        this.view.renderArticleList(this.renderBody, p);
        this.presenter = p;
    }

    profile(userProfile: UserProfile): void {
        const p = ProfilePresenter.Next(this.presenter, userProfile);
        this.profileP(p);
    }
    private profileP(p: ProfilePresenter): void {
        document.title = p.title;
        this.view.renderProfile(this.renderBody, p);
        this.presenter = p
    }

    about(): void {
        const p = AboutPresenter.Init(this.presenter);
        this.view.renderAbout(this.renderBody, p);
        document.title = p.title;
        this.presenter = p;
    }

    error(code: number): void {
        const p = ErrorPresenter.FromCode(code, this.presenter.currentUser, this.presenter.pageLoader);
        this.errorP(p);
    }
    private errorP(p: ErrorPresenter): void {
        this.view.renderError(this.renderBody, p);
        document.title = p.title;
        this.presenter = p;
    }

    render(): boolean {
        const presenter =  this.presenter;
        const path = presenter.path;

        switch(path) {
            case articleListPath:
                this.articleListP(presenter as ArticleListPresenter);
                return true;
            case aboutPath:
                this.about();
                return true;
            case profilePath:
                this.profileP(presenter as ProfilePresenter);
                return true;
            case errorPath:
                this.errorP(presenter as ErrorPresenter);
                return true;
            default:
                return false;
        }
    }
}
