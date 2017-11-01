import { User } from "./user";


interface Context {
    readonly user: User;
}

export class State {
    user: User;

    constructor(ctx: Context) {
        this.user = ctx.user;
    }
}
