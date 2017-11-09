import * as firebase from "firebase";
import { Profile } from "../data/profile";

const collectionName = "profiles";

interface Context {
    firestore: firebase.firestore.Firestore;
}

interface Result {
    code: number;
    profile: Profile;
    err: string|null;
}

export class ProfileResource {
    private readonly db: firebase.firestore.Firestore;

    constructor(ctx: Context) {
        this.db = ctx.firestore;
    }

    async get(uid: string): Promise<Result> {
        try {
            const doc = await this.db.doc(docPath(uid)).get();
            if (!doc.exists) {
                return { code: 404, profile: Profile.Empty(), err: "404 Not Found" };
            }
            const p = doc.data() as Profile;
            return { code: 200, profile: p, err: null };
        } catch (e) {
            return { code: 500, profile: Profile.Empty(), err: `500 Internal Error=${e.message}` };
        }
    }
}

const docPath = (uid: string): string => {
    return `${collectionName}/${uid}`;
};

