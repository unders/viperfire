import { wireRender } from "../../dom/dom";
import { PageLoaderView } from "./page_loader_view";
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
import { Presenter} from "../presenter/presenter";

interface Context {
    header: HeaderView;
    footer: FooterView;
    articleList: ArticleListView;
    about: AboutView;
}

export class View {
    private readonly pageLoader: PageLoaderView = new PageLoaderView();
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
        // TODO: the code below should be moved to header and footer view
        let links = [];
        const currentUser = p.currentUser;
        if (currentUser.signedIn) {
            links[0]= { name: "My Profile", url:  path.profile(currentUser.uid) };
        }

        return html`
            ${[this.pageLoader.render(p)]}
            <div class="modal">
                <div class="modal-overlay"></div>
                <div class="modal-container">
                    <div class="modal-center">
                        <h3 class="modal-header">Ops, something went wrong</h3>
                        <div class="modal-separator"></div>
                        <p class="modal-main">
                            The last changes might not have been saved.
                        </p>
                        <div class="modal-separator"></div>
                        <div class="modal-footer">
                            <button type="btn" tabindex="1">ok</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container">
                <header>${[this.header.render(currentUser)]}</header>
                <main>${[main]}</main>
                <footer>${[this.footer.render({ links: links })]}</footer>
            </div>
        `;
    }
}

