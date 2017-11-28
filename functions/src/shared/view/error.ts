import { wire } from "../../dom/dom";
import { ErrorPresenter } from "../presenter/error";

export class Error {
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;

    constructor() {
        this.html = wire(this);
    }

    render(ctx: ErrorPresenter): string {
        return this.html`
            <div class="page-error">
                <p>${ctx.message}</p>
            </div>
        `;
    }
}
