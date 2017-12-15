import { User } from "../data/user";
import { path } from "../path/url";
import { ProfilePresenter } from "./profile_presenter";
import { AboutPresenter } from "./about_presenter";
import { ArticleListPresenter } from "./article_list_presenter";
import { ArticlePresenter } from "./article_presenter";
import { ErrorPresenter } from "./error_presenter";
import { Ago } from "../lib/time";

declare global {
    interface Window { __INITIAL_STATE__: string; }
}

export enum PageLoader {
    Neutral = 0,
    Loading = 1,
    Done = 2,
}

export interface Presenter {
    pageLoader: PageLoader;
    title: string;
    isPresenter: boolean;
    path: string;
    currentUser: User;
    toJSON(): string
    ago: Ago;
}

interface Result {
    presenter: Presenter|null;
    errMessage: string;
}

export const getPresenter = function(): Result {
    try {
        const o = JSON.parse(window.__INITIAL_STATE__);
        return buildPresenter(o as Presenter);
    } catch(e) {
        return { presenter: null, errMessage: e.message };
    }
};

const buildPresenter = (p: Presenter): Result => {
    // Note: update src/page/page.ts. also.
    try {
        switch(p.path) {
            case path.articles:
                return { presenter: ArticleListPresenter.Init(p), errMessage: "" };
            case path.articleRegExp:
                return { presenter: ArticlePresenter.Init(p), errMessage: "" };
            case path.profileReqExp:
                return { presenter: ProfilePresenter.Init(p), errMessage: "" };
            case path.about:
                return { presenter: AboutPresenter.Init(p), errMessage: "" };
            case path.error:
                return { presenter: ErrorPresenter.Init(p), errMessage: "" };
            default:
                return { presenter: null, errMessage: `${p.path} not found` };
        }
    } catch(e) {
        return { presenter: null, errMessage: e.message };
    }
};
