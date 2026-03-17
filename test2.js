const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const html = fs.readFileSync('index.html', 'utf8');

// We intercept Sortable so it doesn't crash JSDOM
const dom = new JSDOM(html, { 
  url: 'file:///Users/dbanda/DBanda/APLICACIONES/Guiones/index.html', 
  runScripts: 'dangerously',
  beforeParse(window) {
    window.Sortable = class {
      constructor() {}
      destroy() {}
    };
  }
});
const window = dom.window;
const document = window.document;

const appJs = fs.readFileSync('app.js', 'utf8');
const scriptEl = document.createElement('script');
scriptEl.textContent = appJs;
document.body.appendChild(scriptEl);

window.addEventListener('load', () => {
    console.log("INITIAL FOLDER LIST HTML:", document.getElementById('folder-list').innerHTML);
    console.log("INITIAL SCRIPT LIST HTML:", document.getElementById('script-list').innerHTML);
    
    // Simulate currentScriptId null
    console.log("APP STATE BEFORE CLICK:", window.state.scripts.length, window.state.activeFolderId);

    // Click new script
    document.getElementById('btn-new-script').click();
    
    console.log("APP STATE AFTER CLICK:", window.state.scripts.length, window.state.activeFolderId);
    console.log("FOLDER LIST AFTER CLICK HTML:", document.getElementById('folder-list').innerHTML);
    console.log("SCRIPT LIST AFTER CLICK HTML:", document.getElementById('script-list').innerHTML);
});
