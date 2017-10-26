declare module 'hyperhtml' {
    function wire(obj?: object, typeID?: string): (template: TemplateStringsArray, ...args : any[]) => void;
    function bind(element: Element): (template: TemplateStringsArray, ...args : any[]) => void;
}
