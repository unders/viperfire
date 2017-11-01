import { wire } from '../dom/dom'
import { Config } from '../shared/config/config'
import { App } from "../shared/view/app";
import { User } from "../shared/data/user";
import { renderMainPageLayout } from "../shared/view/layout";

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
        const app = this.app.renderArticleList(wire(), this.user, { message: msg });
        return renderMainPageLayout(wire(), { title: "Index page", app: app })
    }

    about(): string {
        const app = this.app.renderAbout(wire(), this.user);
        return renderMainPageLayout(wire(), { title: "About page", app: app })
    }
}

export const newPage = function(c: Config): Page {
    return new Page({ app: c.app, });
};
