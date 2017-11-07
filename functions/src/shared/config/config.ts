import { View } from "../view/view";
import { ArticleList } from "../view/article_list";
import { About, AboutContext } from "../view/about";
import { Header } from '../view/header';
import { Footer, FooterContext } from "../view/footer";
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
    const logo = { name: "Viperfire", url: env.host };

    const ctx = {
        header: new Header({ logo: logo }),
        articleList: new ArticleList(),
        about: new About(aboutCtx()),
        footer: new Footer(footerCtx())
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
