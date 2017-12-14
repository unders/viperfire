import { PageLoader, Presenter } from "./presenter";
import { User } from "../data/user";
import { path } from "../path/url";

interface Context {
    readonly pageLoader: PageLoader;
    readonly currentUser: User;
}

interface Serialize {
    readonly pageLoader: PageLoader;
    readonly title: string;
    readonly isPresenter: boolean;
    readonly path: string;
    readonly currentUser: User;
}

export class AboutPresenter implements Presenter {
    readonly pageLoader: PageLoader;
    readonly title: string = "About";
    readonly isPresenter: boolean = true;
    readonly path: string = path.about;
    readonly currentUser: User;

    constructor(ctx: Context) {
        this.pageLoader = ctx.pageLoader;
        this.currentUser = ctx.currentUser;
    }

    static Init(p: Presenter): AboutPresenter {
        return new AboutPresenter({
            pageLoader: p.pageLoader,
            currentUser: p.currentUser
        });
    }

    toJSON(): string {
        return JSON.stringify(this.toObject());
    }

    private toObject(): Serialize {
        return {
            pageLoader: this.pageLoader,
            title:       this.title,
            isPresenter: this.isPresenter,
            path:        this.path,
            currentUser: this.currentUser,
        };
    }
}
