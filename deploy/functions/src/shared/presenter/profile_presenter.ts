import { ContextPresenter, SerializePresenter } from "./presenter";
import { path } from "../path/url";
import { UserProfile } from "../data/user_profile";
import { time } from "../lib/time";
import { Presenter } from "./base_presenter";

interface Context extends  ContextPresenter {
    readonly userProfile: UserProfile;
}

interface Serialize extends SerializePresenter {
    readonly userProfile: UserProfile;
}

export class ProfilePresenter extends Presenter {
    readonly userProfile: UserProfile;

    constructor(ctx: Context) {
        super(ctx);
        super.init({ title: "Profile", path: path.profileReqExp });
        this.userProfile = ctx.userProfile;
    }

    static Next(p: Presenter, userProfile: UserProfile): ProfilePresenter {
        return new ProfilePresenter({
            pageLoader: p.pageLoader,
            currentUser: p.currentUser,
            ago: time.ago(),
            userProfile: userProfile
        });
    }

    static Init(p: Presenter): ProfilePresenter {
        const pr = p as ProfilePresenter;
        return new ProfilePresenter({
            pageLoader: pr.pageLoader,
            currentUser: pr.currentUser,
            ago: time.ago(),
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
