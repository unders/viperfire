import { Presenter } from "./presenter";
import { User } from "../data/user";
import { aboutPath } from "../path/path";

interface Context {
    readonly currentUser: User;
}

interface Serialize {
    readonly isPresenter: boolean;
    readonly path: string;
    readonly currentUser: User;
}

export class AboutPresenter implements Presenter {
    readonly isPresenter: boolean = true;
    readonly path: string = aboutPath;
    readonly currentUser: User;

    constructor(ctx: Context) {
        this.currentUser = ctx.currentUser;
    }

    toJSON(): string {
        return JSON.stringify(this.toObject());
    }

    static Init(p: Presenter): AboutPresenter {
        return new AboutPresenter({ currentUser: p.currentUser });
    }

    private toObject(): Serialize {
        return {
            isPresenter: this.isPresenter,
            path:        this.path,
            currentUser: this.currentUser,
        };
    }
}
