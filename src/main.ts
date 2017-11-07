import * as firebase from "firebase";
import { getClientConfig } from './shared/config/config'
import { getInitialState } from "./shared/data/state";
import { ActionHandler } from "./actions";
import { Page } from './page/page'
import { log } from './log/log'
import { Firebase } from './firebase/firebase'

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
            state.user.name = user.name;
            state.user.signedIn = user.signedIn;
        }
        const page = new Page({ root: root, view: config.view, state: state });
        new ActionHandler({ state: state, page: page, firebase: fireapp, logger: logger });

        page.render();
        logger.info("init app done");
    } else {
        logger.error("Could not find id: #app");
    }
};

main();
