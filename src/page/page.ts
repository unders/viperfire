import { bind } from '../dom/dom'
import { App } from "../shared/view/app";
import { State } from "../shared/data/state";

class Context {
    root: Element;
    state: State;
    app: App;
}

export class Page {
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;
    private readonly app: App;
    private readonly state: State;

    constructor(ctx: Context) {
        this.html = bind(ctx.root);
        this.app = ctx.app;
        this.state = ctx.state;
    }

    render() {
        if (this.state.path == "/") {
            const { user, ctx } = this.state.getArticleList();
            this.app.renderArticleList(this.html, user, ctx);
        }

        if (this.state.path == "/about") {
            const { user } = this.state.getAbout();
            this.app.renderAbout(this.html, user);
        }
    }
}

