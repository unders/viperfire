export interface ErrorContext {
    readonly currentUser: User;
    readonly message: string;
    readonly func: string;
}

enum Status {
    created = "created",
    assigned = "assigned",
    ignored = "ignored",
    resolved = "resolved"
}

interface User {
    uid: string;
    name: string;
    email: string;
}

interface serialize {
    readonly userUID: string;
    readonly userName: string;
    readonly userEmail: string;
    readonly message: string;
    readonly func: string;
    readonly create_time: Date;
    readonly update_time: Date;
    readonly open: boolean;
    readonly status: Status;
    readonly solution: string;
}

export class Error implements serialize {
    readonly userUID: string;
    readonly userName: string;
    readonly userEmail: string;
    readonly message: string;
    readonly func: string;
    readonly open: boolean;
    readonly status: Status;
    readonly solution: string;
    readonly create_time: Date;
    readonly update_time: Date;

    constructor(ctx: ErrorContext) {
        this.userUID = ctx.currentUser.uid;
        this.userName = ctx.currentUser.name;
        this.userEmail = ctx.currentUser.email;
        this.message = ctx.message;
        this.func = ctx.func;
        this.open = true;
        this.status = Status.created;
        this.solution = "";
        this.create_time = new Date();
        this.update_time = new Date();
    }

    toData(): serialize {
        return {
            userUID: this.userUID,
            userName: this.userName,
            userEmail: this.userEmail,
            message: this.message,
            func: this.func,
            open: this.open,
            status: this.status,
            solution: this.solution,
            create_time: this.create_time,
            update_time: this.update_time
        }
    }

    toJSON(): string {
        try {
            return JSON.stringify(this.toData());
        } catch (e) {
            return `could not stringify Error class; 
            user.uid=${this.userUID}, json error=${e.message}, original error=${this.message}
            `;
        }
    }
}
