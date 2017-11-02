import * as firebase from "firebase";
import { bind } from './dom/dom'
import { getClientConfig } from './shared/config/config'
import { User } from "./shared/data/user";
import { State } from "./shared/data/state";
import { ActionHandler } from "./actions";
import { newPage } from './page/page'

const main = async () => {
    const resp = await fetch('/__/firebase/init.json');
    const json = await resp.json();
    const fireapp = firebase.initializeApp(json);

    const config = getClientConfig();
    const user = new User({name: "", signedIn: false});
    const state = new State({user: user});
    new ActionHandler({state: state});
    const page = newPage(config);

    const dbRef = fireapp.database().ref().child('text');
    dbRef.on('value', (snap) => {
        if (snap) {
            console.log(snap.val());
        }
    });

    const app = document.getElementById("app");
    if (app) {
        const content = page.articleList(user, "Hello World from Client" );
        const pager = bind(app);
        pager`${content}`;

        const update = () => {
            console.log("update new page");
            const content = page.about(user);
            pager`${content}`;
            console.log("updated new page");
        };
        setTimeout(update, 2000);
        console.log("it works 6");
    }

};

main();
