import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';
import * as express from "express";
import { getServerConfig } from "./shared/config/config";
import { Page } from "./page/page";
import { ArticleListState, AboutState } from "./shared/data/state";
import { User } from "./shared/data/user";

const firebase = admin.initializeApp(functions.config().firebase);
const app = express();
const config = getServerConfig();
const page = new Page({ view: config.view });

// Index shows landing page with articles order_by: rank | newest
//
// GET /?page_token=xxxxxxxxx                   - articles ordered by rank
// GET /?order_by=newest&page_token=xxxxxxxxx   - articles ordered by newest
//
app.get("/", (req, res) => {
    const pageToken = req.query.page_token;

    res.set("Content-Type", "text/html; charset=utf-8");
    if (config.isOnline) {
        res.set("Cache-Control", "public, max-age=1, s-max-age=1");
    }

    const user = new User({ name: "", signedIn: false });
    const articleList = { message: "Hello World"};
    const state = new ArticleListState({ path: "/", user: user, articleList: articleList });
    const body = page.articleList(state);

    res.status(200).send(body);
});

app.get("/about", (req, res) => {
    res.set("Content-Type", "text/html; charset=utf-8");
    if (config.isOnline) {
        res.set("Cache-Control", "public, max-age=10, s-max-age=100");
    }

    const user = new User({ name: "", signedIn: false });
    const state = new AboutState("/about", user);
    const body = page.about(state);

    res.status(200).send(body);
});

app.get("/article/:id", (req, res) => {
    if (config.isOnline) {
        res.set("Cache-Control", "public, max-age=1, s-max-age=2");
    }
    res.status(200).send(`article/${req.params.id}\n`);
});

app.get("/profile/:id", (req, res) => {

});

export let appV1 = functions.https.onRequest(app);

