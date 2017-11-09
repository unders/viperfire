import * as firebase from "firebase";
import { Profile } from "./profile";
import { AboutPresenter } from "../shared/presenter/about";
import { User } from "../shared/data/user";
import { Article } from "./article";

interface Context {
    readonly firestore: firebase.firestore.Firestore;
}

export class Domain {
    private readonly firestore: firebase.firestore.Firestore;

    constructor(ctx: Context) {
        this.firestore = ctx.firestore;
    }

    article(): Article {
         return new Article({ firestore: this.firestore });
     }

    profile(): Profile {
        return new Profile({ firestore: this.firestore });
    }

    about(currentUser: User): AboutPresenter {
         return new AboutPresenter({ currentUser: currentUser});
     }
}
