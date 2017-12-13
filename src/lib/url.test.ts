import { url } from "./url";

describe("url", () => {
   describe(".Query()()", () => {
       test("when one value", () => {
           const tests = [
               { query: "page_token=one", name: "page_token", want: "one", }, // ok
               { query: "page_token=two", name: "wrong-name", want: "", },    // wrong name
               { query: "page_token-three", name: "page_token", want: "", },  // url is wrong
           ];

           for (let test of tests) {
               const got = url.Query(test.query)(test.name);
               expect(got).toEqual(test.want);
           }
       });

       test("when two values", () => {
           const tests = [
               {
                   query: "page_token=one&limit=1",
                   name1: "page_token", want1: "one",
                   name2: "limit", want2: "1"
               },
               {
                   query: "page_token=twolimit=2", // wrong url (split on '=' will fail.)
                   name1: "page_token", want1: "",
                   name2: "limit", want2: ""
               },
               {
                   query: "page_token=three&limit=3",
                   name1: "page_token", want1: "three",
                   name2: "wrong-name", want2: ""     // wrong name
               },
           ];

           for (let test of tests) {
               const q = url.Query(test.query);

               expect(q(test.name1)).toEqual(test.want1);
               expect(q(test.name2)).toEqual(test.want2);
           }
       });
   });
});
