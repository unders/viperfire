import { User } from "./user";
import { ArticleListContext } from "../view/article_list";

declare global {
    interface Window { __INITIAL_STATE__: string; }
}

interface Result {
    initialState: InitialState|null;
    errMessage: string;
}

export const getInitialState = function(): Result {
    try {
        const state = JSON.parse(window.__INITIAL_STATE__);
        return { initialState: state, errMessage: "" };
    } catch(e) {
        return { initialState: null, errMessage: e.message };
    }
};

interface Context {
    readonly user: User;
    readonly path: string;
}

export class InitialState {
    readonly user: User;
    readonly path: string;

    constructor(ctx: Context) {
        this.user = ctx.user;
        this.path = ctx.path;
    }

    toJSON(): string {
        return JSON.stringify({ user: this.user, path: this.path });
    }
}

interface ArticleList {
    readonly user: User;
    readonly ctx: ArticleListContext;
}

interface About {
    readonly user: User;
}

export class State {
    user: User;
    path: string;

    constructor(ctx: InitialState) {
        this.user = ctx.user;
        this.path = ctx.path;
    }

    getArticleList(): ArticleList {
        return {
            user: this.user,
            ctx: { message: "Hello World" },
        }
    }

    getAbout(): About {
        return {
            user: this.user,
        }
    }
}

