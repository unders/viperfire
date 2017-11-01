import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';
import * as express from "express";
import { getConfig } from "./shared/config/config";
import { newPage } from "./page/page";

const firebase = admin.initializeApp(functions.config().firebase);
const app = express();
const config = getConfig(process.env);
const page = newPage(config);

// Index shows landing page with articles order_by: rank | newest
//
// GET /?page_token=xxxxxxxxx                   - articles ordered by rank
// GET /?order_by=newest&page_token=xxxxxxxxx   - articles ordered by newest
//
app.get("/", (req, res) => {
    const pageToken = req.query.page_token;

    res.set("Content-Type", "text/html; charset=utf-8");
    if (config.isOnline) {
        res.set("Cache-Control", "public, max-age=1 s-max-age=1");
    }
    res.status(200).send(page.articleList("Hello World"));
});

app.get("/about", (req, res) => {
    res.set("Content-Type", "text/html; charset=utf-8");
    if (config.isOnline) {
        res.set("Cache-Control", "public, max-age=10 s-max-age=100");
    }
    res.status(200).send(page.about());
});

app.get("/article/:id", (req, res) => {
    if (config.isOnline) {
        res.set("Cache-Control", "public, max-age=1 s-max-age=2");
    }
    res.status(200).send(`article/${req.params.id}\n`);
});

app.get("/profile/:id", (req, res) => {

});

export let appV1 = functions.https.onRequest(app);

