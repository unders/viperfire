import { time } from "./time";

describe("time", () => {
    test(".ago().time()", () => {
        const tests = [
            { time: 1000, want: "now", now: 5000 },
            { time: 1000, want: "5 seconds ago", now: 6000 },
            { time: 1000, want: "8 seconds ago", now: 9000 },

            { time: 8001*60, want: "59 seconds ago", now: 9000*60 }, // 59s
            { time: 8000*60, want: "1 minute ago", now: 9000*60 },   // 60s
            { time: 8000*60, want: "2 minutes ago", now: 10000*60 }, // 120s

            { time: 8001*60*60, want: "59 minutes ago", now: 9000*60*60 }, // 59 minutes
            { time: 8000*60*60, want: "1 hour ago", now: 9000*60*60 },     // 1 hour
            { time: 8000*60*60, want: "2 hours ago", now: 10000*60*60 },   // 2 hours

            { time: 8001*60*60*24, want: "23 hours ago", now: 9000*60*60*24 }, // 23 hours
            { time: 8000*60*60*24, want: "1 day ago", now: 9000*60*60*24 },    // 1 day
            { time: 8000*60*60*24, want: "2 days ago", now: 10000*60*60*24 },  // 2 days

            { time: 8001*60*60*24*7, want: "6 days ago", now: 9000*60*60*24*7 },   // 6 days
            { time: 8000*60*60*24*7, want: "1 week ago", now: 9000*60*60*24*7 },   // 1 week
            { time: 8000*60*60*24*7, want: "2 weeks ago", now: 10000*60*60*24*7 }, // 2 weeks

            { time: 8000*60*60*24*7*4, want: "4 weeks ago", now: 9000*60*60*24*7*4 },   // 4 weeks
            { time: 8000*60*60*24*7*5, want: "1 month ago", now: 9000*60*60*24*7*5},    // 1 month
            { time: 8000*60*60*24*7*5, want: "2 months ago", now: 10000*60*60*24*7*5 }, // 2 months

            { time: 8000*60*60*24*7*52, want: "11 months ago", now: 9000*60*60*24*7*52},  // 11 months
            { time: 8000*60*60*24*7*53, want: "1 year ago", now: 9000*60*60*24*7*53},     // 1 year
            { time: 8000*60*60*24*7*53, want: "2 years ago", now: 10000*60*60*24*7*53 },  // 2 year
        ];

        for (let test of tests) {
            const got = time.ago(test.now).time(test.time);
            expect(got).toEqual(test.want)
        }
    })
});
