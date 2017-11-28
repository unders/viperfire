import * as firebase from "firebase";
import { GetContext, Result, profilePath } from '../shared/domain/profile'
import { ProfilePresenter } from "../shared/presenter/profile";
import { domainInternalError, domainNotFound, statusCode } from "../shared/domain/domain";
import { User } from "../shared/data/user";
import { Logger } from "../log/log";

export interface Context {
    firestore: firebase.firestore.Firestore;
    logger: Logger
}

export class Profile {
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
        const u = this.cache[ctx.uid];
        const profile = profilePath(ctx.uid);
        if (u) {
            this.logger.info(`cache hit ${profile}`);
            const p = new ProfilePresenter({ currentUser: ctx.currentUser, profileUser: u });
            return { code: statusCode.OK, presenter: p, err: null };
        }
        this.logger.info(`cache miss ${profile}`);
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

    subscribe(uid: string) {
        const profile = profilePath(uid);
        this.logger.info(`start subscription on ${profile}`);
        this.subscriptions[uid] = this.db.doc(profile).onSnapshot((doc) => {
            if (!doc.exists) {
                this.unsubscribe(uid);
                return;
            }
            this.logger.info(`add ${profile} to cache`);
            const u = doc.data() as User;
            this.cache[uid] = u;
            const source = doc.metadata.hasPendingWrites ? "Client": "Server";
            this.logger.info( `${profile} updated on ${source}`);
            this.logger.info(u);
        });
    }

    unsubscribe(uid: string) {
        if (uid === "") { return; }
        const profile = profilePath(uid);

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

class CacheProfile {
    [key: string]: User;
}

class Subscriptions {
    [key: string]: any;
}

