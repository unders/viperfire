/**
 * Fancy ID generator that creates 20-character string identifiers with the following properties:
 *
 * 1. They're based on timestamp so that they sort *after* any existing ids.
 * 2. They contain 72-bits of random data after the timestamp so that IDs won't collide with other clients' IDs.
 * 3. They sort *lexicographically* (so the timestamp is converted to characters that will sort properly).
 * 4. They're monotonically increasing.  Even if you generate more than one in the same timestamp, the
 *    latter ones will sort after the former ones.  We do this by using the previous random bits
 *    but "incrementing" them by 1 (only in the case of a timestamp collision).
 *
 *  Source:
 *           https://gist.github.com/mikelehen/3596a30bd69384624c11
 *           https://firebase.googleblog.com/2015/02/the-2120-ways-to-ensure-unique_68.html
 */

class Result {
    id: string;
    error: null|string;
}

interface Generator {
    (): Result;
}

// Modeled after base64 web-safe chars, but ordered by ASCII.
// const CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';

export const startIDGenerator = (): Generator => {
    // Timestamp of last push, used to prevent local collisions if you push twice in one ms.
     let lastPushTime = 0;

    // We generate 72-bits of randomness which get turned into 12 characters and appended to the
    // timestamp to prevent collisions with other clients.  We store the last characters we
    // generated because in the event of a collision, we'll use those same characters except
    // "incremented" by one.
    let lastRandChars: number[]  = [];

    return (): Result => {
        try {
            let now = new Date().getTime();
            const duplicateTime = (now === lastPushTime);
            lastPushTime = now;

            const timeStampChars = new Array(8);
            for (let i = 7; i >= 0; i--) {
                timeStampChars[i] = CHARS.charAt(now % 63);
                // NOTE: Can't use << here because javascript will convert
                // to int and lose the upper bits.
                now = Math.floor(now / 63);
            }
            if (now !== 0) {
                return { id: "", error: "we could not convert the entire timestamp." };
            }

            let id = timeStampChars.join('');

            if (!duplicateTime) {
                for (let i = 0; i < 12; i++) {
                    lastRandChars[i] = Math.floor(Math.random() * 63);
                }
            } else {
                // If the timestamp hasn't changed since last push, use the same random
                // number, except incremented by 1.
                let i = 11;
                for (; i >= 0 && lastRandChars[i] === 62; i--) {
                    lastRandChars[i] = 0;
                }
                lastRandChars[i]++;
            }
            for (let i = 0; i < 12; i++) {
                id += CHARS.charAt(lastRandChars[i]);
            }
            if (id.length != 20) {
                return { id: "", error: "id length should be 20." };
            }

            return { id: id, error: null };
        } catch(e) {
            return { id: "", error: e.message };
        }
    }
};

