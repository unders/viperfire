import * as admin from "firebase-admin";
import { ProfileDomain } from "./profile_domain";
import { ArticleDomain } from "./article_domain";
import { ErrorDomain } from "./error_domain";
import { AuthDomain } from "./auth_domain";
import { User } from "../shared/data/user";
import { AboutPresenter } from "../shared/presenter/about_presenter";

interface Context {
    readonly admin: admin.app.App;
}

export class Domain {
    private readonly admin: admin.app.App;
    private readonly firestore: admin.firestore.Firestore;

    constructor(ctx: Context) {
        this.admin = ctx.admin;
        this.firestore = ctx.admin.firestore();
    }

    err(): ErrorDomain {
        return new ErrorDomain({ firestore: this.firestore });
    }

    auth(): AuthDomain {
        return new AuthDomain({ admin: this.admin });
    }

    article(): ArticleDomain {
        return new ArticleDomain({ firestore: this.firestore });
    }

    profile(): ProfileDomain {
        return new ProfileDomain({ firestore: this.firestore });
    }

    about(currentUser: User): AboutPresenter {
        return new AboutPresenter({ currentUser: currentUser});
    }
}
