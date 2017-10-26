import { bind, wire } from './dom/dom'
import * as firebase from "firebase";

const main = async () => {
    // Initialize Firebase

    const resp = await fetch('/__/firebase/init.json');
    const json = await resp.json();
    const fireapp = firebase.initializeApp(json);

    const dbRef = fireapp.database().ref().child('text');
    dbRef.on('value', (snap) => {
        if (snap) {
            console.log(snap.val());
        }
    });

    console.log("it works");


    const app = document.getElementById("app");
    if (app) {
        bind(app)`<div>It works</div>${wire()`<p>Hello world</p>`}`
    }
};

main();
