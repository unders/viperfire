# viperfire

## Deployed
* [staging v0.0.3](https://viperfire-stag.firebaseapp.com)

## Deploy
Update the GITTAG (i.e: 0.0.1) in the Makefile. Then do this:

```
 make release
 git commit -m "bump to version: v0.0.1"
 git push
 git tag -a v0.0.1 -m "write a release message"
 git push origin v0.0.1
 make release
 cd deploy && make stag/deploy
 git commit -m "deploy version v0.0.1 to env"
 git push
```

### TODO
- [ X ] Setup ViperHTML for server rendering
- [ X ] Sign In With Google Provider
- [ X ] Create user profile and profile page profile/:id
- [ X ] Create footer with links to all pages: Home | About | My Profile (Sign In)
- [ X ] Rename State to presenter
- [ X ] Should update title on page transition
- [ X ] set claims onCreate user
- [ X ] profile should have its on data struct and not use User...
- [ X ] add Jester tests (see: firestarter)
- [ X ] add test to base64...
- [ X ] add postcss
- [ X ] Add a global loading like Youtube on the top.
- [ X ] all() Fetch articles from firestore
- [ X ] Fix pagination
- [ X ] merge db/path and path/path ...
- [ X ] get() Fetch article from firestore
- [ X ] set Date.now() on page load... so time is calculated relative to that...
- [ ] Add centered message (when we cannot sing in due to network error...)
- [ ] Add snackbar (to show error messages etc.)
- [ ] Reporting error to stackdriver
- [ ] add public/404.html page
- [ ] Fix hasher to work like in firestatic
- [ ] add images stuff from firestatic
- [ ] Setup Service worker with Workbox
- [ ] Setup HTTP push (or preload as done in firestatic)
- [ ] Buy domain
- [ ] Add custom domain
- [ ] Setup Pingdom to ping custom domain

### Error reporting
https://firebase.google.com/docs/functions/reporting-errors


### Project
* [Firebase Console - viperfire stag](https://console.firebase.google.com/project/viperfire-stag/overview)
* [Web - viperfire stage](https://viperfire-stag.firebaseapp.com)
* [Functions - viperfire stag](https://us-central1-viperfire-stag.cloudfunctions.net/helloWorld)

### Inspiration
* [viper news](https://github.com/WebReflection/viper-news)
* [create-viperhtml-app](https://github.com/WebReflection/create-viperhtml-app)

### Firebase
* [Config](https://firebase.google.com/docs/hosting/full-config)

### Firebase Web
* [quickstart js](https://github.com/firebase/quickstart-js)

### Firebase Functions
* [unit testing functions](https://firebase.google.com/docs/functions/unit-testing)
* [Extend Cloud Firestore with Cloud Functions](https://firebase.google.com/docs/firestore/extend-with-functions)
* [write-firebase-functions](https://firebase.google.com/docs/functions/write-firebase-functions)
* [http events](https://firebase.google.com/docs/functions/http-events)
* [Code: functions samples](https://github.com/firebase/functions-samples)
* [Writing an Authentication Trigger with Cloud Functions for Firebase ](https://www.youtube.com/watch?v=pADTJA3BoxE)
* [Code: Auth triggers](https://github.com/firebase/functions-samples/blob/master/quickstarts/email-users/functions/index.js)

### Firebase hosting
* [Video: Building Fast Web Experiences with Firebase Hosting](https://www.youtube.com/watch?v=R3v8EcYzf_M)

### Firebase Auth
* [manage-users](https://firebase.google.com/docs/auth/admin/manage-users)
* [custom-claims](https://firebase.google.com/docs/auth/admin/custom-claims)

### Firebase Firestore
* [Code repo](https://github.com/firebase/quickstart-js/tree/master/firestore)
* [Docs](https://firebase.google.com/docs/firestore/)
* [security reference](https://firebase.google.com/docs/firestore/reference/security/)
* [security rules](https://firebase.google.com/docs/firestore/security/secure-data)
* [Firestore ](https://firebase.google.com/docs/firestore/quickstart?authuser=0)
* [Video: Getting Started With Cloud Firestore on the Web](https://www.youtube.com/watch?v=2Vf1D-rUMwE&list=PLl-K7zZEsYLmnJ_FpMOZgyg6XcIGBu2OX)

### Firebase Code
* [functions-samples](https://github.com/firebase/functions-samples)

### Performance Tools
* [REDbot](https://redbot.org/)
* [Web page test](https://www.webpagetest.org/)
* [Pingdom Website Speed Test](https://tools.pingdom.com/)

### Service Worker
* [offline-cookbook](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/)
* [Workbox](https://workboxjs.org/)
* [workbox lab](https://codelabs.developers.google.com/codelabs/workbox-lab/#0)
* [Workbox: Flexible PWA Libraries ](https://www.youtube.com/watch?v=DtuJ55tmjps)
* [Workbox](https://developers.google.com/web/tools/workbox/)

### ViperHTML
* [ViperHTML](https://github.com/unders/mywiki/wiki/ViperHTML)
* [Video: VDOM vs lit-html](https://www.youtube.com/watch?v=uCHZJy2n8Qs)

### Docs
* [Firebase Glob patterns](http://mywiki.wooledge.org/glob)
