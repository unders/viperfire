import { View } from "../view/view";
import { ArticleListView } from "../view/article_list_view";
import { AboutView, AboutContext } from "../view/about_view";
import { HeaderView } from '../view/header_view';
import { FooterView, FooterContext } from "../view/footer_view";
import { env } from './env'

export interface Config {
    readonly isOnline: boolean
    readonly view: View;
}

export const getServerConfig = function(): Config {
    return getConfig();
};

export const getClientConfig = function(): Config {
    return getConfig();
};

const getConfig = function(): Config {
    const logo = { name: "Viperfire", url: "/" };

    const ctx = {
        header: new HeaderView({ logo: logo }),
        articleList: new ArticleListView(),
        about: new AboutView(aboutCtx()),
        footer: new FooterView(footerCtx())
    };

    return {
        isOnline: env.online,
        view: new View(ctx),
    };
};

const footerCtx = function(): FooterContext {
    return {
        links: [
            { name: "Home", url: "/" },
            { name: "About", url: "/about" },
        ],
    }
};

const aboutCtx = function(): AboutContext {
    return {
        hyperLink: { name: "HyperHTML", url: "https://github.com/WebReflection/hyperHTML" },
        viperLink: { name: "ViperHTML", url: "https://github.com/WebReflection/viperhtml"},
        links: [{
            name: "HyperHTML", url: "https://github.com/WebReflection/hyperHTML"
        }, {
            name: "ViperHTML", url: "https://github.com/WebReflection/viperhtml"
        }]
    };
};
