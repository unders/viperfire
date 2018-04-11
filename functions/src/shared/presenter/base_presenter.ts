import { ContextInit, ContextPresenter, PageLoader} from "./presenter";
import { Popup, HiddenPopup } from "./popup";
import { Auth } from "./auth_presenter";
import { Snackbar, HiddenSnackbar } from "./snackbar_presenter";
import { Ago } from "../lib/time";
import { User } from "../data/user";
import { signInForm, SignInForm} from "./sign_in_form_presenter";

export class Presenter {
    readonly isPresenter: boolean = true;
    readonly ago: Ago;
    auth: Auth;
    signInForm: SignInForm;
    snackbar: Snackbar;
    popup: Popup;
    pageLoader: PageLoader;
    currentUser: User;
    title: string = "";
    path: string = "";

    toJSON(): string { throw "must be implemented in subclass."; }

    constructor(ctx: ContextPresenter) {
        this.auth = Auth.hide;
        this.signInForm = signInForm;
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
