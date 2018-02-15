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
    <script defer src="/__/firebase/4.6.0/firebase-app.js"></script>
    <script defer src="/__/firebase/4.6.0/firebase-auth.js"></script>
    <script defer src="/__/firebase/4.6.0/firebase-firestore.js"></script>
    <script defer src="/__/firebase/init.js"></script>
    <script defer src="/assets/js/2c4ada86d651cc540e0d244a9d75a4f07c5882f5-bundle.js"></script>
    <link rel="stylesheet" href="/assets/css/4b91be373a91929f5ccff78f826a1c648f77744e-reset.css">
    <link rel="stylesheet" href="/assets/css/0b6a036968e1a67a1717cf75a1aabf0eb3ca4df6-main.css">
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
</body>
</html>`;
};
