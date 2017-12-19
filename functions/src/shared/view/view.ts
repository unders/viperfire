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
            <div class="snackbar hide">
                <div class="snackbar-container">
                    <span class="snackbar-message">You are signed in as anders.tornqvist@gmail.com</span>
                    <span class="snackbar-action">
                        <a href="#" class="hide">Undo</a>
                     </span>
                    <span class="snackbar-close">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="24" viewBox="0 0 24 24" width="24">
                            <path class="clear" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            <path d="M0 0h24v24H0z" fill="none"/>
                        </svg>
                    </span>
                </div>
            </div>
            </div>
            <div class="container">
                <header>${[this.header.render(p)]}</header>
                <main>${[main]}</main>
                <footer>${[this.footer.render(p)]}</footer>
            </div>
        `;
    }
}

