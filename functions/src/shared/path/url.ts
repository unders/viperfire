interface NextArticlesResult {
    hasMore: boolean;
    nextArticlesPath: string;
}

const profile = "/profile";
const article = "/article";
export class path {
    static readonly profileReqExp = `${profile}/:id`;
    static readonly about =  '/about';
    static readonly articles = "/";
    static readonly articleRegExp = `${article}/:id`;
    static readonly error = '/error';

    static profile(id: string): string {
        return `${profile}/${id}`;
    }

    static nextArticles(pageToken: string): NextArticlesResult {
        let result = { hasMore: false, nextArticlesPath: "#" };
        if (!pageToken || pageToken === "") {
            return result;
        }

        return  { hasMore: true, nextArticlesPath: articles(pageToken) };
    };

    static article(id: string): string {
        return `${article}/${id}`;
    }
}

const articles = (pageToken: string): string => {
     return `${path.articles}?page_token=${pageToken}`;
};

