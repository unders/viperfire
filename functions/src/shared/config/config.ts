import { App } from "../view/app";
import { ArticleList } from "../view/article_list";
import { About, AboutContext } from "../view/about";
import { Header } from '../view/header';
import { env } from './env'

export interface Config {
    readonly isOnline: boolean
    readonly app: App;
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
        footer: "<div>Viperfire footer</div>"
    };

    return {
        isOnline: env.online,
        app: new App(ctx),
    };
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
