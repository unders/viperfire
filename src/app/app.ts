import * as firebase from "firebase";
import { userBuilder } from "../shared/data/user";
import { Presenter, PageLoader } from "../shared/presenter/presenter";
import { Logger } from "../log/log";
import { Domain } from "../domain/domain";
import { articleListPath, aboutPath, profilePath, errorPath } from '../shared/path/path';
import { ArticleListPresenter } from '../shared/presenter/article_list_presenter';
import { AboutPresenter } from '../shared/presenter/about_presenter';
import { ProfilePresenter } from "../shared/presenter/profile_presenter";
import { ErrorPresenter } from "../shared/presenter/error_presenter";
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
        const counter = this.updatePageCounter(msg, PageLoader.Loading);
        const articleList = this.domain.article().all({ size: 30 } );
        this.renderPage(counter, (): Presenter => {
            const presenter = ArticleListPresenter.Next(this.presenter, articleList);
            this.page.articleList(presenter);
            return presenter;
        });
    }

    aboutVisit() { this.about("aboutVisit"); }
    aboutBack()  { this.about("aboutBack"); }
    about(msg: string) {
        const counter = this.updatePageCounter(msg, PageLoader.Neutral);
        this.renderPage(counter, (): Presenter => {
            const presenter = AboutPresenter.Init(this.presenter);
            this.page.about(presenter);
            return presenter;
        });
    }

    profileVisit(uid: string) { this.profile(uid, "profileVisit"); }
    profileBack(uid: string)  { this.profile(uid, "profileBack"); }
    async profile(uid: string, msg: string) {
        const counter = this.updatePageCounter(msg, PageLoader.Loading);
        const { code, userProfile, err } = await this.domain.profile().get({ uid: uid });
        if (err) {
            this.renderError(counter, code, err);
            return;
        }

        this.renderPage(counter, (): Presenter => {
            const presenter = ProfilePresenter.Next(this.presenter, userProfile);
            this.page.profile(presenter);
            return presenter;
        });
    }

    private renderPage(counter: number, callback: () => Presenter): void {
        try {
            if (counter === this.pageCounter) {
                this.setDonePageLoader();
                this.presenter = callback();
                this.delayResetPageLoader();
            } else {
                this.logger.info(`${counter} !== ${this.pageCounter}`);
            }
        } catch(e) {
            this.renderError(counter, 500, e.message);
        }
    }

    private renderError(pageCounter: number, code: number, err: string): void {
        this.logger.error(`renderError: code=${code}; error=${err}`);
        if (pageCounter === this.pageCounter) {
            this.setDonePageLoader();
            const currentUser = this.presenter.currentUser;
            const pageLoader = this.presenter.pageLoader;
            const p = ErrorPresenter.FromCode(code, currentUser, pageLoader);
            this.presenter = p;
            this.page.error(p);
            this.delayResetPageLoader();
        } else {
            this.logger.info(`${pageCounter} !== ${this.pageCounter}`);
        }
    }

    private updatePageCounter(msg: string, pageLoader: PageLoader): number {
        this.setPageLoader(pageLoader);

        this.pageCounter++;
        this.logger.info(`${msg}; visitCount=${this.pageCounter}`);
        return this.pageCounter;
    }
    delayResetPageLoader(): void {
        const reset = (pageCounter: number): void => {
            if (this.pageCounter === pageCounter) {
                this.resetPageLoader();
            }
        };

        setTimeout(reset, 300, this.pageCounter);
    }
    resetPageLoader(): void {
        if (this.presenter.pageLoader !== PageLoader.Neutral) {
            this.presenter.pageLoader = PageLoader.Neutral;
            this.render();
        }
    }
    setPageLoader(pageLoader: PageLoader): void {
        this.resetPageLoader();

        this.presenter.pageLoader = pageLoader;
        this.render();
    }
    setDonePageLoader(): void {
        if (this.presenter.pageLoader === PageLoader.Loading) {
            this.presenter.pageLoader = PageLoader.Done;
        }
    }

    //
    // State Changes
    //
    async onUserStateChanged(user: firebase.User): Promise<void> {
        let currentUser = userBuilder.signedOut();
        if (user) {
            currentUser = userBuilder.fromFirebase(user);
            this.logger.info(`signed in as: ${currentUser.name}`);
            this.presenter.currentUser = currentUser;
            this.domain.profile().subscribe(user.uid);
        } else {
            this.logger.info("signed out");
            const uid = this.presenter.currentUser.uid;
            this.presenter.currentUser = currentUser;
            this.domain.profile().unsubscribe(uid);
        }
        this.render();

        if (currentUser.signedIn) {
            this.logger.info("getClaims()");
            const { claims, err } = await this.domain.auth().getClaims(user);
            if (err) {
                this.logger.error(err);
            }
            this.presenter.currentUser = userBuilder.withClaims(this.presenter.currentUser, claims);
        }

        this.render();
        this.logger.setUser(this.presenter.currentUser);
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
