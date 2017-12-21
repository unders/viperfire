import { wire } from "../../dom/dom";
import { ArticleListPresenter } from "../presenter/article_list_presenter";
import { path } from "../path/url"
import { css } from "../css";

export class ArticleListView {
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;

    constructor() {
        this.html = wire(this);
    }

    render(p: ArticleListPresenter): string {
        const haveArticles = p.articleList.length > 0;
        const { hasMore, nextArticlesPath } = path.nextArticles(p.articleList.pageToken);

        let moreKlass = css.hide;
        if (hasMore) {
            moreKlass = css.show;
        }

        const ago = p.ago;

        return this.html`
            <div class="articles">
                ${haveArticles ?
                        wire(this, ":article-list")`<ul>
                            ${p.articleList.articles.map((a) => wire(a)`
                                <li>
                                    <a href="${path.article(a.id)}">${a.id}</a>
                                    <span>${ago.time(a.createTime)}</span>
                                </li>`
                            )}
                        </ul>
                        <a href="${nextArticlesPath}" class="${moreKlass}">More</a>`
                     :
                        wire(this, ":no-articles")`<p>Found no articles</p>`
                }
            </div>`;
    }
}


