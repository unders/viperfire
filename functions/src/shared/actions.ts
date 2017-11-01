import { State } from "./data/state";

export class ServerActions {
    signIn(event: any): any  { /* no operation on server */ }
    signOut(event: any): any { /* no operation on server */ }
}

interface Context {
    state: State;
}

export class ClientActions {
    state: State;

    constructor(ctx: Context) {
        this.state = ctx.state;
    }

    handleEvent(event: Event): void {
        const ct = event.currentTarget as Element;
        if ('getAttribute' in ct) {
            const action = ct.getAttribute('data-action');
            this[action + 'On' + event.type](event);
        }
    }

    signInOnclick(event: Event): void {
        event.preventDefault();
        this.state.user.signedIn = true;
        console.log("SignIn Clicked");
    }

    signOutOnclick(event: Event): void {
        event.preventDefault();
        this.state.user.signedIn = false;
    }
}
