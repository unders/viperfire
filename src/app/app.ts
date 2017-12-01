import * as firebase from "firebase";
import { userBuilder } from "../shared/data/user";
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
        const counter = this.updatePageCounter(msg);
        const presenter = this.domain.article().all({ currentUser: this.presenter.currentUser });
        this.renderPage(counter, (): Presenter => {
            this.page.articleList(presenter);
            return presenter;
        });
    }

    aboutVisit() { this.about("aboutVisit"); }
    aboutBack()  { this.about("aboutBack"); }
    about(msg: string) {
        const counter = this.updatePageCounter(msg);
        const presenter = this.domain.about(this.presenter.currentUser);
        this.renderPage(counter, (): Presenter => {
            this.page.about(presenter);
            return presenter;
        });
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

        this.renderPage(counter, (): Presenter => {
            this.page.profile(presenter);
            return presenter;
        });
    }

    private renderPage(counter: number, callback: () => Presenter): void {
        try {
            if (counter === this.pageCounter) {
                this.presenter = callback();
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
