import { Presenter } from "./presenter";
import { User } from "../data/user";
import { profilePath } from "../path/path";

interface Context {
    readonly currentUser: User;
    readonly profileUser: User;
}

interface Serialize {
    readonly isPresenter: boolean;
    readonly path: string;
    readonly currentUser: User;
    readonly profileUser: User;
}

export class ProfilePresenter implements Presenter {
    readonly isPresenter: boolean = true;
    readonly path: string = profilePath;
    readonly currentUser: User;
    readonly profileUser: User;

    constructor(ctx: Context) {
        this.currentUser = ctx.currentUser;
        this.profileUser = ctx.profileUser;
    }

    static Init(p: Presenter): ProfilePresenter {
        const pr = p as ProfilePresenter;
        return new ProfilePresenter({
            currentUser: pr.currentUser,
            profileUser: pr.profileUser
        });
    }


    static Empty(currentUser: User): ProfilePresenter {
        return new ProfilePresenter({
            currentUser: currentUser,
            profileUser: User.signedOut()
        })
    }

    toJSON(): string {
        return JSON.stringify(this.toObject());
    }

    private toObject(): Serialize {
        return {
            isPresenter: this.isPresenter,
            path:        this.path,
            currentUser: this.currentUser,
            profileUser: this.profileUser
        };
    }
}
