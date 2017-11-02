import { User } from "./user";
import { ArticleListContext } from "../view/article_list";

declare global {
    interface Window { __INITIAL_STATE__: string; }
}

interface Path {
    path: string
}

interface Result {
    path: string;
    initialState: object|null;
    errMessage: string;
}

export const getInitialState = function(): Result {
    try {
        const state = JSON.parse(window.__INITIAL_STATE__);
        const { path } = state as Path;
        return { path: path, initialState: state, errMessage: "" };
    } catch(e) {
        return { path: "", initialState: null, errMessage: e.message };
    }
};

interface ArticleList {
    readonly path: string;
    readonly user: User;
    readonly articleList: ArticleListContext;
}

interface About {
    readonly path: string;
    readonly user: User;
}

interface InitResult {
    state: State|null;
    err: string;
}

export class State {
    path: string;
    user: User;
    articleList: ArticleListContext;

    init(path: string, o: object): InitResult {
        try {
            switch (path) {
                case "/":
                    const al = o as ArticleList;
                    this.path = path;
                    this.user = al.user;
                    this.articleList = al.articleList;
                    break;
                case "/about":
                    const about = o as About;
                    this.path = path;
                    this.user = about.user;
                    break;
                default:
                    return { state: null, err: `path: ${path} not found` };
            }

            return { state: this, err: "" }
        } catch(e) {
            return { state: null, err: e.message };
        }
    }

    articleListToJSON(): string {
        return JSON.stringify(this.getArticleList());
    }

    getArticleList(): ArticleList {
        return {
            path: this.path,
            user: this.user,
            articleList: this.articleList
        }
    }

    aboutToJSON(): string {
        return JSON.stringify(this.getAbout());
    }

    getAbout(): About {
        return {
            path: this.path,
            user: this.user,
        }
    }
}

