import * as admin from "firebase-admin";
import { GetContext, Result, profilePath } from '../shared/domain/profile'
import { ProfilePresenter } from "../shared/presenter/profile";
import { User } from "../shared/data/user";

export interface Context {
    firestore: admin.firestore.Firestore;
}

interface ProfileSet {
    err: string|null;
}

export class Profile {
    private readonly db: admin.firestore.Firestore;

    constructor(ctx: Context) {
        this.db = ctx.firestore;
    }

    async get(ctx: GetContext): Promise<Result> {
        try {
            const doc = await this.db.doc(profilePath(ctx.uid)).get();
            if (!doc.exists) {
                const p = ProfilePresenter.Empty(ctx.currentUser);
                return { code: 404, presenter: p, err: `Profile: ${ctx.uid} Not Found` };
            }
            const u = doc.data() as User;
            const p = new ProfilePresenter({ currentUser: ctx.currentUser, profileUser: u });
            return { code: 200, presenter: p, err: null };
        } catch (e) {
            const p = ProfilePresenter.Empty(ctx.currentUser);
            return { code: 500, presenter: p, err: `Profile: ${ctx.uid} Internal Error=${e.message}` };
        }
    }

    async set(user: User): Promise<ProfileSet> {
        try {
            await this.db.doc(profilePath(user.uid)).set(user);
            return { err: null };
        } catch (e) {
            return { err: e.message };
        }
    }
}
