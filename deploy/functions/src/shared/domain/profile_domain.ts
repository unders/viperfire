import { ProfilePresenter } from "../presenter/profile_presenter";
import { User } from "../data/user";
import { statusCode } from "./domain";

export const profileCollection = "profiles";
export const profilePath = (uid: string): string => {
    return `${profileCollection}/${uid}`;
};

export interface Result {
    code: statusCode;
    presenter: ProfilePresenter;
    err: string|null;
}

export interface GetContext {
    readonly uid: string;
    readonly currentUser: User;
}


