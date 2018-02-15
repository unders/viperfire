import hyperApp = require('hyperhtml-app');
import { App } from '../app/app';
import { url } from "../lib/url";
import { path } from "../shared/path/url"

interface router {
    (): Router;
}

interface Router {
    get(path: string, callback: (ctx: any) => any): void;
}

interface Context{
    type: string
    params: object
}

interface ID {
    id: string
}

export const router = (app: App): void => {
    const route = (hyperApp as router)();
    const visit  = "pushstate";

    route.get(path.articles, function(ctx: Context) {
        const pageToken  = url.Query()("page_token");

        if (ctx.type === visit) {
            app.rootVisit(pageToken);
        } else {
            app.rootBack(pageToken);
        }
    });

    route.get(path.articleRegExp, function(ctx: Context) {
        const id = (ctx.params as ID).id;
        if (ctx.type === visit) {
            app.articleVisit(id);
        } else {
            app.articleBack(id);
        }
    });

    route.get(path.about, function(ctx: Context) {
        if (ctx.type === visit) {
            app.aboutVisit();
        } else {
            app.aboutBack();
        }
    });

    route.get(path.profileReqExp, function(ctx: Context) {
        const id = (ctx.params as ID).id;
        if (ctx.type === visit) {
            app.profileVisit(id);
        } else {
            app.profileBack(id);
        }
    });

     route.get('*', function(ctx: Context){
         window.location.reload(false);
     });
};
