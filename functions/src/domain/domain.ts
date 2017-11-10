import * as admin from "firebase-admin";
import { Profile } from "./profile";
import { Article } from "./article";
import { Err } from "./err";
import { Auth } from "./auth";
import { User } from "../shared/data/user";
import { AboutPresenter } from "../shared/presenter/about";

interface Context {
    readonly firestore: admin.firestore.Firestore;
    readonly admin: admin.app.App;
}

export class Domain {
    private readonly firestore: admin.firestore.Firestore;
    private readonly admin: admin.app.App;

    constructor(ctx: Context) {
        this.firestore = ctx.firestore;
        this.admin = ctx.admin;
    }

    err(): Err {
        return new Err({ firestore: this.firestore });
    }

    auth(): Auth {
        return new Auth({ admin: this.admin });
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
