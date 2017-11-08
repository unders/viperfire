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
    rootVisit() {
        console.log("rootVisit");
    }
    rootBack() {
        console.log("rootBack");
    }

    aboutVisit() {
        console.log("aboutVisit");
    }
    aboutBack() {
        console.log("aboutBack");
    }

    profileVisit(uid: string) {
        console.log("profileVisit");
    }

    profileBack(uid: string) {
        console.log("profileBack");
    }

    notFound(path: string) {
        console.log("notFound");
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
        this.logger.info("render page");

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
