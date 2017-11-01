export class ServerActions {
    signIn(event: any): any  { /* no operation on server */ }
    signOut(event: any): any { /* no operation on server */ }
}

interface Context {
}

export class ClientActions {
    constructor(ctx: Context) {}

    signIn(event: Event): any {
        console.log(event);
        console.log(event.type);
        console.log(event.currentTarget);
    }

    signOut(event: Event): any {
        console.log(event);
        console.log(event.type);
        console.log(event.currentTarget);
    }
}
