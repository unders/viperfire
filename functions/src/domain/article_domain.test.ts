import * as admin from 'firebase-admin';
import { ArticleDomain } from "./article_domain";
import { serviceAccount } from "../test/service_account";
import { articleBuilder } from "../shared/data/article";
import { startIDGenerator } from "../shared/lib/id_generator";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://viperfire-stag.firebaseio.com"
});

const idGen = startIDGenerator();
const article =  new ArticleDomain({ firestore: admin.firestore(), limit: 3 });

describe("ArticleDomain", () => {
    test("#create", async () => {

        if (process.env.ONLY_FAST) {
            console.log("skipping slow test");
            return;
        }

        const { id, error } = idGen();
        expect(error).toEqual(null);
        let a = articleBuilder.setSortID(articleBuilder.empty(""), id);

        const tests = [
            { error: null, article:  a}
        ];

        for (let test of tests) {
            const { id, error } = await article.create(test.article);
            expect(error).toEqual(test.error);
            expect(id).not.toEqual("");
        }
    })
});

