import { wire } from "../../dom/dom";

export interface FooterContext {
    links: link[]
}

interface link {
    name: string
    url: string
}

export class Footer {
    private readonly links: link[];
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;

    constructor(ctx: FooterContext) {
        this.html = wire(this);
        this.links = ctx.links;
    }

    render(ctx: FooterContext): string {
        return this.html`
            <ul class="footer-list">
                ${this.links.map( (link, index) => wire(link)`
                    <li class="footer-list-item"><a href="${link.url}">${link.name}</a></li>`)}
                
                ${ctx.links.map( (link, index) => wire(link)`
                    <li class="footer-list-item"><a href="${link.url}">${link.name}</a></li>`)}
            </ul>`;
    }
}
