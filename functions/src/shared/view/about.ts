import { wire } from "../../dom/dom";

export interface AboutContext {
    hyperLink: link
    viperLink: link
    links: link[]
}

interface link {
    name: string
    url: string
}

export class About {
    private readonly hyperLink: link;
    private readonly viperLink: link;
    private readonly links: link[];
    private readonly about: object = {};

    constructor(ctx: AboutContext) {
        this.hyperLink = ctx.hyperLink;
        this.viperLink = ctx.viperLink;
        this.links = ctx.links;
    }

    render(): string {
        return wire(this.about)`
            <h1>About Viperfire</h1>
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
