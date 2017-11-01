import { wireRender } from "../../dom/dom";
import { User } from "../data/user";
import { Header } from "./header";
import { ArticleList, ArticleListContext } from "./article_list";
import { About } from "./about";

interface AppContext {
    header: Header;
    footer: string;
    articleList: ArticleList;
    about: About;
}

export class App {
    private readonly header: Header;
    private readonly articleList: ArticleList;
    private readonly about: About;
    private readonly footer: string;

    constructor(ctx: AppContext) {
        this.header = ctx.header;
        this.footer = ctx.footer;
        this.articleList = ctx.articleList;
        this.about = ctx.about;
    }

    renderArticleList(html: wireRender, user: User, ctx: ArticleListContext): string {
        return this.render(html, user, this.articleList.render(ctx));
    }

    renderAbout(html: wireRender, user: User): string {
        return this.render(html, user, this.about.render())
    }

    private render(html: wireRender, user: User, main: string): string {
        return html`
            <header>${[this.header.render(user)]}</header>
            <main>${[main]}</main>
            <footer>${[this.footer]}</footer>
        `;
    }
}

