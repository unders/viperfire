import { bind } from '../dom/dom'
import { View } from "../shared/view/view";
import { User } from "../shared/data/user";
import { Presenter } from "../shared/presenter/presenter";
import { Logger } from "../log/log";
import { Domain } from "../domain/domain";
import { articleListPath, aboutPath, profilePath, errorPath } from '../shared/path/path';
import { ArticleListPresenter } from '../shared/presenter/article_list';
import { AboutPresenter } from '../shared/presenter/about';
import { ProfilePresenter } from "../shared/presenter/profile";
import { ErrorPresenter } from "../shared/presenter/error";
import { Page } from "../page/page";

class Context {
    readonly page: Page;
    readonly presenter: Presenter;
    readonly logger: Logger;
    readonly domain: Domain
}

export class App {
    private readonly page: Page;
    private readonly logger: Logger;
    private readonly domain: Domain;
    private presenter: Presenter;
    private pageCounter: number = 0;

    constructor(ctx: Context) {
        this.page = ctx.page;
        this.presenter = ctx.presenter;
        this.logger = ctx.logger;
        this.domain = ctx.domain;
    }

    //
    // Page transitions
    //

    rootVisit() { this.root("rootVisit"); }
    rootBack() { this.root("rootBack"); }
    root(msg: string) {
        this.updatePageCounter(msg);
        const p = this.domain.article().all({ currentUser: this.presenter.currentUser });
        this.presenter = p;
        this.page.articleList(p);
    }

    aboutVisit() { this.about("aboutVisit"); }
    aboutBack()  { this.about("aboutBack"); }
    about(msg: string) {
        this.updatePageCounter(msg);
        const p = this.domain.about(this.presenter.currentUser);
        this.presenter = p;
        this.page.about(p);
    }

    profileVisit(uid: string) { this.profile(uid, "profileVisit"); }
    profileBack(uid: string)  { this.profile(uid, "profileBack"); }
    async profile(uid: string, msg: string) {
        const counter = this.updatePageCounter(msg);
        const { code, presenter, err } = await this.domain.profile().get({uid: uid, currentUser: this.presenter.currentUser});
        if (err) {
            this.renderError(counter, code, err);
            return;
        }

        if (counter === this.pageCounter) {
            this.presenter = presenter;
            this.page.profile(presenter);
        } else {
            this.logger.info(`${counter} !== ${this.pageCounter}`);
        }
    }

    private renderError(pageCounter: number, code: number, err: string): void {
        this.logger.info(`renderError: code=${code}; error=${err}`);
        if (pageCounter === this.pageCounter) {
            const p = ErrorPresenter.FromCode(code, this.presenter.currentUser);
            this.presenter = p;
            this.page.error(p);
        } else {
            this.logger.info(`${pageCounter} !== ${this.pageCounter}`);
        }
    }

    private updatePageCounter(msg: string): number {
        this.pageCounter++;
        this.logger.info(`${msg}; visitCount=${this.pageCounter}`);
        return this.pageCounter;
    }

    //
    // State Changes
    //
    onUserStateChanged(currentUser: User): void {
        const uid = this.presenter.currentUser.uid;
        this.presenter.currentUser = currentUser;
        this.render();
        if (currentUser.signedIn) {
            this.domain.profile().subscribe(currentUser.uid);
        } else {
            this.domain.profile().unsubscribe(uid);
        }
    }

    //
    // Render current page
    //
    render() {
        const path = this.presenter.path;
        this.logger.info(`render path=${path}`);

        switch(path) {
            case articleListPath:
                this.page.articleList(this.presenter as ArticleListPresenter);
                break;
            case aboutPath:
                this.page.about(this.presenter as AboutPresenter);
                break;
            case profilePath:
                this.page.profile(this.presenter as ProfilePresenter);
                break;
            case errorPath:
                this.page.error(this.presenter as ErrorPresenter);
                break;
            default:
                this.logger.error(`app.render() failed; path=${path}  -  Not Found`);
        }
    }
}
