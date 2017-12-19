export interface Snackbar {
    show: boolean;
    text: string;
    showAction: boolean;
    actionText: string; // Undo
    action: string,
}

export class HiddenSnackbar implements Snackbar {
    readonly show: boolean = false;
    readonly text: string = "";
    readonly showAction: boolean = false;
    readonly actionText: string = "";
    readonly action: string = "";
}

export interface ContextSignedIn {
    email: string;
}

export class SignedInSnackbar implements Snackbar {
    readonly show: boolean = true;
    readonly text: string;
    readonly showAction: boolean = false;
    readonly actionText: string = "";
    readonly action: string = "";

    constructor(ctx: ContextSignedIn) {
        this.text = `You are signed in as ${ctx.email}`;
    }
}
