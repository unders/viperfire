import { PageLoader, Presenter} from "./presenter";
import { User } from "../data/user";
import { path } from "../path/url";
import { UserProfile } from "../data/user_profile";

interface Context {
    readonly pageLoader: PageLoader;
    readonly currentUser: User;
    readonly userProfile: UserProfile;
}

interface Serialize {
    readonly pageLoader: PageLoader;
    readonly title: string;
    readonly isPresenter: boolean;
    readonly path: string;
    readonly currentUser: User;
    readonly userProfile: UserProfile;
}

export class ProfilePresenter implements Presenter {
    readonly pageLoader: PageLoader;
    readonly title: string = "Profile";
    readonly isPresenter: boolean = true;
    readonly path: string = path.profileReqExp;
    readonly currentUser: User;
    readonly userProfile: UserProfile;

    constructor(ctx: Context) {
        this.pageLoader = ctx.pageLoader;
        this.currentUser = ctx.currentUser;
        this.userProfile = ctx.userProfile;
    }

    static Next(p: Presenter, userProfile: UserProfile): ProfilePresenter {
        return new ProfilePresenter({
            pageLoader: p.pageLoader,
            currentUser: p.currentUser,
            userProfile: userProfile
        });
    }

    static Init(p: Presenter): ProfilePresenter {
        const pr = p as ProfilePresenter;
        return new ProfilePresenter({
            pageLoader: pr.pageLoader,
            currentUser: pr.currentUser,
            userProfile: pr.userProfile
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
            userProfile: this.userProfile
        };
    }
}
