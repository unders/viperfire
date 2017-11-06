import { User } from "./user";
import { ArticleListContext } from "../view/article_list";
import { ProfileContext } from "../view/profile";

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

    static toJSON(o: object): string {
        const s = o as ArticleListState;
        return JSON.stringify({
            isState: true,
            path: s.path,
            user: s.user,
            articleList: s.articleList,
        });
    }

    // Only works on the server
    toJSON(): string {
        return ArticleListState.toJSON(this);
    }
}

interface Profile {
    readonly path: string;
    readonly user: User;
    readonly ctx: ProfileContext;
}

export class ProfileState extends State {
    ctx: ProfileContext;

    constructor(ctx: Profile) {
        super(ctx.path, ctx.user);
        this.ctx = ctx.ctx;
    }

    static toJSON(o: object): string {
        const s = o as ProfileState;
        return JSON.stringify({
            isState: true,
            path: s.path,
            user: s.user,
            ctx: s.ctx
        });
    }

    // Only works on server
    toJSON(): string {
        return ProfileState.toJSON(this);
    }
}

export class AboutState extends State {
    constructor(path: string, user: User) {
        super(path, user);
    }

    static toJSON(o: object): string {
        const s = o as AboutState;
        return JSON.stringify({
            isState: true,
            path: s.path,
            user: s.user,
        });
    }

    // Only works on server
    toJSON(): string {
        return AboutState.toJSON(this);
    }
}

