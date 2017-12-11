import * as firebase from "firebase";
import { articleBuilder, Attributes, Status } from "../shared/data/article";
import { AllContext, AllResult } from "../shared/domain/article_domain";
import { path } from "../shared/db/path";

interface Context {
    firestore: firebase.firestore.Firestore;
}

export class ArticleDomain {
    private readonly db: firebase.firestore.Firestore;
    private readonly limit: number = 30;

    constructor(ctx: Context) {
        this.db = ctx.firestore;
    }

    //
    // Queries
    //

    queryDraft(pageToken: string|null): AllContext {
        return {
            status: Status.Draft,
            limit: this.limit,
            pageToken: pageToken || ""
        };
    }

    queryPublished(pageToken: string|null): AllContext {
        return {
            status: Status.Published,
            limit: this.limit,
            pageToken: pageToken || ""
        };
    }

    async all(ctx: AllContext): Promise<AllResult> {
        let query = this.db
            .collection(path.articles)
            .where("status", "==", `${ctx.status}`)
            .limit(ctx.limit);

        if (ctx.pageToken !== "") {
            query = query.startAfter(ctx.pageToken);
        }

        if (ctx.status === Status.Draft) {
            query = query.orderBy('createTime', 'desc')
        } else {
            query = query.orderBy('publishTime', 'desc')
        }


        let result: AllResult = {
            articleList: {length: 0, pageToken: "", articles: []},
            domainError: null
        };

        try {
            const snapshot = await query.get();
            if (snapshot.empty) {
                return result;
            }

            result.articleList.length = snapshot.docs.length;

            if (result.articleList.length >= ctx.limit) {
                result.articleList.pageToken = snapshot.docs[result.articleList.length - 1].id;
            }

            for (const doc of snapshot.docs) {
                const articles = articleBuilder.fromDB(doc.id, doc.data() as Attributes);
                result.articleList.articles.push(articles);
            }
            return result;

        } catch (e) {
            result.domainError = `query article.all() failed; error=${e.message}`;
            return result;
        }
    }
}
