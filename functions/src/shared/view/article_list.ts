import { wire } from "../../dom/dom";

export interface ArticleListContext {
    message: string
}

export class ArticleList {
    render(ctx: ArticleListContext): string {
        return wire(ctx)`
            <p>${ctx.message}</p>
        `;
    }
}


