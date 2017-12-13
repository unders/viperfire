export enum Status {
    Draft = "draft",
    Published = "published",
}

export interface Attributes {
    readonly sortID: string;
    readonly title: string;
    readonly bodyText: string;
    readonly author: string;
    readonly commentCount: number;
    readonly status: Status;
    readonly publishTime: number;
    readonly createTime: number;
    readonly updateTime: number;
}

export interface Article extends Attributes {
    readonly id: string;
}

export class articleBuilder {
    static setSortID(data: Article, sortID: string): Article {
        return {
            id: data.id,
            sortID: sortID,
            title: data.title,
            bodyText:  data.bodyText,
            author:data.author,
            commentCount: data.commentCount,
            status: data.status,
            publishTime: data.publishTime,
            createTime: data.createTime,
            updateTime: data.updateTime
        }
    }


    static empty(id: string): Article {
        return {
            id: id,
            sortID: "",
            title: "",
            bodyText:  "",
            author: "",
            commentCount: 0,
            status: Status.Draft,
            publishTime: 151272497597500, // Wed Aug 21 6763 04:13:17 GMT+0200 (CEST)
            createTime: Date.now(),
            updateTime: Date.now()
        }
    }

    static toDB(data: Article): Attributes {
        return {
            sortID: data.sortID,
            title: data.title,
            bodyText:  data.bodyText,
            author:data.author,
            commentCount: data.commentCount,
            status: data.status,
            publishTime: data.publishTime,
            createTime: data.createTime,
            updateTime: data.updateTime
        }
    }

    static fromDB(id: string, data: Attributes): Article {
        return {
            id: id,
            sortID: data.sortID,
            title: data.title,
            bodyText:  data.bodyText,
            author:data.author,
            commentCount: data.commentCount,
            status: data.status,
            publishTime: data.publishTime,
            createTime: data.createTime,
            updateTime: data.updateTime
        }
    }

    static hasError(data: Attributes): string|null {
        return null;
    }
}

