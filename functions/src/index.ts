// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

import * as functions from 'firebase-functions'

export let helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firestarter!\n\n");
});
