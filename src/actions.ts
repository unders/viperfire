import { State } from "./shared/data/state";

interface Context {
    state: State;
}

const name: string = "data-action";

export class ActionHandler {
    private state: State;

    [key: string]: any;

    constructor(ctx: Context) {
        this.state = ctx.state;
        document.body.addEventListener('click', this);
    }

    handleEvent(event: Event): any {
        const ct = event.target as Element;
        if ('getAttribute' in ct) {
            const action = ct.getAttribute(name);
            if (action) {
                this[action + 'On' + event.type](event);
            }
        }
    }

    showSignInFormOnclick(event: Event): any {
        event.preventDefault();
        this.state.user.signedIn = true;
        console.log("showSignInFormOnClick");
    }

    signOutOnclick(event: Event): any {
        event.preventDefault();
        this.state.user.signedIn = false;
    }

    cleanup() {
        document.body.removeEventListener('click', this);
    }
}
