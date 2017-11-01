import { css } from "../css";
import { wire } from "../../dom/dom";

interface Context {
    readonly logo: Logo
    readonly actions: Actions
}

interface Logo {
    readonly name: string
    readonly url: string
}

interface Actions {
    signIn(event: any): void
    signOut(event: any): void
}

interface User {
    readonly signedIn: boolean
    readonly name: string
}

export class Header {
    private readonly logo: Logo;
    private readonly actions: Actions;

    constructor(ctx: Context) {
        this.logo = ctx.logo;
        this.actions = ctx.actions;
    }

    render(user: User): string {
        const logo = this.logo;
        const actions = this.actions;

        let signOutKlass = "";
        let signInKlass = "";
        if (user.signedIn) {
            signInKlass = `header-account-link ${css.hide}`;
            signOutKlass = `header-account-link`;
        } else {
            signInKlass = `header-account-link`;
            signOutKlass = `header-account-link ${css.hide}`;
        }

        return wire(user)`
            <div class="header-account">
                <a href="${logo.url}">${logo.name}</a>
            <div class="${signInKlass}">
                <a href="#sign-in" onclick="${actions.signIn}">Sign In</a>
            </div>
            <div class="${signOutKlass}">
                Welcome ${user.name} | <a href="#sign-out" onclick="${actions.signOut}">Sign Out</a>
            </div>
        </div>`;
    }
}
