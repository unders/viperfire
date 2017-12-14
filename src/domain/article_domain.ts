import * as firebase from "firebase";
import { articleBuilder, Attributes, Status } from "../shared/data/article";
import { AllContext, AllResult, newPageToken, parsePageToken } from "../shared/domain/article_domain";
import { path } from "../shared/path/db";

interface Context {
    firestore: firebase.firestore.Firestore;
}

export class ArticleDomain {
    private readonly db: firebase.firestore.Firestore;
    private readonly limit: number = 3;

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
            .where("status", "==", ctx.status)
            .limit(ctx.limit);

        if (ctx.status === Status.Draft) {
            query = query.orderBy('createTime', 'desc')
        } else {
            query = query.orderBy('publishTime', 'desc')
        }

        let result: AllResult = {
            articleList: { length: 0, pageToken: "", articles: [] },
            domainError: null
        };

        if (ctx.pageToken !== "") {
            const { pageToken, pageTokenError } = parsePageToken(ctx.pageToken);
            if (pageTokenError) {
                result.domainError = `could not parse pageToken; error=${pageTokenError}`;
                return result;
            }
            query = query.orderBy('sortID')
                .startAfter(pageToken.time, pageToken.sortID);
        }

        try {
            const snapshot = await query.get();
            if (snapshot.empty) {
                return result;
            }

            result.articleList.length = snapshot.docs.length;

            if (result.articleList.length >= ctx.limit) {
                const last = (snapshot.docs[result.articleList.length - 1].data() as Attributes);

                if (last.status === Status.Draft) {
                    result.articleList.pageToken = newPageToken(last.createTime, last.sortID);
                } else {
                    result.articleList.pageToken = newPageToken(last.publishTime, last.sortID);
                }
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
