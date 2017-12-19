import { ContextInit, ContextPresenter, PageLoader} from "./presenter";
import { Popup, HiddenPopup } from "./popup";
import { Snackbar, HiddenSnackbar } from "./snackbar_presenter";
import { Ago } from "../lib/time";
import { User } from "../data/user";

export class Presenter {
    snackbar: Snackbar;
    popup: Popup;
    readonly isPresenter: boolean = true;
    pageLoader: PageLoader;
    readonly ago: Ago;
    currentUser: User;
    title: string;
    path: string;

    toJSON(): string { throw "must be implemented in subclass."; }

    constructor(ctx: ContextPresenter) {
        this.snackbar = new HiddenSnackbar(1);
        this.popup = new HiddenPopup();
        this.pageLoader = ctx.pageLoader;
        this.currentUser = ctx.currentUser;
        this.ago = ctx.ago;
    }

    init(ctx: ContextInit) {
        this.title = ctx.title;
        this.path = ctx.path;
    }
}
