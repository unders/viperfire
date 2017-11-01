declare module 'hyperhtml' {
    function wire(obj?: object, typeID?: string): (template: TemplateStringsArray, ...args : any[]) => string;
    function bind(element: Element): (template: TemplateStringsArray, ...args : any[]) => void;
}
