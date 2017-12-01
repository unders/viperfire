import * as firebase from "firebase";
import { ProfileDomain } from "./profile_domain";
import { ArticleDomain } from "./article_domain";
import { AuthDomain } from "./auth_domain";
import { Logger } from "../log/log";
import { User } from "../shared/data/user";
import { ErrorPresenter } from "../shared/presenter/error_presenter";
import { AboutPresenter } from "../shared/presenter/about_presenter";

interface Context {
    readonly logger: Logger;
}

export class Domain {
    private readonly authDomain: AuthDomain;
    private readonly profileDomain: ProfileDomain;
    private readonly articleDomain: ArticleDomain;

    constructor(ctx: Context) {
        this.authDomain = new AuthDomain(firebase.app());
        this.profileDomain = new ProfileDomain({ firestore: firebase.firestore(), logger: ctx.logger });
        this.articleDomain = new ArticleDomain({ firestore: firebase.firestore()});
    }

    auth(): AuthDomain { return this.authDomain; }
    article(): ArticleDomain { return this.articleDomain; }
    profile(): ProfileDomain { return this.profileDomain; }

    about(currentUser: User): AboutPresenter {
         return new AboutPresenter({ currentUser: currentUser});
     }

     error(code: number, currentUser: User): ErrorPresenter {
         return ErrorPresenter.FromCode(code, currentUser);
     }
}
