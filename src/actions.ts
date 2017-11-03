import { State } from "./shared/data/state";
import { Logger } from "./log/log";
import { Firebase, Auth } from "./firebase/firebase";
import * as firebase from "firebase";

interface Page {
    render(): void
}

interface Context {
    readonly logger: Logger;
    readonly state: State;
    readonly page: Page;
    readonly firebase: Firebase;
}

const name: string = "data-action";

export class ActionHandler {
    private logger: Logger;
    private state: State;
    private page: Page;
    private auth: Auth;

    [key: string]: any;

    constructor(ctx: Context) {
        this.logger = ctx.logger;
        this.page = ctx.page;
        this.state = ctx.state;
        this.auth = ctx.firebase.authGoogle(this);
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
            this.state.user.signedIn = true;
            this.page.render();
        } else {
            this.logger.info("Signed Out");
            this.state.user.signedIn = false;
            this.page.render();
        }
    }

    async signInWithGoogleOnclick(event: Event)  {
        event.preventDefault();

        const { user, err } = await this.auth.signInWithPopup();
        if (user === null) {
            this.logger.error(err);
            // TODO: post an error notice:
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
