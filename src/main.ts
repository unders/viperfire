import {bind, wire} from './dom/dom'

const main = () => {
    const app = document.getElementById("app");
    if (app) {
        bind(app)`<div>It works</div>${wire()`<p>Hello world</p>`}`
    }
};

main();
