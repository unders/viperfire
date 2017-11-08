import { bind } from '../dom/dom'
import { View } from "../shared/view/view";
import { AboutState, ArticleListState, IState, ProfileState } from "../shared/data/state";
import { User } from "../shared/data/user";
import { Logger } from "../log/log";

class Context {
    readonly root: Element;
    readonly view: View;
    readonly state: IState;
    readonly logger: Logger;
}

export class App {
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;
    private readonly view: View;
    private readonly logger: Logger;
    private state: IState;

    constructor(ctx: Context) {
        this.html = bind(ctx.root);
        this.view = ctx.view;
        this.state = ctx.state;
        this.logger = ctx.logger;
    }

    //
    // Page transitions
    //

    rootVisit() { this.root("rootVisit"); }
    rootBack() { this.root("rootBack"); }
    root(msg: string) {
        this.logger.info(msg);
        const ctx  = { path: "/", user: this.state.user, articleList: { message: "Hello World"} };
        const state = new ArticleListState(ctx);
        this.state = state;
        this.view.renderArticleList(this.html, state);
    }

    aboutVisit() { this.about("aboutVisit"); }
    aboutBack()  { this.about("aboutBack"); }
    about(msg: string) {
        this.logger.info(msg);
        this.state = new AboutState('/about', this.state.user);
        this.view.renderAbout(this.html, this.state);
    }

    profileVisit(uid: string) { this.profile(uid, "profileVisit"); }
    profileBack(uid: string)  { this.profile(uid, "profileBack"); }
    profile(uid: string, msg: string) {
        this.logger.info(msg);
        const currentUser = this.state.user;
        let name = this.state.user.name;
        if (currentUser.uid !== uid) {
            // if user not found show 404 page.
            // domain/profile/profile.get(uid): User
            name  = "we should get this from the server or a local cache";
        }

        const state = new ProfileState({path: "/profile/:uid", user: currentUser, ctx: { name: name }});
        this.state = state;
        this.view.renderProfile(this.html, state);
    }

    notFound(path: string) {
        this.logger.info(path);
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
        this.logger.info(`render page=${this.state.path}`);

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
