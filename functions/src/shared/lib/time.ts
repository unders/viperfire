export class time {
    static ago(now?: number): Ago {
        if (!now) {
            now = Date.now();
        }

        return new Ago(now);
    }
}

const units = [
    { name: "second", limit: 60, in_seconds: 1 },
    { name: "minute", limit: 3600, in_seconds: 60 },
    { name: "hour", limit: 86400, in_seconds: 3600  },
    { name: "day", limit: 604800, in_seconds: 86400 },
    { name: "week", limit: 2629743, in_seconds: 604800  },
    { name: "month", limit: 31556926, in_seconds: 2629743 },
    { name: "year", limit: null, in_seconds: 31556926 }
];

class Ago {
    private readonly now: number;

    constructor(now: number) {
        this.now = now;
    }

    time(ms: number) {
        const timeAgo  = (this.now - ms) / 1000; // convert to seconds
        if (timeAgo < 5) return "now";

        for (let unit of units) {
            if (!unit.limit || timeAgo < unit.limit) {
                const time = Math.floor(timeAgo / unit.in_seconds);

                let unitName = unit.name;
                if (time > 1) {
                    unitName = `${unitName}s`;
                }

                return `${time} ${unitName} ago`;
            }
        }
    }
}
