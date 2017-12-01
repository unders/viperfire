import { User, userBuilder } from "../shared/data/user";

interface viper {
    user: User;
}

declare global {
    interface Window { __VIPER__: viper; }
}
window.__VIPER__ = window.__VIPER__ || { user: userBuilder.signedOut() };


export interface Logger {
    info(data: any): void
    error(data: any): void
    setUser(user: User): void
}

class NoLog {
    static info(data: any): void { /* no operation when online */ }
    static error(data: any): void { /* no operation when online */ }
    static setUser(data: User): void { /* no operation when online */ }
}

class Log {
    static info(data: any): void {
        console.info(data);
    }
    static error(data: any): void {
        console.error(data);
    }
    static setUser(user: User): void {
        window.__VIPER__.user = user;
    }
}

export const log = function(isOnline: boolean): Logger {
    if (isOnline) {
        return NoLog;
    }

    return Log;
};
