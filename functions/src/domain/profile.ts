import * as admin from "firebase-admin";
import { GetContext, Result, profilePath } from '../shared/domain/profile'
import { ProfilePresenter } from "../shared/presenter/profile";
// TODO: should be the user_profile instead of user.
import { UserContext, User } from "../shared/data/user";
import { domainInternalError, domainNotFound, statusCode } from "../shared/domain/domain";

export interface Context {
    firestore: admin.firestore.Firestore;
}

interface ProfileSet {
    profileError: string|null;
}

export class Profile {
    private readonly db: admin.firestore.Firestore;

    constructor(ctx: Context) {
        this.db = ctx.firestore;
    }

    async get(ctx: GetContext): Promise<Result> {
        const profile = profilePath(ctx.uid);
        try {
            const doc = await this.db.doc(profile).get();
            if (!doc.exists) {
                const { code, err } = domainNotFound(profile);
                const p = ProfilePresenter.Empty(ctx.currentUser);
                return { code: code, presenter: p, err: err };
            }
            const u = doc.data() as User;
            const p = new ProfilePresenter({ currentUser: ctx.currentUser, profileUser: u });
            return { code: statusCode.OK, presenter: p, err: null };
        } catch (e) {
            const { code, err } = domainInternalError(profile, e.message);
            const p = ProfilePresenter.Empty(ctx.currentUser);
            return { code: code, presenter: p, err: err };
        }
    }

    async set(user: UserContext): Promise<ProfileSet> {
        try {
            await this.db.doc(profilePath(user.uid)).set(user);
            return { profileError: null };
        } catch (e) {
            return { profileError: e.message };
        }
    }
}
