import { wire } from "../../dom/dom";
import { PageLoader } from "../presenter/presenter";
import { css } from "../css";
import { Presenter } from "../presenter/base_presenter";

export class PageLoaderView {
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;

    constructor() {
        this.html = wire(this);
    }

    render(p: Presenter): string {
        let pageProgressBar = css.pageProgressBar;
        if (p.pageLoader === PageLoader.Loading) {
            pageProgressBar = `${pageProgressBar} ${css.loading}`;
        }
        if (p.pageLoader === PageLoader.Done) {
            pageProgressBar = `${pageProgressBar} ${css.loading} ${css.done}`;
        }

        return this.html`
            <div class="${pageProgressBar}">
                <div class="background-progress-bar"></div>
            </div>
        `;
    }
}
