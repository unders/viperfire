import { Logger } from "./log/log";
import * as firebase from "firebase";
import { App } from "./app/app";
import { AuthDomain } from "./domain/auth_domain";
import { Domain } from "./domain/domain";


interface Context {
    readonly app: App;
    readonly domain: Domain;
    readonly logger: Logger;
}

const name: string = "data-action";

export class ActionHandler {
    private readonly app: App;
    private readonly logger: Logger;
    private readonly auth: AuthDomain;

    [key: string]: any;

    constructor(ctx: Context) {
        this.logger = ctx.logger;
        this.app = ctx.app;
        this.auth = ctx.domain.auth();

        // Triggered on: sign-in and sign-out
        this.auth.onAuthStatChanged(this.OnAuthStateChanged.bind(this));

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
    OnAuthStateChanged(user: firebase.User): void {
        this.app.onUserStateChanged(user);
    }

    async signInWithGoogleOnclick(event: Event)  {
        event.preventDefault();

        const { currentUser, err } = await this.auth.GooglePopup().signInWithPopup();
        if (currentUser === null) {
            this.logger.error(`signInWithGoogleOnclick failed; error=${err}`);
            // TODO: post an error notice: SnackBar
        }
    }

    async signOutOnclick(event: Event) {
        event.preventDefault();

        const ok = await this.auth.GooglePopup().signOut();
        if (!ok) {
            this.logger.error("signOutOnclick failed!");
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
