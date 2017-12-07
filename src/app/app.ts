import * as firebase from "firebase";
import { userBuilder } from "../shared/data/user";
import { Presenter, PageLoader } from "../shared/presenter/presenter";
import { Logger } from "../log/log";
import { Domain } from "../domain/domain";
import { Page } from "../page/page";

class Context {
    readonly page: Page;
    readonly logger: Logger;
    readonly domain: Domain
}

export class App {
    private readonly page: Page;
    private readonly logger: Logger;
    private readonly domain: Domain;
    private pageCounter: number = 0;

    constructor(ctx: Context) {
        this.page = ctx.page;
        this.logger = ctx.logger;
        this.domain = ctx.domain;
    }

    //
    // Page transitions
    //

    rootVisit() { this.root("rootVisit"); }
    rootBack() { this.root("rootBack"); }
    root(msg: string) {
        // const pageNumber = this.page.visit(msg);
        // const articleList = this.domain.article().all({ size: 30 } );
        // this.page.showArticleList(pageNumber, articleList);
        const counter = this.updatePageCounter(msg);
        const articleList = this.domain.article().all({ size: 30 } );
        this.renderPage(counter, (): void => {
            this.page.articleList(articleList);
        });
    }

    aboutVisit() { this.about("aboutVisit"); }
    aboutBack()  { this.about("aboutBack"); }
    about(msg: string) {
        const counter = this.updatePageCounter(msg);
        this.renderPage(counter, (): void => {
            this.page.about();
        });
    }

    profileVisit(uid: string) { this.profile(uid, "profileVisit"); }
    profileBack(uid: string)  { this.profile(uid, "profileBack"); }
    async profile(uid: string, msg: string) {
        const counter = this.updatePageCounter(msg);
        const { code, userProfile, err } = await this.domain.profile().get({ uid: uid });
        if (err) {
            this.renderError(counter, code, err);
            return;
        }

        this.renderPage(counter, (): void => {
            return this.page.profile(userProfile);
        });
    }

    private renderPage(counter: number, callback: () => void): void {
        try {
            if (counter === this.pageCounter) {
                this.setDonePageLoader();
                callback();
                this.delayResetPageLoader();
            } else {
                this.logger.info(`skipping render page => ${counter} !== ${this.pageCounter}`);
            }
        } catch(e) {
            this.renderError(counter, 500, e.message);
        }
    }

    private renderError(pageCounter: number, code: number, err: string): void {
        this.logger.error(`render page error; code=${code}; error=${err}`);
        if (pageCounter === this.pageCounter) {
            this.setDonePageLoader();
            this.page.error(code);
            this.delayResetPageLoader();
        } else {
            this.logger.info(`skipping render page error => ${pageCounter} !== ${this.pageCounter}`);
        }
    }

    private updatePageCounter(msg: string): number {
        this.setLoadingPageLoader();

        this.pageCounter++;
        this.logger.info(`${msg}; visitCount=${this.pageCounter}`);
        return this.pageCounter;
    }
    private delayResetPageLoader(): void {
        const reset = (pageCounter: number): void => {
            if (this.pageCounter === pageCounter) {
                this.resetPageLoader();
            }
        };

        setTimeout(reset, 300, this.pageCounter);
    }
    private resetPageLoader(): void {
        if (this.page.presenter.pageLoader !== PageLoader.Neutral) {
            this.page.presenter.pageLoader = PageLoader.Neutral;
            this.render();
        }
    }
    private setLoadingPageLoader(): void {
        this.resetPageLoader();

        this.page.presenter.pageLoader = PageLoader.Loading;
        this.render();
    }
    private setDonePageLoader(): void {
        const done = (pageCounter: number): void => {
            if (this.pageCounter !== pageCounter) {
                return;
            }

            if (this.page.presenter.pageLoader === PageLoader.Loading) {
                this.page.presenter.pageLoader = PageLoader.Done;
            }
            this.render();
        };

        setTimeout(done, 100, this.pageCounter);
    }

    //
    // State Changes
    //
    async onUserStateChanged(user: firebase.User): Promise<void> {
        let currentUser = userBuilder.signedOut();
        if (user) {
            currentUser = userBuilder.fromFirebase(user);
            this.logger.info(`signed in as: ${currentUser.name}`);
            this.page.presenter.currentUser = currentUser;
            this.domain.profile().subscribe(user.uid);
        } else {
            this.logger.info("signed out");
            const uid = this.page.presenter.currentUser.uid;
            this.page.presenter.currentUser = currentUser;
            this.domain.profile().unsubscribe(uid);
        }
        this.render();

        if (currentUser.signedIn) {
            this.logger.info("getClaims()");
            const { claims, err } = await this.domain.auth().getClaims(user);
            if (err) {
                this.logger.error(err);
            }
            this.page.presenter.currentUser = userBuilder.withClaims(this.page.presenter.currentUser, claims);
        }

        this.render();
        this.logger.setUser(this.page.presenter.currentUser);
    }

    //
    // Render current page
    //
    render() {
        const path = this.page.presenter.path;

        if (this.page.render()) {
            this.logger.info(`render path=${path}`);
        } else {
            this.logger.info(`failed to render path=${path}`);
        }
    }
}
