import { Page } from "../page/page";
import { HiddenSnackbar, SignedInSnackbar, Snackbar } from "../shared/presenter/snackbar_presenter";
import { Logger } from "../log/log";

interface Context {
    page: Page;
    logger: Logger;
}

export class SnackbarHelper {
    private readonly page: Page;
    private readonly logger: Logger;

    constructor(ctx: Context) {
        this.page = ctx.page;
        this.logger = ctx.logger;

        this.close = this.close.bind(this);
    }

    showSignedIn(email: string): void {
        this.logger.info("snackbar.showSignedIn()");
        const version = this.page.presenter.snackbar.version + 1;
        this.start(new SignedInSnackbar({ email: email, version: version }));
    }

    hide(): void {
        this.logger.info("snackbar.hide()");
        const version = this.page.presenter.snackbar.version + 1;
        this.page.presenter.snackbar = new HiddenSnackbar(version);
        this.page.render();
    }

    private start(s: Snackbar): void {
        this.logger.info("snackbar.start()");
        this.page.presenter.snackbar = s;
        this.page.render();

        // close snackbar after 5 seconds
        setTimeout(this.close, 5000, s.version);
    }

    private close(version: number): void {
        if (this.page.presenter.snackbar.version === version) {
            this.logger.info("snackbar.close()");
            this.page.presenter.snackbar = new HiddenSnackbar(version);
            this.page.render();
        } else {
            this.logger.info("snackbar.close() - skipping");
        }
    }
}
