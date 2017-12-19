import { wire } from "../../dom/dom";
import { Presenter } from "../presenter/base_presenter";
import { path } from "../path/url";

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

    render(p: Presenter): string {
        let links = [];
        if (p.currentUser.signedIn) {
            links[0]= { name: "My Profile", url:  path.profile(p.currentUser.uid) };
        }

        return this.html`
            <ul class="footer-list">
                ${this.links.map( (link, index) => wire(link)`
                    <li class="footer-list-item"><a href="${link.url}">${link.name}</a></li>`)}
                
                ${links.map( (link, index) => wire(link)`
                    <li class="footer-list-item"><a href="${link.url}">${link.name}</a></li>`)}
            </ul>`;
    }
}
