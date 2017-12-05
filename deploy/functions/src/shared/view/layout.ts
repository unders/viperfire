import { wireRender } from "../../dom/dom";

interface MainContext {
    title: string
    html: string
    initialState: string
}

export const renderMainPageLayout = function(render: wireRender, ctx: MainContext): string {
    return render`
<!DOCTYPE html>
<html class="no-js" lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="viperfire starter app">
    <title>${ctx.title}</title>
    <link rel="stylesheet" href="/assets/css/872fa5ae9cdef319a06276cde1fff52072eb313b-main.css">
    <script defer src="/__/firebase/4.6.0/firebase-app.js"></script>
    <script defer src="/__/firebase/4.6.0/firebase-auth.js"></script>
    <script defer src="/__/firebase/4.6.0/firebase-firestore.js"></script>
    <script defer src="/__/firebase/init.js"></script>
    <!--
        <script defer src="/__/firebase/4.6.0/firebase-messaging.js"></script>
        <script defer src="/__/firebase/4.6.0/firebase-storage.js"></script>
    -->
</head>
<body>
    <div id="app" class="app">${[ctx.html]}</div>
    <script>
        window.__INITIAL_STATE__ ='${[ctx.initialState]}';
    </script>
    <script defer src="/assets/js/7a3d4e43d2ec8cf779a82ce1b3232aaf15dbaab1-bundle.js"></script>
</body>
</html>`;
};
