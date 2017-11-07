import { wireRender } from "../../dom/dom";
import { User } from "../data/user";
import { AboutState, ArticleListState, ProfileState } from "../data/state";
import { Header } from "./header";
import { ArticleList } from "./article_list";
import { About } from "./about";
import { Profile } from "./profile";
import { Footer } from "./footer";

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
    private readonly footer: Footer;

    constructor(ctx: Context) {
        this.header = ctx.header;
        this.footer = ctx.footer;
        this.articleList = ctx.articleList;
        this.about = ctx.about;
    }

    renderArticleList(html: wireRender, state: ArticleListState): string {
        return this.render(html, state.user, this.articleList.render(state.articleList));
    }

    renderProfile(html: wireRender, state: ProfileState): string {
        return this.render(html, state.user, this.profile.render(state.ctx))
    }

    renderAbout(html: wireRender, state: AboutState): string {
        return this.render(html, state.user, this.about.render())
    }

    private render(html: wireRender, user: User, main: string): string {
        let links = [];
        if (user.signedIn) {
            links[0]= { name: "My Profile", url:  `/profile/${user.uid}` };
        }

        return html`
            <header>${[this.header.render(user)]}</header>
            <main>${[main]}</main>
            <footer>${[this.footer.render({ links: links })]}</footer>
        `;
    }
}

