import * as admin from "firebase-admin";
import { GetContext, Result, } from '../shared/domain/profile_domain'
import { path } from '../shared/db/path'
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
        const profile = path.profile(ctx.uid);
        try {
            const doc = await this.db.doc(profile).get();
            if (!doc.exists) {
                const { code, err } = domainNotFound(profile);
                const up = userProfileBuilder.empty(ctx.uid);
                return { code: code, userProfile: up, err: err };
            }
            const up = userProfileBuilder.fromDB(doc.data() as UserProfile);
            return { code: statusCode.OK, userProfile: up, err: null };
        } catch (e) {
            const { code, err } = domainInternalError(profile, e.message);
            const up = userProfileBuilder.empty(ctx.uid);
            return { code: code, userProfile: up, err: err };
        }
    }

    async set(data: UserProfile): Promise<ProfileSet> {
        try {
            await this.db.doc(path.profile(data.uid)).set(data);
            return { profileError: null };
        } catch (e) {
            return { profileError: e.message };
        }
    }
}
