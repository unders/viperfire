import { wireRender } from "../../dom/dom";
import { PageLoaderView } from "./page_loader_view";
import { PopupView } from "./popup_view";
import { HeaderView } from "./header_view";
import { ArticleListView } from "./article_list_view";
import { ArticleView } from "./article_view";
import { AboutView } from "./about_view";
import { ProfileView } from "./profile_view";
import { ErrorView } from "./error_view";
import { FooterView } from "./footer_view";
import { path } from "../path/url";
import { ProfilePresenter } from "../presenter/profile_presenter";
import { AboutPresenter } from "../presenter/about_presenter";
import { ArticleListPresenter } from "../presenter/article_list_presenter";
import { ErrorPresenter } from "../presenter/error_presenter";
import { ArticlePresenter } from "../presenter/article_presenter";
import { Presenter } from "../presenter/base_presenter";

interface Context {
    header: HeaderView;
    footer: FooterView;
    articleList: ArticleListView;
    about: AboutView;
}

export class View {
    private readonly pageLoader: PageLoaderView = new PageLoaderView();
    private readonly popup: PopupView = new PopupView();
    private readonly header: HeaderView;
    private readonly articleList: ArticleListView;
    private readonly article: ArticleView = new ArticleView();
    private readonly about: AboutView;
    private readonly profile: ProfileView = new ProfileView();
    private readonly error: ErrorView = new ErrorView();
    private readonly footer: FooterView;

    constructor(ctx: Context) {
        this.header = ctx.header;
        this.footer = ctx.footer;
        this.articleList = ctx.articleList;
        this.about = ctx.about;
    }

    renderArticleList(html: wireRender, p: ArticleListPresenter): string {
        return this.render(html, p, this.articleList.render(p));
    }

    renderArticle(html: wireRender, p: ArticlePresenter): string {
        return this.render(html, p, this.article.render(p));
    }

    renderProfile(html: wireRender, p: ProfilePresenter): string {
        return this.render(html, p, this.profile.render(p))
    }

    renderAbout(html: wireRender, p: AboutPresenter): string {
        return this.render(html, p, this.about.render())
    }

    renderError(html: wireRender, p: ErrorPresenter): string {
        return this.render(html, p, this.error.render(p));
    }

    private render(html: wireRender, p: Presenter, main: string): string {
        return html`
            ${[this.pageLoader.render(p)]}
            ${[this.popup.render(p)]}
            </div>
            <div class="container">
                <header>${[this.header.render(p)]}</header>
                <main>${[main]}</main>
                <footer>${[this.footer.render(p)]}</footer>
            </div>
        `;
    }
}

