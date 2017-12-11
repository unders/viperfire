import { wire } from "../../dom/dom";
import { ArticleListPresenter } from "../presenter/article_list_presenter";
import { article, nextArticleListPath } from "../path/path"

export class ArticleListView {
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;

    constructor() {
        this.html = wire(this);
    }

    render(p: ArticleListPresenter): string {
        const { hasMore, path } = nextArticleListPath(p.articleList.pageToken);
        const haveArticles = p.articleList.length > 0;

        return this.html`
            <div class="articles">
                ${haveArticles ?
                    `<ul>
                        ${p.articleList.articles.map( (a) => wire(a)`
                            <li>
                                <a href="${article(a.id)}">${a.title}</a>
                                <span>published at ${a.publishTime}</span>
                            </li>
                        `)}
                    </ul>
                    ${hasMore ? `<a href="${path}">More</a>` : "" }
                    `
                    :
                    wire(this, ":notFound")`<p>Found no articles.</p>` }
            </div>
        `;
    }
}


