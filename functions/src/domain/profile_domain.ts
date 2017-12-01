import * as admin from "firebase-admin";
import { GetContext, Result, profilePath } from '../shared/domain/profile'
import { ProfilePresenter } from "../shared/presenter/profile_presenter";
import { UserProfile, userProfileBuilder } from "../shared/data/user_profile";
import { domainInternalError, domainNotFound, statusCode } from "../shared/domain/domain";

interface Context {
    firestore: admin.firestore.Firestore;
}

interface ProfileSet {
    profileError: string|null;
}

export class ProfileDomain {
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
                const p = ProfilePresenter.Empty(ctx.uid, ctx.currentUser);
                return { code: code, presenter: p, err: err };
            }
            const up = userProfileBuilder.fromDB(doc.data() as UserProfile);
            const p = new ProfilePresenter({ currentUser: ctx.currentUser, userProfile: up });
            return { code: statusCode.OK, presenter: p, err: null };
        } catch (e) {
            const { code, err } = domainInternalError(profile, e.message);
            const p = ProfilePresenter.Empty(ctx.uid, ctx.currentUser);
            return { code: code, presenter: p, err: err };
        }
    }

    async set(data: UserProfile): Promise<ProfileSet> {
        try {
            await this.db.doc(profilePath(data.uid)).set(data);
            return { profileError: null };
        } catch (e) {
            return { profileError: e.message };
        }
    }
}
