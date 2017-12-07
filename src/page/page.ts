import { bind, wireRender } from "../dom/dom";
import { View } from "../shared/view/view";
import { ArticleListPresenter } from "../shared/presenter/article_list_presenter";
import { ArticleList } from "../shared/data/article_list";
import { ProfilePresenter } from "../shared/presenter/profile_presenter";
import { AboutPresenter } from "../shared/presenter/about_presenter";
import { ErrorPresenter } from "../shared/presenter/error_presenter";
import { Presenter } from "../shared/presenter/presenter";
import { articleListPath, aboutPath, profilePath, errorPath } from '../shared/path/path';
import { UserProfile } from "../shared/data/user_profile";

class Context {
    readonly body: Element;
    readonly view: View;
    readonly presenter: Presenter;
}

export class Page {
    private readonly renderBody: wireRender;
    private readonly view: View;
    presenter: Presenter;

    constructor(ctx: Context) {
        this.renderBody = bind(ctx.body);
        this.view = ctx.view;
        this.presenter = ctx.presenter;
    }

    articleList(p: Presenter, articleList: ArticleList): Presenter {
        const presenter = ArticleListPresenter.Next(p, articleList);
        return this.articleListP(presenter);
    }

    private articleListP(p: ArticleListPresenter): Presenter {
        this.view.renderArticleList(this.renderBody, p);
        document.title = p.title;
        return p;
    }

    profile(p: Presenter, userProfile: UserProfile): Presenter {
        const presenter = ProfilePresenter.Next(p, userProfile);
        this.profileP(presenter);
        return presenter;
    }

    profileP(p: ProfilePresenter): void {
        this.view.renderProfile(this.renderBody, p);
        document.title = p.title;
    }

    about(presenter: Presenter): Presenter {
        return this.aboutP(AboutPresenter.Init(presenter));
    }
    private aboutP(p: AboutPresenter): Presenter {
        this.view.renderAbout(this.renderBody, p);
        document.title = p.title;
        return p;
    }

    error(p: Presenter, code: number): Presenter {
        const presenter = ErrorPresenter.FromCode(code, p.currentUser, p.pageLoader);
        this.errorP(presenter);
        return presenter;
    }

    private errorP(p: ErrorPresenter): Presenter {
        this.view.renderError(this.renderBody, p);
        document.title = p.title;
        return p;
    }

    render(presenter: Presenter): boolean {
        const path = presenter.path;

        switch(path) {
            case articleListPath:
                this.articleListP(presenter as ArticleListPresenter);
                return true;
            case aboutPath:
                this.about(presenter as AboutPresenter);
                return true;
            case profilePath:
                this.profileP(presenter as ProfilePresenter);
                return true;
            case errorPath:
                this.errorP(presenter as ErrorPresenter);
                return true;
            default:
                return false;
        }
    }
}
