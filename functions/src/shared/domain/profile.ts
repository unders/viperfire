import { ProfilePresenter } from "../presenter/profile";
import { User } from "../data/user";
import { statusCode } from "./domain";

export const profileCollection = "profiles";

export interface Result {
    code: statusCode;
    presenter: ProfilePresenter;
    err: string|null;
}

export interface GetContext {
    readonly uid: string;
    readonly currentUser: User;
}

export const profilePath = (uid: string): string => {
    return `${profileCollection}/${uid}`;
};

