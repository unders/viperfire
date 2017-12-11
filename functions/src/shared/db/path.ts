export class path {
    static profiles = "profiles";
    static profile(uid: string): string {
        return `${path.profiles}/${uid}`;
    }

    static errors = "errors";
    static errorDoc(uid: string): string {
        return `${path.errors}/${uid}`;
    }

    static articles = "articles";
    static articleDoc(uid: string): string {
        return `${path.articles}/${uid}`;
    }
}
