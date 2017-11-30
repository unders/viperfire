import * as firebase from "firebase";
import { Profile } from "./profile";
import { Article } from "./article";
import { Auth } from "./auth";
import { Logger } from "../log/log";
import { User } from "../shared/data/user";
import { ErrorPresenter } from "../shared/presenter/error";
import { AboutPresenter } from "../shared/presenter/about";

interface Context {
    readonly logger: Logger;
}

export class Domain {
    private readonly authDomain: Auth;
    private readonly profileDomain: Profile;
    private readonly articleDomain: Article;

    constructor(ctx: Context) {
        this.authDomain = new Auth(firebase.app());
        this.profileDomain = new Profile({ firestore: firebase.firestore(), logger: ctx.logger });
        this.articleDomain = new Article({ firestore: firebase.firestore()});
    }

    auth(): Auth { return this.authDomain; }
    article(): Article { return this.articleDomain; }
    profile(): Profile { return this.profileDomain; }

    about(currentUser: User): AboutPresenter {
         return new AboutPresenter({ currentUser: currentUser});
     }

     error(code: number, currentUser: User): ErrorPresenter {
         return ErrorPresenter.FromCode(code, currentUser);
     }
}
