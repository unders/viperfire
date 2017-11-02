import { State } from "./shared/data/state";

interface Page {
    render(): void
}

interface Context {
    state: State;
    page: Page;
}

const name: string = "data-action";

export class ActionHandler {
    private state: State;
    private page: Page;

    [key: string]: any;

    constructor(ctx: Context) {
        this.page = ctx.page;
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
        this.page.render();
    }

    signOutOnclick(event: Event): any {
        event.preventDefault();
        this.state.user.signedIn = false;
        this.page.render();
    }

    cleanup() {
        document.body.removeEventListener('click', this);
    }
}
