import * as firebase from "firebase";
import { Profile } from "./profile";
import { User } from "../shared/data/user";
import { Article } from "./article";
import { Logger } from "../log/log";
import { ErrorPresenter } from "../shared/presenter/error";
import { AboutPresenter } from "../shared/presenter/about";

interface Context {
    readonly firestore: firebase.firestore.Firestore;
    readonly logger: Logger;
}

export class Domain {
    private readonly firestore: firebase.firestore.Firestore;
    readonly logger: Logger;
    readonly profileDomain: Profile;
    readonly articleDomain: Article;

    constructor(ctx: Context) {
        this.firestore = ctx.firestore;
        this.logger = ctx.logger;
        this.profileDomain = new Profile({ firestore: this.firestore, logger: this.logger });
        this.articleDomain = new Article({ firestore: this.firestore });
    }

    article(): Article { return this.articleDomain; }
    profile(): Profile { return this.profileDomain; }

    about(currentUser: User): AboutPresenter {
         return new AboutPresenter({ currentUser: currentUser});
     }

     error(code: number, currentUser: User): ErrorPresenter {
         return ErrorPresenter.FromCode(code, currentUser);
     }
}
