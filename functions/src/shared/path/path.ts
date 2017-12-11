export const profilePath = '/profile/:uid';
export const newProfilePath = function(uid: string): string  {
    return `/profile/${uid}`;
};

export const aboutPath = '/about';

export const articleListPath = '/';
interface NextArticleResult {
    hasMore: boolean;
    path: string;
}
const articleList = (pageToken: string): string => {
    return `${articleListPath}?page_token=${pageToken}`;
};
export const nextArticleListPath = (pageToken: string): NextArticleResult => {
    let result = { hasMore: false, path: "" };
    if (!pageToken) {
        return result;
    }
    if (pageToken === "") {
        return result;
    }

    return  { hasMore: true, path: articleList(pageToken) };
};

export const article = (id: string): string => { return `/article/${id}`; };
export const articlePath = '/article:id';

export const errorPath = '/error';
