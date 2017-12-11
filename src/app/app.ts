import * as firebase from "firebase";
import { userBuilder } from "../shared/data/user";
import { Logger } from "../log/log";
import { Domain } from "../domain/domain";
import { Page } from "../page/page";

class Context {
    readonly page: Page;
    readonly domain: Domain;
    readonly logger: Logger;
}

export class App {
    private readonly page: Page;
    private readonly domain: Domain;
    private readonly logger: Logger;

    constructor(ctx: Context) {
        this.page = ctx.page;
        this.domain = ctx.domain;
        this.logger = ctx.logger;
    }

    //
    // Page transitions
    //

    rootVisit() { this.root("rootVisit"); }
    rootBack() { this.root("rootBack"); }
    async root(msg: string) {
        const pageNumber = this.page.loading(msg);
        const query = this.domain.article().queryPublished(this.page.nextArticlePageToken());
        const { articleList, domainError } = await this.domain.article().all(query);
        if (domainError) {
            this.page.showError(pageNumber, 500, domainError);
            return;
        }

        this.page.showArticleList(pageNumber, articleList);
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
        } else {
            this.logger.info("signed out");
            const uid = this.page.presenter.currentUser.uid;
            this.page.presenter.currentUser = currentUser;
            this.domain.profile().unsubscribe(uid);
        }
        this.page.render();

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
}
