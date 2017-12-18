const okBtn = '<button type="btn" data-action="closePopup" tabindex="1">ok</button>';

export interface Popup {
    show: boolean;
    title: string;
    main: string;
    footer: string;
}

export class HiddenPopup implements Popup {
    readonly show: boolean = false;
    readonly title: string = "";
    readonly main: string = "";
    readonly footer: string = okBtn;
}

export interface ContextError {
    title: string;
    main: string;
}

export class ErrorPopup implements Popup {
    readonly show: boolean = true;
    readonly title: string;
    readonly main: string;
    readonly footer: string = okBtn;

    constructor(ctx: ContextError) {
        this.title = ctx.title;
        this.main = `<p>${ctx.main}</p>`;
    }
}
