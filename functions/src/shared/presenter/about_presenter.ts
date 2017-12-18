import { ContextPresenter, SerializePresenter } from "./presenter";
import { path } from "../path/url";
import { time } from "../lib/time";
import { Presenter } from "./base";

export class AboutPresenter extends Presenter {
    constructor(ctx: ContextPresenter) {
        super(ctx);
        super.init({ title: "About", path: path.about })
    }

    static Next(p: Presenter): AboutPresenter {
        return new AboutPresenter({
            pageLoader: p.pageLoader,
            currentUser: p.currentUser,
            ago: time.ago()
        });
    }

    static Init(p: Presenter): AboutPresenter {
        return new AboutPresenter({
            pageLoader: p.pageLoader,
            currentUser: p.currentUser,
            ago: time.ago()
        });
    }

    toJSON(): string {
        return JSON.stringify(this.toObject());
    }

    private toObject(): SerializePresenter {
        return {
            pageLoader: this.pageLoader,
            title:       this.title,
            isPresenter: this.isPresenter,
            path:        this.path,
            currentUser: this.currentUser,
        };
    }
}
