const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const html = fs.readFileSync('index.html', 'utf8');

const dom = new JSDOM(html, { 
  url: 'file:///Users/dbanda/DBanda/APLICACIONES/Guiones/index.html', 
  runScripts: 'dangerously',
  resources: "usable"
});
const window = dom.window;

window.addEventListener('load', () => {
    setTimeout(() => {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({ unit:'mm', format:'a4' });
            doc.setFont('helvetica','normal');
            doc.text("Hello World", 20, 20);
            const arrayBuffer = doc.output('arraybuffer');
            fs.writeFileSync('test.pdf', Buffer.from(arrayBuffer));
            console.log('PDF saved to test.pdf');
        } catch(e) {
            console.error(e);
        }
    }, 2000);
});
