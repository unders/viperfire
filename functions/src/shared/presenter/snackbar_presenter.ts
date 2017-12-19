export interface Snackbar {
    version: number;
    show: boolean;
    text: string;
    showAction: boolean;
    actionText: string; // Undo
    action: string,
}

export class HiddenSnackbar implements Snackbar {
    readonly version: number;
    readonly show: boolean = false;
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
    version: number
}

export class SignedInSnackbar implements Snackbar {
    version: number;
    readonly show: boolean = true;
    readonly text: string;
    readonly showAction: boolean = false;
    readonly actionText: string = "";
    readonly action: string = "";

    constructor(ctx: ContextSignedIn) {
        this.text = `You are signed in as ${ctx.email}`;
        this.version = ctx.version;
    }
}
