import * as admin from "firebase-admin";
import { Profile } from "./profile";
import { Article } from "./article";
import { User } from "../shared/data/user";
import { AboutPresenter } from "../shared/presenter/about";

interface Context {
    readonly firestore: admin.firestore.Firestore;
}

export class Domain {
    private readonly firestore: admin.firestore.Firestore;

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
