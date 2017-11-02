import { wire } from '../dom/dom'
import { View } from "../shared/view/view";
import { User } from "../shared/data/user";
import { State } from "../shared/data/state";
import { renderMainPageLayout } from "../shared/view/layout";

class Context {
    view: View;
}

interface Result {
    body: string;
    err: string|null;
}

export class Page {
    private readonly user: User = new User({name: "", signedIn: false});
    private readonly view: View;

    constructor(ctx: Context) {
        this.view = ctx.view;
    }

    articleList(path: string, msg: string): Result {
        const { state, err } = new State().init(path, { user: this.user, articleList: { message: msg }});
        if (state === null) {
            return { body: "", err: "Could not init state; error= " + err }
        }
        const html = this.view.renderArticleList(wire(), this.user, { message: msg });
        const jsonState = state.articleListToJSON();
        const ctx = { title: "Index page", html: html, initialState: jsonState };
        return { body: renderMainPageLayout(wire(), ctx), err: null };
    }

    about(path: string): Result {
        const { state, err } = new State().init(path, { user: this.user });
        if (state === null) {
            return { body: "", err: "Could not init state; error= " + err }
        }
        const html = this.view.renderAbout(wire(), this.user);
        const jsonState = state.aboutToJSON();
        const ctx = { title: "About page", html: html, initialState: jsonState };
        return { body: renderMainPageLayout(wire(), ctx), err: null };
    }
}

