import * as firebase from "firebase";
import { ProfileDomain } from "./profile_domain";
import { ArticleDomain } from "./article_domain";
import { AuthDomain } from "./auth_domain";
import { Logger } from "../log/log";

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
}
