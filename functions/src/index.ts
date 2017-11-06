import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';
import * as express from "express";
import { getServerConfig } from "./shared/config/config";
import { Page } from "./page/page";
import { ArticleListState, AboutState, ProfileState } from "./shared/data/state";
import { User } from "./shared/data/user";

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

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

app.get("/profile/:uid", async (req, res) => {
    res.set("Content-Type", "text/html; charset=utf-8");

    const uid = req.params.uid;
    try {
        const doc = await db.doc(`profiles/${uid}`).get();
        if (!doc.exists) {
            res.status(404).send("404 page not found");
        } else {
            const data = doc.data();
            const user = new User({ name: "", signedIn: false });
            const ctx =  { path: "/profile/:uid", user: user, ctx: { name: data.name } };
            const body = page.profile(new ProfileState( ctx));
            res.status(200).send(body);
        }
    } catch {
        res.status(500).send("500 internal error");
    }

});

export const appV1 = functions.https.onRequest(app);
export const createUserProfile = functions.auth.user().onCreate( async (event) => {
    const user = event.data;
    const data = {
        // photoUrl: user.photoURL || default image;
        name: user.displayName,
        email: user.email,
    };
    try {
        await db.collection('profiles').doc(`${user.uid}`).set(data);
    } catch (e) {
        console.error(`CreateUserFailed uid=${user.uid} email=${user.email} name=${user.email}`);
    }
});
