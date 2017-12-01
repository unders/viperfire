import { wire } from "../../dom/dom";
import { ErrorPresenter } from "../presenter/error_presenter";

export class Error {
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;

    constructor() {
        this.html = wire(this);
    }

    render(p: ErrorPresenter): string {
        return this.html`
            <div class="page-error">
                <p>${p.message}</p>
            </div>
        `;
    }
}
