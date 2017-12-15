import { PageLoader, Presenter } from "./presenter";
import { path } from "../path/url";
import { User } from "../data/user";
import { time, Ago } from "../lib/time";

interface Context {
    readonly pageLoader: PageLoader;
    readonly currentUser: User;
    readonly title: string;
    readonly message: string;
    readonly ago: Ago;
}

interface Serialize {
    readonly pageLoader: PageLoader;
    readonly title: string;
    readonly isPresenter: boolean;
    readonly path: string;
    readonly currentUser: User;
    readonly message: string;
}

interface FromCode {
    readonly pageLoader: PageLoader;
    readonly currentUser: User;
}

export class ErrorPresenter implements Presenter {
    readonly pageLoader: PageLoader;
    readonly title: string;
    readonly isPresenter: boolean = true;
    readonly path: string = path.error;
    readonly currentUser: User;
    readonly message: string;
    readonly ago: Ago;

    constructor(ctx: Context) {
        this.pageLoader = ctx.pageLoader;
        this.currentUser = ctx.currentUser;
        this.title = ctx.title;
        this.message = ctx.message;
        this.ago = ctx.ago;
    }

    static FromCode(code: number, ctx: FromCode) {
        switch (code) {
            case 404:
                return new ErrorPresenter({
                    pageLoader: ctx.pageLoader,
                    title: "Not Found",
                    message: "Page Not Found",
                    currentUser: ctx.currentUser,
                    ago: time.ago()});
            default:
                return new ErrorPresenter({
                    pageLoader: ctx.pageLoader,
                    title: "Internal Error",
                    message: "Internal Error",
                    currentUser: ctx.currentUser,
                    ago: time.ago()});
        }
    }

    static Init(p: Presenter): ErrorPresenter {
        const pr = p as ErrorPresenter;
        return new ErrorPresenter({
            pageLoader: pr.pageLoader,
            title: pr.title,
            currentUser: pr.currentUser,
            message: pr.message,
            ago: time.ago()
        });
    }

    toJSON(): string {
        return JSON.stringify(this.toObject());
    }

    private toObject(): Serialize {
        return {
            pageLoader: this.pageLoader,
            title: this.title,
            isPresenter: this.isPresenter,
            path:        this.path,
            currentUser: this.currentUser,
            message:     this.message
        };
    }
}
