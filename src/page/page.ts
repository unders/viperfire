import { bind } from '../dom/dom'
import { View } from "../shared/view/view";
import { State } from "../shared/data/state";

class Context {
    root: Element;
    state: State;
    view: View;
}

export class Page {
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;
    private readonly view: View;
    private readonly state: State;

    constructor(ctx: Context) {
        this.html = bind(ctx.root);
        this.view = ctx.view;
        this.state = ctx.state;
    }

    render() {
        if (this.state.path == "/") {
            const { path, user, articleList } = this.state.getArticleList();
            this.view.renderArticleList(this.html, user, articleList);
        }

        if (this.state.path == "/about") {
            const { user } = this.state.getAbout();
            this.view.renderAbout(this.html, user);
        }
    }
}

