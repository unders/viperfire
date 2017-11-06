import { wire } from "../../dom/dom";

export interface ProfileContext {
    readonly name: string
}

export class Profile {
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;

    constructor() {
        this.html = wire(this);
    }

    render(ctx: ProfileContext): string {
        return this.html`
            <p>${ctx.name}</p>
        `;
    }
}
