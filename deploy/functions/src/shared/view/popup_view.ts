import { wire } from "../../dom/dom";
import { css } from "../css";
import { Presenter } from "../presenter/base_presenter";

export class PopupView {
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;

    constructor() {
        this.html = wire(this);
    }

    render(p: Presenter): string {
        let modal = `modal ${css.hide}`;
        const popup = p.popup;

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
