export class path {
    static readonly profiles = "profiles";
    static profile(uid: string): string {
        return `${path.profiles}/${uid}`;
    }

    static readonly errors = "errors";
    static error(uid: string): string {
        return `${path.errors}/${uid}`;
    }

    static readonly articles = "articles";
    static article(uid: string): string {
        return `${path.articles}/${uid}`;
    }
}
