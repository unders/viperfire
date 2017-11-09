interface Context {
    readonly uid: string;
    readonly name: string
    readonly email: string
}

export class Profile {
    readonly uid: string;
    readonly name: string;
    readonly email: string;

    constructor(ctx: Context) {
        this.uid = ctx.uid;
        this.name = ctx.name;
        this.email = ctx.email;
    }

    static Empty(): Profile {
        return { uid: "", name: "", email: "" }
    }
}
