interface Context {
    name: string
    url: string
}

export class Logo {
    readonly name: string;
    readonly url: string;

    constructor(ctx: Context) {
        this.name = ctx.name;
        this.url = ctx.url;
    }
}
