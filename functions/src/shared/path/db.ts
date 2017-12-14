export class path {
    static readonly profiles = "profiles";
    static profile(id: string): string {
        return `${path.profiles}/${id}`;
    }

    static readonly errors = "errors";
    static error(id: string): string {
        return `${path.errors}/${id}`;
    }

    static readonly articles = "articles";
    static article(id: string): string {
        return `${path.articles}/${id}`;
    }
}
