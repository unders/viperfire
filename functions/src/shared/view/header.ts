import { css } from "../css";
import { wire } from "../../dom/dom";

interface Context {
    readonly logo: Logo
}

interface Logo {
    readonly name: string
    readonly url: string
}

interface User {
    readonly signedIn: boolean
    readonly name: string
}

export class Header {
    private readonly logo: Logo;
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;

    constructor(ctx: Context) {
        this.logo = ctx.logo;
        this.html = wire(this);
    }

    render(user: User): string {
        const logo = this.logo;

        let signOutKlass = "";
        let signInKlass = "";
        if (user.signedIn) {
            signInKlass = `header-account-link ${css.hide}`;
            signOutKlass = `header-account-link`;
        } else {
            signInKlass = `header-account-link`;
            signOutKlass = `header-account-link ${css.hide}`;
        }

        return this.html`
            <a href="${logo.url}" class="header-logo">${logo.name}</a>
            <div class="header-account">
                <div class="${signInKlass}">
                    <a href="#sign-in" data-action="signInWithGoogle">Sign In with Google</a>
                </div>
                <div class="${signOutKlass}">
                    <a href="#sign-out" data-action="signOut">Sign Out</a>
                </div>
            </div>`;
    }
}
