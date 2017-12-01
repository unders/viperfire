import { wire } from "../../dom/dom";
import { ProfilePresenter } from "../presenter/profile";

export class Profile {
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;

    constructor() {
        this.html = wire(this);
    }

    render(p: ProfilePresenter): string {
        return this.html`
            <h2>${p.userProfile.name}</h2>
            <p>Admin? ${p.userProfile.admin}</p>
        `;
    }
}
