import { wire } from "../../dom/dom";
import { css } from "../css";
import { Presenter } from "../presenter/base_presenter";
import { onClick } from "../actions";

export class SnackbarView {
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;

    constructor() {
        this.html = wire(this);
    }

    render(p: Presenter): string {
        let compKlass = `snackbar ${css.hide}`;
        let actionKlass = `snackbar-action ${css.hide}`;
        const snackbar = p.snackbar;

        if (snackbar.showAction) {
            actionKlass = "snackbar-action";
        }

        if (snackbar.show) {
            compKlass = "snackbar";
        }

        return this.html`
            <div class="${compKlass}">
                <div class="snackbar-container slide-in-bottom">
                    <span class="snackbar-message">${snackbar.text}</span>
                    <span class="${actionKlass}">
                        <a href="#" class="hide">${snackbar.actionText}</a>
                     </span>
                    <span class="snackbar-close">
                        <svg xmlns="http://www.w3.org/2000/svg" 
                            fill="#000000" 
                            data-action="${onClick.closeSnackbar}"
                            height="24" 
                            viewBox="0 0 24 24" 
                            width="24">
                            <path class="clear" 
                                  data-action="${onClick.closeSnackbar}"
                                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            <path d="M0 0h24v24H0z" fill="none"/>
                        </svg>
                    </span>
                </div>
            </div>
        `;
    }
}
