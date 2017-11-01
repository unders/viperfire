import * as firebase from "firebase";
import { bind } from './dom/dom'
import { getClientConfig } from './shared/config/config'
import { newPage } from './page/page'
import { User } from "./shared/data/user";
import { State } from "./shared/data/state";

const main = async () => {
    const resp = await fetch('/__/firebase/init.json');
    const json = await resp.json();
    const fireapp = firebase.initializeApp(json);

    const user = new User({name: "", signedIn: false});
    const state = new State({user: user});

    const config = getClientConfig(state);
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
        bind(app)`${content}`
    }

    console.log("it works 6");
};

main();
