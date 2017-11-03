import { wireRender } from "../../dom/dom";
import { User } from "../data/user";
import { AboutState, ArticleListState } from "../data/state";
import { Header } from "./header";
import { ArticleList, ArticleListContext } from "./article_list";
import { About } from "./about";

interface Context {
    header: Header;
    footer: string;
    articleList: ArticleList;
    about: About;
}

export class View {
    private readonly header: Header;
    private readonly articleList: ArticleList;
    private readonly about: About;
    private readonly footer: string;

    constructor(ctx: Context) {
        this.header = ctx.header;
        this.footer = ctx.footer;
        this.articleList = ctx.articleList;
        this.about = ctx.about;
    }

    renderArticleList(html: wireRender, state: ArticleListState): string {
        return this.render(html, state.user, this.articleList.render(state.articleList));
    }

    renderAbout(html: wireRender, state: AboutState): string {
        return this.render(html, state.user, this.about.render())
    }

    private render(html: wireRender, user: User, main: string): string {
        return html`
            <header>${[this.header.render(user)]}</header>
            <main>${[main]}</main>
            <footer>${[this.footer]}</footer>
        `;
    }
}

