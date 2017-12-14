import * as firebase from "firebase";
import { articleBuilder, Attributes, Status } from "../shared/data/article";
import { path } from "../shared/path/db";
import { domainInternalError, domainNotFound, statusCode } from "../shared/domain/domain";
import {
    AllContext, AllResult, GetResult, newPageToken,
    parsePageToken
} from "../shared/domain/article_domain";

interface Context {
    firestore: firebase.firestore.Firestore;
}

export class ArticleDomain {
    private readonly db: firebase.firestore.Firestore;
    private readonly limit: number = 3;

    constructor(ctx: Context) {
        this.db = ctx.firestore;
    }

    async get(id: string): Promise<GetResult> {
        const article = path.article(id);
        try {
            const doc = await this.db.doc(article).get();
            if (!doc.exists) {
                const { code, err } = domainNotFound(article);
                return { code: code, article: articleBuilder.empty(id), error: err };
            }

            const a = articleBuilder.fromDB(id, doc.data() as Attributes);
            return { code: statusCode.OK, article: a, error: null };
        } catch(e) {
            const { code, err } = domainInternalError(article, e.message);
            return { code: code, article: articleBuilder.empty(id), error: err };
        }
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
