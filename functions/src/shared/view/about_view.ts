import { wire } from "../../dom/dom";
import { onClick } from "../actions";

export interface AboutContext {
    hyperLink: link
    viperLink: link
    links: link[]
}

interface link {
    name: string
    url: string
}

export class AboutView {
    private readonly hyperLink: link;
    private readonly viperLink: link;
    private readonly links: link[];
    private readonly html: (template: TemplateStringsArray, ...args : any[]) => string;

    constructor(ctx: AboutContext) {
        this.hyperLink = ctx.hyperLink;
        this.viperLink = ctx.viperLink;
        this.links = ctx.links;
        this.html = wire(this);
    }

    render(): string {
        return this.html`
            <h1>About Viperfire</h1>
            <button data-action="${onClick.openSnackbar}">Open snackbar</button>
            <button data-action="${onClick.openPopup}">Open Popup</button>
            <p>A starter application hosted on Firebase and using 
                <a href="${this.hyperLink.url}">${this.hyperLink.name}</a> 
                on the client and <a href="${this.viperLink.url}">${this.viperLink.name}</a> on the server
            </p>
            <p>Technologies used:</p>
            <ul>
                ${this.links.map( (link, index) => wire(link)`
                    <li><a href="${link.url}">${link.name}</a></li>`)
                }
            </ul>`;
    }
}
