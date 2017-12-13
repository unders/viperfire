import { Article, Status } from "../data/article";
import { statusCode } from "./domain";

export const newPageToken = (time: number, sortID: string): string => {
    return `${time}-${sortID}`;
};

interface PageToken {
    time: number;
    sortID: string;
}

interface ResultPageToken {
    pageToken: PageToken;
    pageTokenError: null|string;
}

export const parsePageToken = (pageToken: string): ResultPageToken => {
    try {
        const a = pageToken.split("-");

        const time = parseInt(a[0], 10);

        return {
            pageToken: {
                time: time,
                sortID: a[1]
            },
            pageTokenError: null
        }
    } catch(e) {
        return {
            pageToken: {
                time: 1,
                sortID: ""
            },
            pageTokenError: e.message
        }
    }
};

export interface AllContext {
    readonly status: Status;
    readonly limit: number;
    readonly pageToken: string;
}

export interface AllResult {
    articleList: ArticleList
    domainError: string|null;
}

export interface ArticleList {
    length: number;
    pageToken: string;
    articles: Article[];
}

export interface CreateResult {
    id: string;
    error: string|null;
}

export interface GetResult {
    code: statusCode;
    article: Article;
    error: string|null;
}
