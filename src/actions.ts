import { Logger } from "./log/log";
import { Firebase, Auth } from "./firebase/firebase";
import * as firebase from "firebase";
import { User } from "./shared/data/user";

interface App {
    onUserStateChanged(user: User): void;
}

interface Context {
    readonly app: App;
    readonly firebase: Firebase;
    readonly logger: Logger;
}

const name: string = "data-action";

export class ActionHandler {
    private app: App;
    private auth: Auth;
    private logger: Logger;

    [key: string]: any;

    constructor(ctx: Context) {
        this.app = ctx.app;
        this.auth = ctx.firebase.authGoogle(this);
        this.logger = ctx.logger;
        document.body.addEventListener('click', this);
    }

    handleEvent(event: Event): any {
        try {
            const ct = event.target as Element;
            if ('getAttribute' in ct) {
                const action = ct.getAttribute(name);
                if (action) {
                    this[action + 'On' + event.type](event);
                }
            }
        } catch(e) {
            this.logger.error(e);
        }
    }

    //
    // Authentication start
    //
    OnAuthStateChanged(user: firebase.UserInfo): void {
        if (user) {
            this.logger.info("Signed in as: " + user.displayName);
            this.app.onUserStateChanged(User.fromFirebase(user));
        } else {
            this.logger.info("Signed Out");
            this.app.onUserStateChanged(User.signedOut());
        }
    }

    async signInWithGoogleOnclick(event: Event)  {
        event.preventDefault();

        const { user, err } = await this.auth.signInWithPopup();
        if (user === null) {
            this.logger.error(err);
            // TODO: post an error notice: SnackBar
        }
    }

    async signOutOnclick(event: Event) {
        event.preventDefault();

        const ok = await this.auth.signOut();
        if (!ok) {
            this.logger.error("SignOut failed!");
            // TODO: post error notice: SignOut failed.
        }
    }
    //
    // Authentication stop
    //

    cleanup() {
        document.body.removeEventListener('click', this);
    }
}
