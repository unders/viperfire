import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';
import * as express from "express";
import { getServerConfig } from "./shared/config/config";
import { Page } from "./page/page";
import { User } from "./shared/data/user";
import { Domain } from "./domain/domain";
import { aboutPath, profilePath } from "./shared/path/path";

const adminApp = admin.initializeApp(functions.config().firebase);
const domain = new Domain({ firestore: adminApp.firestore(), admin: adminApp });
const app = express();
const config = getServerConfig();
const page = new Page({ view: config.view });

app.get("/", (req, res) => {
    res.set("Content-Type", "text/html; charset=utf-8");
    setCacheControl(res);

    const presenter = domain.article().all({ currentUser: User.signedOut() });
    const body = page.articleList(presenter);

    res.status(200).send(body);
});

app.get(aboutPath, (req, res) => {
    res.set("Content-Type", "text/html; charset=utf-8");
    setCacheControl10(res);

    const presenter = domain.about(User.signedOut());
    const body = page.about(presenter);
    res.status(200).send(body);
});

app.get("/article/:id", (req, res) => {
    res.set("Content-Type", "text/html; charset=utf-8");
    setCacheControl(res);

    const presenter = domain.about(User.signedOut());
    const body = page.about(presenter);
    res.status(200).send(body);
});

app.get(profilePath, async (req, res) => {
    res.set("Content-Type", "text/html; charset=utf-8");

    const ctx = { uid: req.params.uid, currentUser: User.signedOut() };
    const { code, presenter, err } = await domain.profile().get(ctx);
    if (code === 200) {
        setCacheControl(res);
        res.status(code).send(page.profile(presenter));
    } else {
        res.status(code).send(`error page=${err}`);
        // res.status(code).send(page.errorPage(code, profile, err));
    }
});

const setCacheControl = function(res): void {
    if(config.isOnline) {
        res.set("Cache-Control", "public, max-age=1, s-max-age=2");
    }
};

const setCacheControl10 = function(res): void {
    if(config.isOnline) {
        res.set("Cache-Control", "public, max-age=10, s-max-age=100");
    }
};

export const appV1 = functions.https.onRequest(app);
export const createUserProfile = functions.auth.user().onCreate( async (event) => {
    const data = event.data;
    const user = {
        // photoUrl: user.photoURL || default image;
        signedIn: false,
        uid: data.uid,
        name: data.displayName,
        email: data.email
    };

    // Custom claim admin be actively set inside in firebase.
    const result = await domain.auth().setClaims(user.uid, { admin: false });
    if (!result.ok) {
        await domain.err().log({ currentUser: user, message: result.err, func: "createUserProfile:setClaims" });
    }

    const { err } = await domain.profile().set(user);
    if (err) {
        await domain.err().log({ currentUser: user, message: err, func: "createUserProfile:profile().set(user)" });
    }
});
