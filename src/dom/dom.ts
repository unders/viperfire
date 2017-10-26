import hyperHTML = require('hyperhtml');

export const wire = function(obj?: object, typeID?: string): (template: TemplateStringsArray, ...args : any[]) => void {
    return hyperHTML.wire(obj, typeID)
};

 export const bind = function(element: Element): (template: TemplateStringsArray, ...args : any[]) => void {
     return hyperHTML.bind(element)
 };

