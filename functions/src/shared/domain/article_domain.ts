import { Article, Status } from "../data/article";
import { statusCode } from "./domain";

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
