import { App } from "../view/app";
import { ArticleList } from "../view/article_list";
import { About, AboutContext } from "../view/about";
import { Header } from '../view/header';
import { ServerActions } from '../actions';
import { Logo } from '../data/logo';

export interface Config {
    readonly isOnline: boolean
    readonly app: App;
}

export const getConfig = function(env: any): Config {
    let online = false;
    let url = "//localhost:8000";
    if (!env.LOCAL) {
        online = true;
        url = "//viperfire-stag.firebaseapp.com/";
    }

    const logo = new Logo({name: "Viperfire", url: url});
    const actions = new ServerActions();

    const ctx = {
        header: new Header({ logo: logo, actions: actions }),
        articleList: new ArticleList(),
        about: new About(aboutCtx()),
        footer: "<div>Viperfire footer</div>"
    };

    return {
        isOnline: online,
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
