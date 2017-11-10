import hyperApp = require('hyperhtml-app');
import { App } from '../app/app';

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

interface UID {
    uid: string
}

export const router = (app: App): void => {
    const route = (hyperApp as router)();
    const visit  = "pushstate";

    route.get("/", function(ctx: Context) {
        if (ctx.type === visit) {
            app.rootVisit();
        } else {
            app.rootBack();
        }
    });

    route.get("/about", function(ctx: Context) {
        if (ctx.type === visit) {
            app.aboutVisit();
        } else {
            app.aboutBack();
        }
    });

    route.get("/profile/:uid", function(ctx: Context) {
        const uid = (ctx.params as UID).uid;
        if (ctx.type === visit) {
            app.profileVisit(uid);
        } else {
            app.profileBack(uid);
        }
    });

     route.get('*', function(ctx: Context){
         window.location.reload(false);
     });
};
