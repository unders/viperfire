import hyperHTML = require('hyperhtml');

export declare type wireRender = (template: TemplateStringsArray, ...args : any[]) => string;
export declare type bindRender = (template: TemplateStringsArray, ...args : any[]) => string;

export const wire = function(obj?: object, typeID?: string): (template: TemplateStringsArray, ...args : any[]) => string {
    return hyperHTML.wire(obj, typeID)
};

 export const bind = function(element: Element): (template: TemplateStringsArray, ...args : any[]) => string {
     return hyperHTML.bind(element)
 };

