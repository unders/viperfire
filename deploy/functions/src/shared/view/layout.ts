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
    <link rel="stylesheet" href="/assets/css/e1f4a92cf508ce8949ddd63cafbfb1f68f0cca26-main.css">
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
    <div id="app">${[ctx.html]}</div>
    <script>
        window.__INITIAL_STATE__ ='${[ctx.initialState]}';
    </script>
    <script defer src="/assets/js/429caad7f6e83ea9f7d84242ec0ad6655fc9f3f9-bundle.js"></script>
</body>
</html>`;
};
