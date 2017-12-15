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
                <div>Created: ${ago.time(p.article.createTime)}</div>
                <div>Published: ${ago.time(p.article.publishTime)}</div>
            </div>
        `;
    }
}
