export enum Status {
    Draft = "draft",
    Published = "published",
}

export interface ArticleList {
    readonly uid: string;
    readonly title: string;
    readonly bodyText: string;
    readonly author: string;
    readonly commentCount: number;
    readonly status: Status;
    readonly publishTime: Date;
    readonly createTime: Date;
    readonly updateTime: Date;
}

export class articleListBuilder {
    static fromDB(data: ArticleList): ArticleList {
        return data;
    }

    static hasError(data: ArticleList): string|null {
        return null;
    }
}

