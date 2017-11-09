import { ProfilePresenter } from "../presenter/profile";
import { User } from "../data/user";

export const collectionName = "profiles";

export interface Result {
    code: number;
    presenter: ProfilePresenter;
    err: string|null;
}

export interface GetContext {
    readonly uid: string;
    readonly currentUser: User;
}

export const docPath = (uid: string): string => {
    return `${collectionName}/${uid}`;
};

