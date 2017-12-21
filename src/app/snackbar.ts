import { Page } from "../page/page";
import {
    ActionSnackbar, HiddenSnackbar, SignedInSnackbar, Snackbar,
    state
} from "../shared/presenter/snackbar_presenter";
import { Logger } from "../log/log";

interface Context {
    page: Page;
    logger: Logger;
}

// State transitions
// hide -> slideIN -> slideOut -> hide
// hide -> slideIN -> slideOut -> slideIN -> slideOut -> hide
// hide -> slideIN -> blink -> clear -> slideOut -> hide
// hide -> slideIN -> blink -> clear -> blink -> clear -> slideOut -> hide
// hide -> slideIN -> blink -> blink -> clear -> slideOut -> hide

export class SnackbarHelper {
    private readonly page: Page;
    private readonly logger: Logger;

    constructor(ctx: Context) {
        this.page = ctx.page;
        this.logger = ctx.logger;

        this.clear = this.clear.bind(this);
        this.slideOut = this.slideOut.bind(this);
        this.hide = this.hide.bind(this);

    }

    //
    //  -- PUBLIC --
    //

    showUndo(): void {
        this.logger.info("snackbar.showUndo()");
        this.show(new ActionSnackbar({
            text: "Did something",
            actionText: "undo",
            action: "undo",
        }));
    }

    showSignedIn(email: string): void {
        this.logger.info("snackbar.showSignedIn()");
        this.show(new SignedInSnackbar({ email: email }));
    }

    close(): void {
        const version = this.page.presenter.snackbar.version + 1;
        this.page.presenter.snackbar.version = version;
        this.slideOut(version);
    }

    //
    //  -- PRIVATE --
    //

    private nextState(): state {
        const currentState = this.page.presenter.snackbar.state;
        switch (currentState) {
            case state.hide:
                return state.slideIN;
            case state.slideOut:
                return state.slideIN;
            case state.slideIN:
                return state.blink;
            case state.blink:
                return state.blink;
            case state.clear:
                return state.blink;
            default:
                this.logger.error(`current state: ${currentState} has no next state`);
                return state.hide;
        }
    }

    private show(s: Snackbar): void {
        const version = this.page.presenter.snackbar.version + 1;
        const currentState = this.nextState();
        this.logger.info(`snackbar.show(); state:${currentState}; version:${version}`);
        s.version = version;
        s.state = currentState;
        this.page.presenter.snackbar = s;
        this.page.render();

        switch (currentState) {
            case state.slideIN:
                setTimeout(this.slideOut, 5000, version);
                break;
            case state.blink:
                setTimeout(this.clear, 500, version);
                break;
            default:
                this.logger.error(`current state:${state} has no next state`);
                setTimeout(this.slideOut, 5000, version);
                break;
        }
    }

    //
    //     -- CALLBACKS --
    //


    private clear(version: number): void {
        if (this.page.presenter.snackbar.version !== version) {
            this.logger.info(`snackbar.clear(); version:${version} - skipping`);
            return;
        }

        const nextVersion = this.page.presenter.snackbar.version + 1;
        this.logger.info(`snackbar.clear(); clear version:${version}; new version:${nextVersion}`);
        this.page.presenter.snackbar.version = nextVersion;
        this.page.presenter.snackbar.state = state.clear;
        this.page.render();

        // slideOut snackbar after 4 seconds
        setTimeout(this.slideOut, 4000, nextVersion);
    }

    private slideOut(version: number): void {
        if (this.page.presenter.snackbar.version !== version) {
            this.logger.info(`snackbar.slideOut(); version:${version} - skipping`);
            return;
        }

        this.logger.info(`snackbar.slideOut(); version:${version}`);
        const nextVersion = version + 1;
        this.page.presenter.snackbar.version = nextVersion;
        this.page.presenter.snackbar.state = state.slideOut;
        this.page.render();

        // hide snackbar after 0.6 second
        setTimeout(this.hide, 600, nextVersion);
    }

    private hide(version: number): void {
        if (this.page.presenter.snackbar.version !== version) {
            this.logger.info(`snackbar.hide(); version:${version} - skipping`);
            return;
        }

        this.logger.info(`snackbar.hide(); version:${version}`);
        const nextVersion = this.page.presenter.snackbar.version + 1;
        this.page.presenter.snackbar = new HiddenSnackbar(nextVersion);
        this.page.render();
    }
}
