import { wire } from "../../dom/dom";
import { css } from "../css";
import { Presenter } from "../presenter/base";

export class PopupView {
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;

    constructor() {
        this.html = wire(this);
    }

    render(p: Presenter): string {
        let modal = `modal ${css.hide}`;

        // const popup = p.popup;
        const popup = {
            show : false,
            title: "Ops, something went wrong",
            main: "<p>The last change might not have been saved.</p>",
            footer: '<button type="btn" tabindex="1">ok</button>'
        };

        if (popup.show) {
             modal = "modal";
        }

        return this.html`
            <div class="${modal}">
                <div class="modal-overlay"></div>
                <div class="modal-container">
                    <div class="modal-center">
                        <h3 class="modal-header">${popup.title}</h3>
                        <div class="modal-separator"></div>
                        <div class="modal-main">${[popup.main]}</div>
                        <div class="modal-separator"></div>
                        <div class="modal-footer">${[popup.footer]}</div>
                    </div>
                </div>
            </div>
        `;
    }
}
