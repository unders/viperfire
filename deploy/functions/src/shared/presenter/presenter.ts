import { User } from "../data/user";
import { aboutPath, profilePath, articleListPath, errorPath } from "../path/path";
import { ProfilePresenter } from "./profile_presenter";
import { AboutPresenter } from "./about_presenter";
import { ArticleListPresenter } from "./article_list_presenter";
import { ErrorPresenter } from "./error_presenter";

declare global {
    interface Window { __INITIAL_STATE__: string; }
}

export interface Presenter {
    title: string;
    isPresenter: boolean
    path: string;
    currentUser: User;
    toJSON(): string
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
    try {
        switch(p.path) {
            case articleListPath:
                return { presenter: ArticleListPresenter.Init(p), errMessage: "" };
            case profilePath:
                return { presenter: ProfilePresenter.Init(p), errMessage: "" };
            case aboutPath:
                return { presenter: AboutPresenter.Init(p), errMessage: "" };
            case errorPath:
                return { presenter: ErrorPresenter.Init(p), errMessage: "" };
            default:
                return { presenter: null, errMessage: `${p.path} not found` };
        }
    } catch(e) {
        return { presenter: null, errMessage: e.message };
    }
} ;
