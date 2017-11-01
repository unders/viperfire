import { wire } from '../dom/dom'
import { Config } from '../shared/config/config'
import { App } from "../shared/view/app";
import { User } from "../shared/data/user";

class Context {
    app: App;
}

class Page {
    private readonly app: App;

    constructor(ctx: Context) {
        this.app = ctx.app;
    }

    articleList(user: User, msg: string): string {
        const ctx = {user: user, message: msg};
        return this.app.renderArticleList(wire(ctx), user, { message: msg });
    }

    about(user: User): string {
        return this.app.renderAbout(wire(user), user);
    }
}

export const newPage = function(c: Config): Page {
    return new Page({ app: c.app, });
};
