import { wire } from "../../dom/dom";

export interface FooterContext {
    links: link[]
}

interface link {
    name: string
    url: string
}

export class FooterView {
    private readonly links: link[];
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;

    constructor(ctx: FooterContext) {
        this.html = wire(this);
        this.links = ctx.links;
    }

    render(p: FooterContext): string {
        return this.html`
            <ul class="footer-list">
                ${this.links.map( (link, index) => wire(link)`
                    <li class="footer-list-item"><a href="${link.url}">${link.name}</a></li>`)}
                
                ${p.links.map( (link, index) => wire(link)`
                    <li class="footer-list-item"><a href="${link.url}">${link.name}</a></li>`)}
            </ul>`;
    }
}
