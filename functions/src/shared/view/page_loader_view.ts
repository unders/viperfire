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
        let container = "background-progress-bar";

        if (p.pageLoader === PageLoader.Loading) {
            container = `${container} ${css.loading}`;
            pageProgressBar = `${pageProgressBar} ${css.loading}`;
        }
        if (p.pageLoader === PageLoader.Done) {
            container = `${container} ${css.done}`;
            pageProgressBar = `${pageProgressBar} ${css.done}`;
        }

        return this.html`
            <div class="${container}"></div>
            <div class="${pageProgressBar}">
            </div>
        `;
    }
}
