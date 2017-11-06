import { bind } from '../dom/dom'
import { View } from "../shared/view/view";
import { ArticleListState, AboutState, IState, ProfileState } from "../shared/data/state";

class Context {
    root: Element;
    state: IState;
    view: View;
}

export class Page {
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;
    private readonly view: View;
    private readonly state: IState;

    constructor(ctx: Context) {
        this.html = bind(ctx.root);
        this.view = ctx.view;
        this.state = ctx.state;
    }

    render() {
        if (this.state.path == "/") {
            const state = this.state as ArticleListState;
            this.view.renderArticleList(this.html, state);
        }

        if (this.state.path == "/about") {
            const state = this.state as AboutState;
            this.view.renderAbout(this.html, state);
        }

        if (this.state.path == "/profile/:uid") {
            const state = this.state as ProfileState;
            this.view.renderProfile(this.html, state);
        }
    }
}

