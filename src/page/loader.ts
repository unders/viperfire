import { Page } from "./page";
import { PageLoader } from "../shared/presenter/presenter";

export class loader {
    static start(p: Page): void {
        loader.resetNow(p);
        p.presenter.pageLoader = PageLoader.Loading;
        p.render();
    }

    static reset(p: Page): void {
        const reset = (pageNumber: number): void => {
            if (p.pageNumber === pageNumber) {
                loader.resetNow(p);
            }
        };

        reset(p.pageNumber);
    }

    static done(p: Page): void {
        const done = (pageNumber: number): void => {
            if (p.pageNumber !== pageNumber) {
                return;
            }

            if (p.presenter.pageLoader === PageLoader.Loading) {
                p.presenter.pageLoader = PageLoader.Done;
            }
            p.render();
        };

        done(p.pageNumber);
    }

    private static resetNow(p: Page): void {
        if (p.presenter.pageLoader !== PageLoader.Neutral) {
            p.presenter.pageLoader = PageLoader.Neutral;
            p.render();
        }
    }
}
