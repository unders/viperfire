import * as firebase from "firebase";
import { userBuilder } from "../shared/data/user";
import { Logger } from "../log/log";
import { Domain } from "../domain/domain";
import { Page } from "../page/page";
import { SnackbarHelper } from "./snackbar";
import { ErrorPopup, HiddenPopup, ContextError } from "../shared/presenter/popup";

class Context {
    readonly page: Page;
    readonly domain: Domain;
    readonly logger: Logger;
}

export class App {
    private readonly snackbar: SnackbarHelper;
    private readonly page: Page;
    private readonly domain: Domain;
    private readonly logger: Logger;

    constructor(ctx: Context) {
        this.page = ctx.page;
        this.domain = ctx.domain;
        this.logger = ctx.logger;
        this.snackbar = new SnackbarHelper({ page: this.page, logger: this.logger });
    }

    //
    // Page transitions
    //

    rootVisit(pageToken: string) { this.root(pageToken, "rootVisit"); }
    rootBack(pageToken: string) { this.root(pageToken, "rootBack"); }
    async root(pageToken: string, msg: string) {
        const pageNumber = this.page.loading(msg);
        const query = this.domain.article().queryDraft(pageToken);
        const { articleList, domainError } = await this.domain.article().all(query);
        if (domainError) {
            this.page.showError(pageNumber, 500, domainError);
            return;
        }

        this.page.showArticleList(pageNumber, articleList);
    }

    articleVisit(id: string) { this.article(id, "articleVisit"); }
    articleBack(id: string)  { this.article(id, "articleBack"); }
    async article(id: string, msg: string) {
        const pageNumber = this.page.loading(msg);
        const { code, article, error } = await this.domain.article().get(id);
        if (error) {
            this.page.showError(pageNumber, code, error);
            return;
        }

        this.page.showArticle(pageNumber, article);
    }

    aboutVisit() { this.about("aboutVisit"); }
    aboutBack()  { this.about("aboutBack"); }
    about(msg: string) {
        const pageNumber = this.page.loading(msg);
        this.page.showAbout(pageNumber);
    }

    profileVisit(uid: string) { this.profile(uid, "profileVisit"); }
    profileBack(uid: string)  { this.profile(uid, "profileBack"); }
    async profile(uid: string, msg: string) {
        const pageNumber = this.page.loading(msg);
        const { code, userProfile, err } = await this.domain.profile().get({ uid: uid });
        if (err) {
            this.page.showError(pageNumber, code, err);
            return;
        }

        this.page.showProfile(pageNumber, userProfile);
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
            this.snackbar.showSignedIn(currentUser.email);
        } else {
            this.logger.info("signed out");
            const uid = this.page.presenter.currentUser.uid;
            this.page.presenter.currentUser = currentUser;
            this.domain.profile().unsubscribe(uid);
        }

        if (currentUser.signedIn) {
            this.logger.info("getClaims()");
            const { claims, err } = await this.domain.auth().getClaims(user);
            if (err) {
                this.logger.error(err);
            }
            this.page.presenter.currentUser = userBuilder.withClaims(this.page.presenter.currentUser, claims);
        }

        this.page.render();
        this.logger.setUser(this.page.presenter.currentUser);
    }

    //
    // testing begin
    //
    showSnackbar(): void {
        this.snackbar.showUndo();
    }
    //
    // testing end
    //

    hideSnackbar(): void {
        this.snackbar.close();
    }

    hidePopup(): void {
        this.logger.info("app.closePopup()");
        this.page.presenter.popup = new HiddenPopup();
        this.page.render();
    }

    showPopup(ctx: ContextError): void {
        this.logger.info("app.showPopup()");
        this.page.presenter.popup = new ErrorPopup(ctx);
        this.page.render();
    }
}
