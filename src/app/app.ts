import { bind } from '../dom/dom'
import { View } from "../shared/view/view";
import { AboutState, ArticleListState, IState, ProfileState } from "../shared/data/state";
import { User } from "../shared/data/user";
import { Logger } from "../log/log";
import { Domain } from "../shared/domain/domain";

class Context {
    readonly root: Element;
    readonly view: View;
    readonly state: IState; // Rename it to presenter.
    readonly logger: Logger;
    readonly domain: Domain
}

export class App {
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;
    private readonly view: View;
    private readonly logger: Logger;
    private readonly domain: Domain;
    private state: IState;
    private pageCounter: number = 0;

    constructor(ctx: Context) {
        this.html = bind(ctx.root);
        this.view = ctx.view;
        this.state = ctx.state;
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
        const ctx  = { path: "/", user: this.state.user, articleList: { message: "Hello World"} };
        const state = new ArticleListState(ctx);
        this.state = state;
        this.view.renderArticleList(this.html, state);
    }

    aboutVisit() { this.about("aboutVisit"); }
    aboutBack()  { this.about("aboutBack"); }
    about(msg: string) {
        this.updatePageCounter(msg);
        this.state = new AboutState('/about', this.state.user);
        this.view.renderAbout(this.html, this.state);
    }

    profileVisit(uid: string) { this.profile(uid, "profileVisit"); }
    profileBack(uid: string)  { this.profile(uid, "profileBack"); }
    async profile(uid: string, msg: string) {
        const counter = this.updatePageCounter(msg);
        const currentUser = this.state.user;
        let name = this.state.user.name;
        // profile().get(uid); should return ProfilePresenter
        const { code, profile, err } = await this.domain.profile().get(uid);
        if (err) {
            this.logger.error(`could not get resource=profile/${uid}; code=${code}; error=${err}`);
            // show snackBar error message; code = 404 or 500
            return;
        }
        name  = profile.name;

        if (counter === this.pageCounter) {
            const state = new ProfileState({ path: "/profile/:uid", user: currentUser, ctx: { name: name } });
            this.state = state;
            this.view.renderProfile(this.html, state);
        } else {
            this.logger.info(`${counter} !== ${this.pageCounter}`);
        }
    }

    notFound(path: string) {
        this.logger.info(path);
    }

    internalError(): void {

    }

    private updatePageCounter(msg: string): number {
        this.pageCounter++;
        this.logger.info(`${msg}; visitCount=${this.pageCounter}`);
        return this.pageCounter;
    }

    //
    // State Changes
    //
    onUserStateChanged(user: User): void {
        this.state.user = user;
        this.render();
    }

    //
    // Render current page
    //
    render() {
        this.logger.info(`render path=${this.state.path}`);

        if (this.state.path === "/") {
            const state = this.state as ArticleListState;
            this.view.renderArticleList(this.html, state);
            return;
        }
        if (this.state.path === "/about") {
            const state = this.state as AboutState;
            this.view.renderAbout(this.html, state);
            return;
        }
        if (this.state.path === "/profile/:uid") {
            const state = this.state as ProfileState;
            this.view.renderProfile(this.html, state);
            return;
        }

        // we should never reach this part
        this.logger.error(`page render error; path=${this.state.path}; state=${this.state}`);
    }
}
