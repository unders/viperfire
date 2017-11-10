import * as firebase from "firebase";
import { Profile } from "./profile";
import { AboutPresenter } from "../shared/presenter/about";
import { User } from "../shared/data/user";
import { Article } from "./article";
import { Logger } from "../log/log";

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
}
