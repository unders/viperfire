import * as firebase from "firebase";
import { getClientConfig } from './shared/config/config'
import { getInitialState } from "./shared/data/state";
import { ActionHandler } from "./actions";
import { log } from './log/log'
import { Firebase } from './firebase/firebase'
import { User } from "./shared/data/user";
import { router } from './router/router';
import { Domain } from "./shared/domain/domain";
import { App } from "./app/app";

const main = () => {
    const config = getClientConfig();
    const logger = log(config.isOnline);
    logger.info("init app start");

    const root = document.getElementById("app");
    if (root) {
        const { state, errMessage } = getInitialState();
        if (state === null) {
            logger.error("getInitialState() failed; error= " + errMessage);
            return;
        }

        const fireapp =  new Firebase(firebase.app());
        const { user, err } = fireapp.userCache();
        if (user === null) {
            logger.info("could not get user from local cache; message= " + err);
        } else {
            state.user = new User(user);
        }
        const domain =  new Domain({firestore: firebase.firestore()});
        const app = new App({ root: root, domain: domain, view: config.view, state: state, logger: logger });
        app.render();
        new ActionHandler({ app: app, firebase: fireapp, logger: logger });
        router(app);

        logger.info("init app done");
    } else {
        logger.error("Could not find id: #app");
    }
};

main();
