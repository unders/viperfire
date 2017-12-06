import { wireRender } from "../../dom/dom";
import { User } from "../data/user";
import { HeaderView } from "./header_view";
import { ArticleListView } from "./article_list_view";
import { AboutView } from "./about_view";
import { ProfileView } from "./profile_view";
import { ErrorView } from "./error_view";
import { FooterView } from "./footer_view";
import { newProfilePath } from "../path/path";
import { ProfilePresenter } from "../presenter/profile_presenter";
import { AboutPresenter } from "../presenter/about_presenter";
import { ArticleListPresenter } from "../presenter/article_list_presenter";
import { ErrorPresenter } from "../presenter/error_presenter";
import { Presenter } from "../presenter/presenter";

interface Context {
    header: HeaderView;
    footer: FooterView;
    articleList: ArticleListView;
    about: AboutView;
}

export class View {
    private readonly header: HeaderView;
    private readonly articleList: ArticleListView;
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
        let links = [];
        const currentUser = p.currentUser;
        if (currentUser.signedIn) {
            links[0]= { name: "My Profile", url:  newProfilePath(currentUser.uid) };
        }

        let pageProgressBar = "viperfire-progress-bar";

        return html`
            <div class="${pageProgressBar}">
                <div class="background-progress-bar"></div>
            </div>
            <div class="container">
                <header>${[this.header.render(currentUser)]}</header>
                <main>${[main]}</main>
                <footer>${[this.footer.render({ links: links })]}</footer>
            </div>
        `;
    }
}

