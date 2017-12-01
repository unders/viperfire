import { Presenter } from "./presenter";
import { User } from "../data/user";
import { profilePath } from "../path/path";
import { UserProfile, userProfileBuilder } from "../data/user_profile";

interface Context {
    readonly currentUser: User;
    readonly userProfile: UserProfile;
}

interface Serialize {
    readonly title: string;
    readonly isPresenter: boolean;
    readonly path: string;
    readonly currentUser: User;
    readonly userProfile: UserProfile;
}

export class ProfilePresenter implements Presenter {
    readonly title: string = "Profile";
    readonly isPresenter: boolean = true;
    readonly path: string = profilePath;
    readonly currentUser: User;
    readonly userProfile: UserProfile;

    constructor(ctx: Context) {
        this.currentUser = ctx.currentUser;
        this.userProfile = ctx.userProfile;
    }

    static Init(p: Presenter): ProfilePresenter {
        const pr = p as ProfilePresenter;
        return new ProfilePresenter({
            currentUser: pr.currentUser,
            userProfile: pr.userProfile
        });
    }

    static Empty(uid: string, currentUser: User): ProfilePresenter {
        return new ProfilePresenter({
            currentUser: currentUser,
            userProfile: userProfileBuilder.empty(uid),
        })
    }

    toJSON(): string {
        return JSON.stringify(this.toObject());
    }

    private toObject(): Serialize {
        return {
            title:       this.title,
            isPresenter: this.isPresenter,
            path:        this.path,
            currentUser: this.currentUser,
            userProfile: this.userProfile
        };
    }
}
