import * as firebase from "firebase";
import { GetContext, Result, docPath, collectionName } from '../shared/domain/profile'
import { ProfilePresenter } from "../shared/presenter/profile";
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
        if (u) {
            this.logger.info(`cache hit ${docPath(ctx.uid)}`);
            const p = new ProfilePresenter({ currentUser: ctx.currentUser, profileUser: u });
            return { code: 200, presenter: p, err: null };
        }
        this.logger.info(`cache miss ${docPath(ctx.uid)}`);
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

    subscribe(uid: string) {
        this.logger.info(`start subscription on ${docPath(uid)}`);
        this.subscriptions[uid] = this.db.doc(docPath(uid)).onSnapshot((doc) => {
            if (!doc.exists) {
                this.logger.info(`${collectionName}/${uid}`);
                delete this.cache[uid];
                return;
            }
            const u = doc.data() as User;
            this.cache[uid] = u;
            const source = doc.metadata.hasPendingWrites ? "Local": "Server";
            this.logger.info( `Doc: ${docPath(uid)} updated on ${source}`);
            this.logger.info(u);
            this.logger.info(this.cache);
        });
    }

    unsubscribe(uid: string) {
        if (uid === "") { return; }

        this.logger.info(`stop subscription on ${docPath(uid)}`);
        delete this.cache[uid];
        const unsubscribe = this.subscriptions[uid];
        if (unsubscribe) {
            this.logger.info("call unsubscribe");
            unsubscribe();
            this.logger.info("called unsubscribe");
        }
    }
}

class CacheProfile {
    [key: string]: User;
}

class Subscriptions {
    [key: string]: any;
}

