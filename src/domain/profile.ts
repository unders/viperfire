import * as firebase from "firebase";
import { GetContext, Result, docPath } from '../shared/domain/profile'
import { ProfilePresenter } from "../shared/presenter/profile";
import { User } from "../shared/data/user";

export interface Context {
    firestore: firebase.firestore.Firestore;
}

export class Profile {
    private readonly db: firebase.firestore.Firestore;

    constructor(ctx: Context) {
        this.db = ctx.firestore;
    }

    async get(ctx: GetContext): Promise<Result> {
        try {
            const doc = await this.db.doc(docPath(ctx.uid)).get();
            if (!doc.exists) {
                const p = ProfilePresenter.Empty(ctx.currentUser);
                return { code: 404, presenter: p, err: "404 Not Found" };
            }
            const u = doc.data() as User;
            const p = new ProfilePresenter({ currentUser: ctx.currentUser, profileUser: u });
            return { code: 200, presenter: p, err: null };
        } catch (e) {
            const p = ProfilePresenter.Empty(ctx.currentUser);
            return { code: 500, presenter: p, err: `500 Internal Error=${e.message}` };
        }
    }
}
