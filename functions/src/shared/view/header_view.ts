import { css } from "../css";
import { wire } from "../../dom/dom";
import { onClick } from "../actions";
import { Presenter } from "../presenter/base_presenter";

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

export class HeaderView {
    private readonly logo: Logo;
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;

    constructor(ctx: Context) {
        this.logo = ctx.logo;
        this.html = wire(this);
    }

        // TODO: Fix this...
        // filter list
        // <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="24" viewBox="0 0 24 24" width="24">
        //     <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
        //     <path d="M0 0h24v24H0z" fill="none"/>
        // </svg>

        // exit to app - Sign Out
        // <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="24" viewBox="0 0 24 24" width="24">
        //     <path d="M0 0h24v24H0z" fill="none"/>
        //     <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
        // </svg>

        // account circle
        // <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="24" viewBox="0 0 24 24" width="24">
        //     <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
        //     <path d="M0 0h24v24H0z" fill="none"/>
        // </svg>

        // account box
        // <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="24" viewBox="0 0 24 24" width="24">
        //     <path d="M3 5v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z"/>
        //     <path d="M0 0h24v24H0z" fill="none"/>
        // </svg>

        // face
        // <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="24" viewBox="0 0 24 24" width="24">
        //     <path d="M9 11.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm6 0c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21.71.33 1.47.33 2.26 0 4.41-3.59 8-8 8z"/>
        //     <path d="M0 0h24v24H0z" fill="none"/>
        // </svg>

        // share
        // <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="24" viewBox="0 0 24 24" width="24">
        //     <path d="M0 0h24v24H0z" fill="none"/>
        //     <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
        // </svg>

    render(p: Presenter): string {
        const logo = this.logo;

        let signOutKlass = "";
        let signInKlass = "";
        if (p.currentUser.signedIn) {
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
                    <a href="#" data-action="${onClick.signInOptions}" rel="nofollow">Sign In</a>
                </div>
                <div class="${signOutKlass}">
                    <a href="#" data-action="${onClick.signOut}" rel="nofollow">Sign Out</a>
                </div>
            </div>`;
    }
}
