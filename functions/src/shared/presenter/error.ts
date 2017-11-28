import { Presenter } from "./presenter";
import { errorPath } from "../path/path";
import { User } from "../data/user";

interface Context {
    readonly currentUser: User;
    readonly message: string
}

interface Serialize {
    readonly isPresenter: boolean;
    readonly path: string;
    readonly currentUser: User;
    readonly message: string
}

export class ErrorPresenter implements Presenter {
    readonly isPresenter: boolean = true;
    readonly path: string = errorPath;
    readonly currentUser: User;
    readonly message: string;

    constructor(ctx: Context) {
        this.currentUser = ctx.currentUser;
        this.message = ctx.message;
    }

    toJSON(): string {
        return JSON.stringify(this.toObject());
    }

    static FromCode(code: number, currentUser: User) {
        switch (code) {
            case 404:
                return new ErrorPresenter({message: "Page Not Found", currentUser: currentUser});
            default:
                return new ErrorPresenter({message: "Internal Error", currentUser: currentUser});
        }
    }

    static Init(p: Presenter): ErrorPresenter {
        const pr = p as ErrorPresenter;
        return new ErrorPresenter({
            currentUser: pr.currentUser,
            message: pr.message
        });
    }

    private toObject(): Serialize {
        return {
            isPresenter: this.isPresenter,
            path:        this.path,
            currentUser: this.currentUser,
            message:     this.message
        };
    }
}
