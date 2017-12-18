import { Logger } from "./log/log";
import * as firebase from "firebase";
import { App } from "./app/app";
import { AuthDomain } from "./domain/auth_domain";
import { Domain } from "./domain/domain";


const name: string = "data-action";


interface Context {
    readonly app: App;
    readonly domain: Domain;
    readonly logger: Logger;
}


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
    // Popup begin
    //
    closePopupOnclick(event: Event) {
        this.app.hidePopup();
    }
    //
    // Popup end
    //

    //
    // Authentication begin
    //
    OnAuthStateChanged(user: firebase.User): void {
        this.app.onUserStateChanged(user);
    }

    async signInWithGoogleOnclick(event: Event)  {
        event.preventDefault();

        const { currentUser, err } = await this.auth.GooglePopup().signInWithPopup();
        if (currentUser === null) {
            this.logger.error(`signInWithGoogleOnclick failed; error=${err}`);
            this.app.showPopup({
                title: "Sign in failed",
                main: "We could not sign you in with Google Provider"
            });
        }
    }

    async signOutOnclick(event: Event) {
        event.preventDefault();

        const ok = await this.auth.GooglePopup().signOut();
        if (!ok) {
            this.app.showPopup({
                title: "Sign out failed",
                main: "We could not sign you out"
            });
            this.logger.error("signOutOnclick failed!");
        }
    }
    //
    // Authentication end
    //

    cleanup() {
        document.body.removeEventListener('click', this);
    }
}
