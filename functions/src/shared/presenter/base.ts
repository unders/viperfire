import { ContextInit, ContextPresenter, PageLoader} from "./presenter";
import { Popup, HiddenPopup } from "./popup";
import { Ago } from "../lib/time";
import { User } from "../data/user";


export class Presenter {
    popup: Popup;
    readonly isPresenter: boolean = true;
    pageLoader: PageLoader;
    readonly ago: Ago;
    currentUser: User;
    title: string;
    path: string;

    toJSON(): string { throw "must be implemented in subclass."; }

    constructor(ctx: ContextPresenter) {
        this.popup = new HiddenPopup;
        this.pageLoader = ctx.pageLoader;
        this.currentUser = ctx.currentUser;
        this.ago = ctx.ago;
    }

    init(ctx: ContextInit) {
        this.title = ctx.title;
        this.path = ctx.path;
    }
}
