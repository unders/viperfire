export interface ErrorContext {
    readonly currentUser: User;
    readonly message: string;
    readonly func: string;
}

interface User {
    uid: string;
    name: string;
    email: string;
}

export class Error {
    readonly userUID: string;
    readonly userName: string;
    readonly userEmail: string;
    readonly message: string;
    readonly func: string;
    readonly create_time: Date;

    constructor(ctx: ErrorContext) {
        this.userUID = ctx.currentUser.uid;
        this.userName = ctx.currentUser.name;
        this.userEmail = ctx.currentUser.email;
        this.message = ctx.message;
        this.func = ctx.func;
        this.create_time = new Date();
    }

    toJSON(): string {
        try {
            return JSON.stringify({
                userUID: this.userUID,
                userName: this.userName,
                userEmail: this.userEmail,
                message: this.message,
            });
        } catch (e) {
            return `could not stringify Error class; 
            user.uid=${this.userUID}, json error=${e.message}, original error=${this.message}
            `;
        }
    }
}
