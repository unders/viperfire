import { wire } from "../../dom/dom";
import { ArticleListPresenter } from "../presenter/article_list_presenter";
import { article, nextArticleListPath } from "../path/path"
import { time } from "../lib/time";

export class ArticleListView {
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;

    constructor() {
        this.html = wire(this);
    }

    render(p: ArticleListPresenter): string {
        const { hasMore, path } = nextArticleListPath(p.articleList.pageToken);
        const haveArticles = p.articleList.length > 0;

        const ago = time.ago();

        return this.html`
            <div class="articles">
                ${haveArticles ?
                    wire()`<ul>
                        ${p.articleList.articles.map( (a) => wire(a)`
                            <li>
                                <a href="${article(a.id)}">${a.id}</a>
                                <span>${ago.time(a.createTime)}</span>
                            </li>
                        `)}
                    </ul>
                    ${hasMore ? wire()`<a href="${path}">More</a>` : "" }
                    `
                    :
                    wire()`<p>Found no articles.</p>` }
            </div>
        `;
    }
}


