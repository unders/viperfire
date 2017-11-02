import { wire } from "../../dom/dom";

export interface ArticleListContext {
    message: string
}

export class ArticleList {
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;

    constructor() {
        this.html = wire(this);
    }

    render(ctx: ArticleListContext): string {
        return this.html`
            <p>${ctx.message}</p>
        `;
    }
}


