interface Context {
    name: string
    signedIn: boolean
}

export class User {
    name: string;
    signedIn: boolean;

    constructor(ctx: Context) {
        this.name = ctx.name;
        this.signedIn = ctx.signedIn;
    }
}
