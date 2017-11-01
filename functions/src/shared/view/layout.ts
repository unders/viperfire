import { wireRender } from "../../dom/dom";

interface MainContext {
    title: string
    app: string
}

export const renderMainPageLayout = function(render: wireRender, ctx: MainContext): string {
    return render`
<!DOCTYPE html>
<html class="no-js" lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="description" content="viperfire starter app">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${ctx.title}</title>
    <link rel="stylesheet" href="/assets/css/main.css">
    <script defer src="/__/firebase/4.6.0/firebase-app.js"></script>
    <script defer src="/__/firebase/4.6.0/firebase-auth.js"></script>
    <script defer src="/__/firebase/4.6.0/firebase-database.js"></script>
    <!--
        <script src="/__/firebase/4.6.0/firebase-storage.js"></script>
        <script src="/__/firebase/4.6.0/firebase-messaging.js"></script>
        <script src="/__/firebase/4.6.0/firebase-firestore.js"></script>
    -->
</head>
<body>
    <div id="app" class="app">${[ctx.app]}</div>
    <script defer src="/assets/js/bundle.js"></script>
</body>
</html>
`;
};
