import * as admin from "firebase-admin";
import { ProfileDomain } from "./profile_domain";
import { ArticleDomain } from "./article_domain";
import { ErrorDomain } from "./error_domain";
import { AuthDomain } from "./auth_domain";

interface Context {
    readonly admin: admin.app.App;
}

export class Domain {
    private readonly admin: admin.app.App;
    private readonly firestore: admin.firestore.Firestore;
    private readonly articleDomain: ArticleDomain;

    constructor(ctx: Context) {
        this.admin = ctx.admin;
        this.firestore = ctx.admin.firestore();
        this.articleDomain =  new ArticleDomain({ firestore: this.firestore, limit: 30 });
    }

    err(): ErrorDomain {
        return new ErrorDomain({ firestore: this.firestore });
    }

    auth(): AuthDomain {
        return new AuthDomain({ admin: this.admin });
    }

    article(): ArticleDomain {
        return this.articleDomain;
    }

    profile(): ProfileDomain {
        return new ProfileDomain({ firestore: this.firestore });
    }
}
