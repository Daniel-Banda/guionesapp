const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { url: 'file:///Users/dbanda/DBanda/APLICACIONES/Guiones/index.html', runScripts: 'dangerously' });
const window = dom.window;
const document = window.document;
// Load JS
const appJs = fs.readFileSync('app.js', 'utf8');
const scriptEl = document.createElement('script');
scriptEl.textContent = appJs;
document.body.appendChild(scriptEl);

window.addEventListener('load', () => {
    // Check initial list
    let list = document.getElementById('script-list').innerHTML;
    console.log("Initial script list:", list.includes('Inmobiliario') ? 'Has Inmobiliario' : 'Empty');

    // Click new script
    document.getElementById('btn-new-script').click();
    list = document.getElementById('script-list').innerHTML;
    console.log("After New Script, List HTML:", list.includes('Nuevo') ? 'Has Nuevo Guion' : list);
    console.log("Number of scripts in list:", document.querySelectorAll('.script-item').length);
});
