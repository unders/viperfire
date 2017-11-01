export class ServerActions {
    signIn(event: any): any  { /* no operation on server */ }
    signOut(event: any): any { /* no operation on server */ }
}

interface Context {
}

export class ClientActions {
    constructor(ctx: Context) {}

    signIn(event: Event): any {
        event.preventDefault();
        console.log(event.type);
        console.log(event.currentTarget);
    }

    signOut(event: Event): any {
        event.preventDefault();
        console.log(event.type);
        console.log(event.currentTarget);
    }
}
