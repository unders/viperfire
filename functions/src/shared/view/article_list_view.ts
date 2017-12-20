import { wire } from "../../dom/dom";
import { ArticleListPresenter } from "../presenter/article_list_presenter";
import { path } from "../path/url"

export class ArticleListView {
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;
    private readonly list: (template: TemplateStringsArray, ...args : any[]) => string;

    constructor() {
        this.html = wire(this);
        this.list = wire({});
    }

    render(p: ArticleListPresenter): string {
        const haveArticles = p.articleList.length > 0;
        const { hasMore, nextArticlesPath } = path.nextArticles(p.articleList.pageToken);
        const ago = p.ago;

        return this.html`
            <div class="articles">
                ${haveArticles ?
                    this.list`<ul>
                        ${p.articleList.articles.map( (a) => wire(a)`
                            <li>
                                <a href="${path.article(a.id)}">${a.id}</a>
                                <span>${ago.time(a.createTime)}</span>
                            </li>
                        `)}
                    </ul>
                    ${hasMore ? wire()`<a href="${nextArticlesPath}">More</a>` : "" }
                    `
                    :
                    wire()`<p>Found no articles.</p>` }
            </div>
        `;
    }
}


