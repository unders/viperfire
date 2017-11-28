import { wireRender } from "../../dom/dom";
import { User } from "../data/user";
import { Header } from "./header";
import { ArticleList } from "./article_list";
import { About } from "./about";
import { Profile } from "./profile";
import { Error } from "./error";
import { Footer } from "./footer";
import { newProfilePath } from "../path/path";
import { ProfilePresenter } from "../presenter/profile";
import { AboutPresenter } from "../presenter/about";
import { ArticleListPresenter } from "../presenter/article_list";
import { ErrorPresenter } from "../presenter/error";

interface Context {
    header: Header;
    footer: Footer;
    articleList: ArticleList;
    about: About;
}

export class View {
    private readonly header: Header;
    private readonly articleList: ArticleList;
    private readonly about: About;
    private readonly profile: Profile = new Profile();
    private readonly error: Error = new Error();
    private readonly footer: Footer;

    constructor(ctx: Context) {
        this.header = ctx.header;
        this.footer = ctx.footer;
        this.articleList = ctx.articleList;
        this.about = ctx.about;
    }

    renderArticleList(html: wireRender, p: ArticleListPresenter): string {
        return this.render(html, p.currentUser, this.articleList.render(p));
    }

    renderProfile(html: wireRender, p: ProfilePresenter): string {
        return this.render(html, p.currentUser, this.profile.render(p))
    }

    renderAbout(html: wireRender, p: AboutPresenter): string {
        return this.render(html, p.currentUser, this.about.render())
    }

    renderError(html: wireRender, p: ErrorPresenter): string {
        return this.render(html, p.currentUser, this.error.render(p));
    }

    private render(html: wireRender, currentUser: User, main: string): string {
        let links = [];
        if (currentUser.signedIn) {
            links[0]= { name: "My Profile", url:  newProfilePath(currentUser.uid) };
        }

        return html`
            <header>${[this.header.render(currentUser)]}</header>
            <main>${[main]}</main>
            <footer>${[this.footer.render({ links: links })]}</footer>
        `;
    }
}

