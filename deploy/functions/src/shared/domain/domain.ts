export enum statusCode {
    OK = 200,
    InternalError = 500,
    NotFound = 404
}

interface Result {
    code: statusCode;
    err: string;
}

export const domainNotFound = (msg: string): Result => {
    return {
        code: statusCode.NotFound,
        err: `${msg} Not Found`
    };
};

export const domainInternalError = (msg: string, error: string): Result => {
    return {
        code: statusCode.InternalError,
        err: `${msg} Internal Error=${error}`
    };
};

