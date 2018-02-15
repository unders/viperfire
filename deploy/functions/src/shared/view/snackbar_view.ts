import { wire } from "../../dom/dom";
import { css } from "../css";
import { Presenter } from "../presenter/base_presenter";
import { state } from "../presenter/snackbar_presenter";
import { onClick } from "../actions";

export class SnackbarView {
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;

    constructor() {
        this.html = wire(this);
    }

    render(p: Presenter): string {
        const snackbar = p.snackbar;

        let compKlass = 'snackbar';
        let containerKlass = 'snackbar-container'; // default: state.clear => no animations.
        switch (snackbar.state) {
            case state.hide:
                compKlass = `${compKlass} ${css.hide}`;
                break;
            case state.clear: // default
                break;
            case state.blink:
                containerKlass = `${containerKlass} ${css.blink}`;
                break;
            case state.slideIN:
                containerKlass = `${containerKlass} ${css.slideInBottom}`;
                break;
            case state.slideOut:
                containerKlass = `${containerKlass} ${css.slideOutBottom}`;
                break;
        }

        let actionKlass = `snackbar-action ${css.hide}`;
        if (snackbar.showAction) {
            actionKlass = "snackbar-action";
        }

        return this.html`
            <div class="${compKlass}">
                <div class="${containerKlass}">
                    <span class="snackbar-message">${snackbar.text}</span>
                    <span class="${actionKlass}">
                        <a href="#">${snackbar.actionText}</a>
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
