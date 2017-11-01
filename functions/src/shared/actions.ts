import { State } from "./data/state";

export class ServerActions {
    handleEvent(event: any): any { /* no operation on server */ }
}

interface Context {
    state: State;
}

export class ClientActions {
    private state: State;

    [key: string]: any;

    constructor(ctx: Context) {
        this.state = ctx.state;
    }

    handleEvent(event: Event): any {
        const ct = event.currentTarget as Element;
        if ('getAttribute' in ct) {
            const action = ct.getAttribute('data-action');
            this[action + 'On' + event.type](event);
        }
    }

    signInOnclick(event: Event): any {
        event.preventDefault();
        this.state.user.signedIn = true;
        console.log("SignIn Clicked");
    }

    signOutOnclick(event: Event): any {
        event.preventDefault();
        this.state.user.signedIn = false;
    }
}
