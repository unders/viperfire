import { User } from "./user";
import { ArticleListContext } from "../view/article_list";

declare global {
    interface Window { __INITIAL_STATE__: string; }
}

export interface IState {
    isState: boolean
    path: string;
    user: User;
    toJSON(): string
}

interface Result {
    state: IState|null;
    errMessage: string;
}


export const getInitialState = function(): Result {
    try {
        const o = JSON.parse(window.__INITIAL_STATE__);
        const state = o as IState;
        state.isState;
        return { state: state, errMessage: "" };
    } catch(e) {
        return { state: null, errMessage: e.message };
    }
};

interface ArticleList {
    readonly path: string;
    readonly user: User;
    readonly articleList: ArticleListContext;
}


export class State {
    isState: boolean = true;
    path: string;
    user: User;

    constructor(path: string, user: User) {
        this.path = path;
        this.user = user;
    }
}

export class ArticleListState extends State {
    articleList: ArticleListContext;

    constructor(ctx: ArticleList) {
        super(ctx.path, ctx.user);
        this.articleList = ctx.articleList;
    }

    toJSON(): string {
        return JSON.stringify({
            isState: true,
            path: this.path,
            user: this.user,
            articleList: this.articleList,
        });
    }
}

export class AboutState extends State {
    constructor(path: string, user: User) {
        super(path, user);
    }

    toJSON(): string {
        return JSON.stringify({
            isState: true,
            path: this.path,
            user: this.user,
        });
    }
}

