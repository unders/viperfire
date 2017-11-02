import { wire } from '../dom/dom'
import { Config } from '../shared/config/config'
import { App } from "../shared/view/app";
import { User } from "../shared/data/user";
import { renderMainPageLayout } from "../shared/view/layout";
import { InitialState } from "../shared/data/state";

class Context {
    app: App;
}

class Page {
    private readonly user: User = new User({name: "", signedIn: false});
    private readonly app: App;

    constructor(ctx: Context) {
        this.app = ctx.app;
    }

    articleList(msg: string): string {
        const html = this.app.renderArticleList(wire(), this.user, { message: msg });
        const state = new InitialState({ user: this.user, path: "/" }).toJSON();
        const ctx = { title: "Index page", html: html, initialState: state, path: "/" };
        return renderMainPageLayout(wire(), ctx);
    }

    about(): string {
        const html = this.app.renderAbout(wire(), this.user);
        const state = new InitialState({ user: this.user, path: "/about" }).toJSON();
        const ctx = { title: "About page", html: html, initialState: state, path: "/about" };
        return renderMainPageLayout(wire(), ctx);
    }
}

export const newPage = function(c: Config): Page {
    return new Page({ app: c.app, });
};
