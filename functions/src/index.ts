import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';
import * as express from "express";
import { getServerConfig } from "./shared/config/config";
import { Page } from "./page/page";
import { Domain } from "./domain/domain";
import { aboutPath, newProfilePath, profilePath } from "./shared/path/path";
import { fromUserRecord } from "./lib/user";
import { userProfileBuilder } from "./shared/data/user_profile";
import { userBuilder } from "./shared/data/user";

const adminApp = admin.initializeApp(functions.config().firebase);
const domain = new Domain({ firestore: adminApp.firestore(), admin: adminApp });
const app = express();
const config = getServerConfig();
const page = new Page({ view: config.view });

app.get("/", (req, res) => {
    res.set("Content-Type", "text/html; charset=utf-8");

    const presenter = domain.article().all({ currentUser: userBuilder.signedOut() });
    const { body, pageError } = page.articleList(presenter);
    if (pageError) {
        res.status(500).send(body);
        console.error(pageError);
        return;
    }

    setCacheControl(res);
    res.status(200).send(body);
});

app.get(aboutPath, (req, res) => {
    res.set("Content-Type", "text/html; charset=utf-8");

    const presenter = domain.about(userBuilder.signedOut());
    const { body, pageError } = page.about(presenter);
    if (pageError) {
        res.status(500).send(body);
        console.error(pageError);
        return;
    }

    setCacheControl10(res);
    res.status(200).send(body);
});

app.get("/article/:id", async (req, res) => {
    res.set("Content-Type", "text/html; charset=utf-8");

    // TODO: fetch article from firestore.
    const presenter = domain.about(userBuilder.signedOut());
    const { body, pageError } = page.about(presenter);
    if (pageError) {
        res.status(500).send(body);
        console.error(pageError);
        return;
    }

    setCacheControl(res);
    res.status(200).send(body);

});

app.get(profilePath, async (req, res) => {
    res.set("Content-Type", "text/html; charset=utf-8");

    const ctx = { uid: req.params.uid, currentUser: userBuilder.signedOut() };
    const { code, presenter, err } = await domain.profile().get(ctx);
    if (err) {
        res.status(code).send(page.error(code, userBuilder.signedOut()));
        console.error(err);
        return;
    }

    const { body, pageError } = page.profile(presenter);
    if (pageError) {
        res.status(500).send(body);
        console.error(pageError);
        return;
    }

    setCacheControl(res);
    res.status(code).send(body);
    return

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
    const currentUser = fromUserRecord(data);

    const defaultClaims = userBuilder.defaultClaims;

    const { claimError }  = await domain.auth().setClaims(currentUser.uid, defaultClaims);
    if (claimError) {
        const f =  "createUserProfile:auth().setDefaultClaims";
        await domain.err().log({ currentUser: currentUser, message: claimError, func: f });
    }

    const user = userBuilder.withClaims(currentUser, defaultClaims);
    const userProfile = userProfileBuilder.fromUser(user);
    const { profileError } = await domain.profile().set(userProfile);
    if (profileError) {
        const f =  "createUserProfile:profile().set(user)";
        await domain.err().log({ currentUser: currentUser, message: profileError, func: f });
    }
});

