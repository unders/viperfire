import { Presenter } from "./presenter";
import { errorPath } from "../path/path";
import { User } from "../data/user";

interface Context {
    readonly currentUser: User;
    readonly title: string;
    readonly message: string;
}

interface Serialize {
    readonly title: string;
    readonly isPresenter: boolean;
    readonly path: string;
    readonly currentUser: User;
    readonly message: string;
}

export class ErrorPresenter implements Presenter {
    readonly title: string;
    readonly isPresenter: boolean = true;
    readonly path: string = errorPath;
    readonly currentUser: User;
    readonly message: string;

    constructor(ctx: Context) {
        this.currentUser = ctx.currentUser;
        this.title = ctx.title;
        this.message = ctx.message;
    }

    toJSON(): string {
        return JSON.stringify(this.toObject());
    }

    static FromCode(code: number, currentUser: User) {
        switch (code) {
            case 404:
                return new ErrorPresenter({
                    title: "Not Found",
                    message: "Page Not Found",
                    currentUser: currentUser});
            default:
                return new ErrorPresenter({
                    title: "Internal Error",
                    message: "Internal Error",
                    currentUser: currentUser});
        }
    }

    static Init(p: Presenter): ErrorPresenter {
        const pr = p as ErrorPresenter;
        return new ErrorPresenter({
            title: pr.title,
            currentUser: pr.currentUser,
            message: pr.message
        });
    }

    private toObject(): Serialize {
        return {
            title: this.title,
            isPresenter: this.isPresenter,
            path:        this.path,
            currentUser: this.currentUser,
            message:     this.message
        };
    }
}
