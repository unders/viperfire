// import { bind, wire } from './dom/dom'
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

    // const index = renderIndex(wire(), {message: "Hello World 7"});

    // const app = document.getElementById("app");
    // if (app) {
    //     bind(app)`<div>Hyper HTML is cool</div>${index}`
    // }

    console.log("it works 6");
};

main();
