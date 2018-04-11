import { Logger } from "./log/log";
import * as firebase from "firebase";
import { App } from "./app/app";
import { AuthDomain } from "./domain/auth_domain";
import { Domain } from "./domain/domain";

export const actionName: string = "data-action";

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
        document.body.addEventListener('submit', this);
    }

    handleEvent(event: Event): any {
        try {
            const el = event.target as Element;
            try {
                if ('getAttribute' in el) {
                    const action = el.getAttribute(actionName);
                    if (action) {
                        this[action + 'On' + event.type](event);
                    }
                }
            } catch(e) {
                this.logger.error(`actions.handleEvent() failed; type=${event.type}, element=${el}, error=${e.message}`);
            }
        } catch(e) {
            this.logger.error(`actions.handleEvent() failed; error=${e.message}`);
        }
    }

    //
    // TESTING (open snackbar and popup): START
    //
    openSnackbarOnclick(event: Event) {
        this.app.showSnackbar();
    }
    openPopupOnclick(event: Event) {
        this.app.showPopup({
            title: "This is a test",
            main: "This is the body message."
        });
    }

    //
    // TESTING: END
    //

    //
    // Snackbar begin
    //
    closeSnackbarOnclick(event: Event) {
        this.app.hideSnackbar();
    }
    //
    // Snackbar end
    //

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

    async closeAuthOnclick(event: Event) {
        event.preventDefault();
        this.app.closeAuthModal();
    }

    async signInOptionsOnclick(event: Event)  {
        event.preventDefault();
        this.app.showSignInOptions();
    }

    async signInWithGoogleOnclick(event: Event)  {
        event.preventDefault();
        this.app.closeAuthModal();

        const { currentUser, err } = await this.auth.signInWithGooglePopup();
        if (currentUser === null) {
            this.app.showPopup({
                title: "Sign in with Google failed",
                main: err,
            });
            this.logger.error(`signInWithGoogleOnclick failed; error=${err}`);
        }
    }

    async signInWithFacebookOnclick(event: Event) {
        event.preventDefault();
        this.app.closeAuthModal();

        const { currentUser, err } = await this.auth.signInWithFacebookPopup();
        if (currentUser === null) {
            this.app.showPopup({
                title: "Sign in with Facebook failed",
                main: err,
            });
            this.logger.error(`signInWithFacebookOnclick failed; error=${err}`);
        }
    }

    async signInWithTwitterOnclick(event: Event) {
        event.preventDefault();
        this.app.closeAuthModal();

        const { currentUser, err } = await this.auth.signInWithTwitterPopup();
        if (currentUser === null) {
            this.app.showPopup({
                title: "Sign in with Twitter failed",
                main: err,
            });
            this.logger.error(`signInWithTwitterOnclick failed; error=${err}`);
        }
    }

    async signInWithEmailOnclick(event: Event)  {
        event.preventDefault();
        this.app.showSignInWithEmail();
    }

    async signUpOptionsOnclick(event: Event) {
        event.preventDefault();
        this.app.showSignUpOptions();
    }

    async signUpWithEmailOnclick(event: Event) {
        event.preventDefault();
        this.app.showSignUpWithEmail();
    }

    async signOutOnclick(event: Event) {
        event.preventDefault();

        const ok = await this.auth.signOut();
        if (!ok) {
            this.app.showPopup({
                title: "Sign out failed",
                main: "We could not sign you out"
            });
            this.logger.error("signOutOnclick failed!");
        }
    }


    async signInFormOnsubmit(event: Event): Promise<void> {
        event.preventDefault();
        try {
            const form =  event.target as HTMLFormElement;
            this.app.submitSignInWithEmail(form);
        } catch(e) {
            this.logger.error("SignInFormOnsubmit error");
            this.logger.error(e);
        }
    }
    //
    // Authentication end
    //

    cleanup() {
        document.body.removeEventListener('click', this);
        document.body.removeEventListener('submit', this);
    }
}
