import { wire } from "../../dom/dom";
import { ArticleListPresenter } from "../presenter/article_list_presenter";

export class ArticleListView {
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;

    constructor() {
        this.html = wire(this);
    }

    render(p: ArticleListPresenter): string {
        return this.html`
            <a href="/article/kalle">Kalle</a></br>
            <a href="/profile/yuaTMIc27MMFAV2z19K1gySGw3k1">My profile</a>
            <p>${p.message}</p>
        `;
    }
}


