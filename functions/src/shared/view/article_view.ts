import { wire } from "../../dom/dom";
import { ArticlePresenter } from "../presenter/article_presenter";
import { time } from "../lib/time";

export class ArticleView {
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;

    constructor() {
        this.html = wire(this);
    }

    render(p: ArticlePresenter): string {
        const ago = time.ago();

        return this.html`
            <div class="article">
                <h1>${p.article.title}</h1>
                <p>${p.article.bodyText}</p>
                <span>${ago.time(p.article.createTime)}</span>
                <span>${ago.time(p.article.publishTime)}</span>
            </div>
        `;
    }
}
