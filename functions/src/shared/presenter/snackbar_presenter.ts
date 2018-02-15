export enum state {
    slideIN = "slide-in",
    blink = "blink",       // when snackbar is already visible.
    clear = "clear",       // clear animation classes (so we can blink again).
    slideOut = "slide-out",
    hide = "hide",        // add display: none  (only after slideOut or always on server).
}

export interface Snackbar {
    version: number;
    state: state;
    text: string;
    showAction: boolean;
    actionText: string; // Undo
    action: string,
}

export class HiddenSnackbar implements Snackbar {
    readonly version: number;
    state: state = state.hide;
    readonly text: string = "";
    readonly showAction: boolean = false;
    readonly actionText: string = "";
    readonly action: string = "";

    constructor(version: number) {
        this.version = version;
    }
}

export interface ContextSignedIn {
    email: string;
}

export class SignedInSnackbar implements Snackbar {
    version: number = 0;
    state: state = state.hide;
    readonly text: string;
    readonly showAction: boolean = false;
    readonly actionText: string = "";
    readonly action: string = "";

    constructor(ctx: ContextSignedIn) {
        this.text = `You are signed in as ${ctx.email}`;
    }
}

export interface ContextAction {
    text: string;
    actionText: string;
    action: string;
}

export class ActionSnackbar implements Snackbar {
    version: number = 0;
    state: state = state.hide;
    readonly text: string;
    readonly showAction: boolean = true;
    readonly actionText: string;
    readonly action: string;

    constructor(ctx: ContextAction) {
        this.text = ctx.text;
        this.actionText = ctx.actionText;
        this.action = ctx.action;
    }
}
