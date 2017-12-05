import viperHTML = require('viperhtml');

export declare type wireRender = (template: TemplateStringsArray, ...args : any[]) => string;

export const wire = function(obj?: object, typeID?: string): (template: TemplateStringsArray, ...args : any[]) => string {
    return viperHTML.wire(obj, typeID)
};


