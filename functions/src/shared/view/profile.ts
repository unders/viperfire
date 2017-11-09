import { wire } from "../../dom/dom";
import { ProfilePresenter } from "../presenter/profile";

export class Profile {
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;

    constructor() {
        this.html = wire(this);
    }

    render(ctx: ProfilePresenter): string {
        return this.html`
            <p>${ctx.profileUser.name}</p>
        `;
    }
}
