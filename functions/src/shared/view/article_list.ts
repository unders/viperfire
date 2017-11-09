import { wire } from "../../dom/dom";
import { ArticleListPresenter } from "../presenter/article_list";

export class ArticleList {
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;

    constructor() {
        this.html = wire(this);
    }

    render(ctx: ArticleListPresenter): string {
        return this.html`
            <p>${ctx.message}</p>
        `;
    }
}


