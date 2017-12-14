import * as firebase from "firebase";
import { GetContext, Result } from '../shared/domain/profile_domain'
import { path } from "../shared/path/db"
import { domainInternalError, domainNotFound, statusCode } from "../shared/domain/domain";
import { Logger } from "../log/log";
import { UserProfile, userProfileBuilder } from "../shared/data/user_profile";

interface Context {
    firestore: firebase.firestore.Firestore;
    logger: Logger
}

export class ProfileDomain {
    private readonly db: firebase.firestore.Firestore;
    private readonly logger: Logger;
    private readonly cache: CacheProfile;
    private readonly subscriptions: Subscriptions;

    constructor(ctx: Context) {
        this.db = ctx.firestore;
        this.logger = ctx.logger;
        this.cache = new CacheProfile();
        this.subscriptions = new Subscriptions();
    }

    async get(ctx: GetContext): Promise<Result> {
        const userProfile = this.cache[ctx.uid];
        const profile = path.profile(ctx.uid);
        if (userProfile) {
            this.logger.info(`cache hit ${profile}`);
            return { code: statusCode.OK, userProfile: userProfile, err: null };
        }
        this.logger.info(`cache miss ${profile}`);
        try {
            const doc = await this.db.doc(profile).get();
            if (!doc.exists) {
                const { code, err } = domainNotFound(profile);
                const userProfile =  userProfileBuilder.empty(ctx.uid);
                return { code: code, userProfile: userProfile, err: err };
            }
            const userProfile = userProfileBuilder.fromDB(doc.data() as UserProfile);
            return { code: statusCode.OK, userProfile: userProfile, err: null };
        } catch (e) {
            const { code, err } = domainInternalError(profile, e.message);
            const userProfile = userProfileBuilder.empty(ctx.uid);
            return { code: code, userProfile: userProfile, err: err };
        }
    }

    subscribe(uid: string) {
        const profile = path.profile(uid);
        this.logger.info(`subscribe to ${profile}`);
        this.subscriptions[uid] = this.db.doc(profile).onSnapshot((doc) => {
            if (!doc.exists) {
                this.unsubscribe(uid);
                return;
            }
            this.logger.info(`add ${profile} to cache`);
            this.cache[uid] = userProfileBuilder.fromDB(doc.data() as UserProfile);
            const source = doc.metadata.hasPendingWrites ? "Client": "Server";
            this.logger.info( `${profile} updated on ${source}`);
        });
    }

    unsubscribe(uid: string) {
        if (uid === "") { return; }
        const profile = path.profile(uid);

        this.logger.info(`unsubscribe to ${profile}`);
        delete this.cache[uid];
        const unsubscribe = this.subscriptions[uid];
        if (unsubscribe) {
            this.logger.info("calling unsubscribe");
            unsubscribe();
            this.logger.info("called unsubscribe");
            delete this.subscriptions[uid];
        }
    }
}

// TODO WeakSet?
class CacheProfile {
    [key: string]: UserProfile;
}

// TODO WeakSet?
class Subscriptions {
    [key: string]: any;
}

