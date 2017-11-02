interface Logger {
    info(data: any): void
    error(data: any): void
}

class NoLog {
    static info(data: any): void { /* no operation when online */ }
    static error(data: any): void { /* no operation when online */ }
}

class Log {
    static info(data: any): void {
        console.info(data);
    }
    static error(data: any): void {
        console.error(data);
    }
}

export const log = function(isOnline: boolean): Logger {
    if (isOnline) {
        return NoLog;
    }

    return Log;
};
