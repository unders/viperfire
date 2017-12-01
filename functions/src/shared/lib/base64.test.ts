import { base64 } from "./base64";

describe("base64", () => {
    test(".decodeUnicode", () => {
        const tests = [
            { want: '✓ à la mode', encoded: "4pyTIMOgIGxhIG1vZGU=" },
            { want: 'åäö is swedish characters...', encoded: "w6XDpMO2IGlzIHN3ZWRpc2ggY2hhcmFjdGVycy4uLg==" },
        ];

        for (let test of tests) {
            const got = base64.decodeUnicode(test.encoded);
            expect(got).toEqual(test.want)
        }
    })
});
