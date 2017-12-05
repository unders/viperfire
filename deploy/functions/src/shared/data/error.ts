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

interface Error {
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

export class errorBuilder {
    static Data(data: ErrorContext): Error {
        return {
            userUID: data.currentUser.uid,
            userName: data.currentUser.name,
            userEmail: data.currentUser.email,
            message: data.message,
            func: data.func,
            open: true,
            status: Status.created,
            solution: "",
            create_time: new Date(),
            update_time: new Date()
        }
    }

    static toJSON(error: Error): string {
        try {
            return JSON.stringify(error);
        } catch (e) {
            return `could not stringify Error class; 
            user.uid=${error.userUID}, json error=${e.message}, original error=${error.message}
            `;
        }
    }
}

