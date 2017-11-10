import { bind } from '../dom/dom'
import { View } from "../shared/view/view";
import { User } from "../shared/data/user";
import { Presenter } from "../shared/presenter/presenter";
import { Logger } from "../log/log";
import { Domain } from "../domain/domain";
import { articleListPath, aboutPath, profilePath } from '../shared/path/path';
import { ArticleListPresenter } from '../shared/presenter/article_list';
import { AboutPresenter } from '../shared/presenter/about';
import { ProfilePresenter } from "../shared/presenter/profile";

class Context {
    readonly root: Element;
    readonly view: View;
    readonly presenter: Presenter;
    readonly logger: Logger;
    readonly domain: Domain
}

export class App {
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;
    private readonly view: View;
    private readonly logger: Logger;
    private readonly domain: Domain;
    private presenter: Presenter;
    private pageCounter: number = 0;

    constructor(ctx: Context) {
        this.html = bind(ctx.root);
        this.view = ctx.view;
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
        this.view.renderArticleList(this.html, p);
    }

    aboutVisit() { this.about("aboutVisit"); }
    aboutBack()  { this.about("aboutBack"); }
    about(msg: string) {
        this.updatePageCounter(msg);
        const p = this.domain.about(this.presenter.currentUser);
        this.presenter = p;
        this.view.renderAbout(this.html, p);
    }

    profileVisit(uid: string) { this.profile(uid, "profileVisit"); }
    profileBack(uid: string)  { this.profile(uid, "profileBack"); }
    async profile(uid: string, msg: string) {
        const counter = this.updatePageCounter(msg);
        const { code, presenter, err } = await this.domain.profile().get({uid: uid, currentUser: this.presenter.currentUser});
        if (err) {
            this.logger.error(`could not get resource=profile/${uid}; code=${code}; error=${err}`);
            // show snackBar error message; code = 404 or 500
            return;
        }

        if (counter === this.pageCounter) {
            this.presenter = presenter;
            this.view.renderProfile(this.html, presenter);
        } else {
            this.logger.info(`${counter} !== ${this.pageCounter}`);
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
                this.view.renderArticleList(this.html, this.presenter as ArticleListPresenter);
                break;
            case aboutPath:
                this.view.renderAbout(this.html, this.presenter as AboutPresenter);
                break;
            case profilePath:
                this.view.renderProfile(this.html, this.presenter as ProfilePresenter);
                break;
            default:
                this.logger.error(`app.render() failed; path=${path} found no match`);
        }
    }
}
