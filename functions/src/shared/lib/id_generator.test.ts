import { startIDGenerator } from "./id_generator";

describe("startIDGenerator", () => {
    const idGen = startIDGenerator();

    test("generate unique sortable IDs", () => {
        let tests = [ "", "", "" ];
        let results = [];
        let want = [];

        for (let test in tests) {
            const { id, error } = idGen();

            expect(error).toEqual(null);
            expect(id).not.toEqual("");

            results.unshift(id); // insert at start
            want.push(id); // appends items
        }

        // sort in ascending (Arranged from smallest to largest. Increasing.),
        // ASCII character order
        results.sort();
        expect(results).toEqual(want);
    })
});
