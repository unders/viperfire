import { statusCode } from "./domain";
import { UserProfile } from "../data/user_profile";

export interface Result {
    code: statusCode;
    userProfile: UserProfile;
    err: string|null;
}

export interface GetContext {
    readonly uid: string;
}


