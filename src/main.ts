import { getClientConfig } from './shared/config/config'
import { getPresenter } from "./shared/presenter/presenter";
import { log } from './log/log'
import { Domain } from "./domain/domain";
import { Page } from "./page/page";
import { App } from "./app/app";
import { ActionHandler } from "./actions";
import { router } from './router/router';

const main = () => {
    const config = getClientConfig();
    const logger = log(config.isOnline);
    logger.info("init app start");

    const root = document.getElementById("app");
    if (!root) {
        logger.error("could not find id: #app");
        return;
    }

    const { presenter, errMessage } = getPresenter();
    if (presenter === null) {
        logger.error(`getPresenter() failed; error=${errMessage}`);
        return;
    }

    const domain =  new Domain({ logger: logger });
    const { currentUser, err } = domain.auth().currentUser().getFromCache();
    if (currentUser === null) {
        logger.info(`auth().currentUser().getFromCache() failed; reason=${err}`);
    } else {
        presenter.currentUser = currentUser;
    }

    const app = new App({
        domain: domain,
        presenter: presenter,
        page: new Page({ view: config.view, body: root}),
        logger: logger
    });
    app.render();
    new ActionHandler({ app: app, domain: domain, logger: logger });
    router(app);

    logger.info("init app done");
};

main();
