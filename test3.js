const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const html = fs.readFileSync('index.html', 'utf8');

const dom = new JSDOM(html, { 
  url: 'file:///Users/dbanda/DBanda/APLICACIONES/Guiones/index.html', 
  runScripts: 'dangerously',
  beforeParse(window) {
    window.Sortable = class {
      constructor() {}
      destroy() {}
    };
    window.console.error = function(...args) {
      console.log('JSDOM ERROR:', ...args);
    };
  }
});
const window = dom.window;
const document = window.document;

window.addEventListener('error', e => {
  console.log("UNCAUGHT ERROR IN JSDOM:", e.error);
});

const appJs = fs.readFileSync('app.js', 'utf8');
const scriptEl = document.createElement('script');
scriptEl.textContent = appJs;
document.body.appendChild(scriptEl);

window.addEventListener('load', () => {
    console.log("INITIAL FOLDER LIST HTML:", document.getElementById('folder-list').innerHTML);
    document.getElementById('btn-new-script').click();
    console.log("AFTER CLICK SCRIPT LIST:", document.getElementById('script-list').innerHTML);
});
