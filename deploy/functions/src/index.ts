import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';
import * as express from "express";
import { getServerConfig } from "./shared/config/config";
import { Page } from "./page/page";
import { Domain } from "./domain/domain";
import { path } from "./shared/path/url";
import { fromUserRecord } from "./lib/user";
import { userProfileBuilder } from "./shared/data/user_profile";
import { userBuilder } from "./shared/data/user";

const domain = new Domain({ admin: admin.initializeApp(functions.config().firebase) });
const app = express();
const config = getServerConfig();
const page = new Page({ view: config.view });

app.get(path.articles, async (req, res) => {
    res.set("Content-Type", "text/html; charset=utf-8");

    const query = domain.article().queryDraft(req.query.page_token);
    const { articleList, domainError } = await domain.article().all(query);
    if (domainError) {
        const body = page.error(500, userBuilder.signedOut());
        res.status(500).send(body);
        console.error(domainError);
        return;
    }

    const { body, pageError } = page.articleList(articleList, userBuilder.signedOut());
    if (pageError) {
        res.status(500).send(body);
        console.error(pageError);
        return;
    }

    setCacheControl(res);
    res.status(200).send(body);
});

app.get(path.about, (req, res) => {
    res.set("Content-Type", "text/html; charset=utf-8");

    const { body, pageError } = page.about(userBuilder.signedOut());
    if (pageError) {
        res.status(500).send(body);
        console.error(pageError);
        return;
    }

    setCacheControl10(res);
    res.status(200).send(body);
});

app.get(path.articleRegExp, async (req, res) => {
    res.set("Content-Type", "text/html; charset=utf-8");

    const { code, article, error } = await domain.article().get(req.params.id);
    if (error) {
        res.status(code).send(page.error(code, userBuilder.signedOut()));
        console.error(error);
        return;
    }

    const { body, pageError } = page.article(article, userBuilder.signedOut());
    if (pageError) {
        res.status(500).send(body);
        console.error(pageError);
        return;
    }

    setCacheControl(res);
    res.status(200).send(body);

});

app.get(path.profileReqExp, async (req, res) => {
    res.set("Content-Type", "text/html; charset=utf-8");

    const ctx = { uid: req.params.id };
    const { code, userProfile, err } = await domain.profile().get(ctx);
    if (err) {
        res.status(code).send(page.error(code, userBuilder.signedOut()));
        console.error(err);
        return;
    }

    const { body, pageError } = page.profile(userProfile, userBuilder.signedOut());
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
    console.log("createUserProfile: ", event.data);
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
