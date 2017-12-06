interface Context {
    message: string
}

export class ArticleList {
    readonly message: string;

    constructor(ctx: Context) {
        this.message = ctx.message;
    }
}
