import * as firebase from "firebase";
import { getClientConfig } from './shared/config/config'
import { State, getInitialState } from "./shared/data/state";
import { ActionHandler } from "./actions";
import { Page } from './page/page'
import { log } from './log/log'

const main = () => {
    const config = getClientConfig();
    const logger = log(config.isOnline);
    logger.info("init app start");

    const root = document.getElementById("app");
    if (root) {
        const { initialState, errMessage } = getInitialState();
        if (initialState === null) {
            logger.error("getInitialState() failed; error= " + errMessage);
            return;
        }

        const fireapp = firebase.app();
        const state = new State(initialState);
        const page = new Page({ root: root, app: config.app, state: state });
        new ActionHandler({state: state, page: page });
        logger.info("init app done");
    } else {
        logger.error("Could not find id: #app");
    }
};

main();
