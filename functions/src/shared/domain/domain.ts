import * as firebase from "firebase";
import { ProfileResource } from "./profile";

interface Context {
    firestore: firebase.firestore.Firestore;
}

export class Domain {
    private readonly firestore: firebase.firestore.Firestore;

    constructor(ctx: Context) {
        this.firestore = ctx.firestore;
    }

    profile(): ProfileResource {
        return new ProfileResource({ firestore: this.firestore });
    }
}
