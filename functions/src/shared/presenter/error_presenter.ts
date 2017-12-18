import { PageLoader, ContextPresenter, SerializePresenter } from "./presenter";
import { path } from "../path/url";
import { User } from "../data/user";
import { time } from "../lib/time";
import { Presenter } from "./base";

interface Context extends ContextPresenter {
    readonly title: string;
    readonly message: string;
}

interface Serialize extends SerializePresenter {
    readonly title: string;
    readonly message: string;
}

interface FromCode {
    readonly pageLoader: PageLoader;
    readonly currentUser: User;
}

export class ErrorPresenter extends Presenter {
    readonly message: string;

    constructor(ctx: Context) {
        super(ctx);
        super.init({ title: ctx.title, path: path.error });
        this.message = ctx.message;
    }

    static FromCode(code: number, ctx: FromCode) {
        switch (code) {
            case 404:
                return new ErrorPresenter({
                    pageLoader: ctx.pageLoader,
                    currentUser: ctx.currentUser,
                    ago: time.ago(),
                    title: "Not Found",
                    message: "Page Not Found"
                });
            default:
                return new ErrorPresenter({
                    pageLoader: ctx.pageLoader,
                    currentUser: ctx.currentUser,
                    ago: time.ago(),
                    title: "Internal Error",
                    message: "Internal Error"
                });
        }
    }

    static Init(p: Presenter): ErrorPresenter {
        const pr = p as ErrorPresenter;
        return new ErrorPresenter({
            pageLoader: pr.pageLoader,
            currentUser: pr.currentUser,
            ago: time.ago(),
            title: pr.title,
            message: pr.message
        });
    }

    toJSON(): string {
        return JSON.stringify(this.toObject());
    }

    private toObject(): Serialize {
        return {
            pageLoader:  this.pageLoader,
            title:       this.title,
            isPresenter: this.isPresenter,
            path:        this.path,
            currentUser: this.currentUser,
            message:     this.message
        };
    }
}
