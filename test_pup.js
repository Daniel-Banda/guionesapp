const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const downloadPath = path.resolve(__dirname, 'downloads');
  fs.mkdirSync(downloadPath, { recursive: true });

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const client = await page.createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadPath,
  });

  await page.goto('http://localhost:8080');

  // Insert test text
  await page.evaluate(() => {
    state.scripts = [{
      id: "test",
      title: "Test 🌍 Español áéíóú",
      blocks: [
        {
          id: "b1",
          type: "hook",
          duration: 10,
          layers: { spoken: "Test con ñ 🌍" }
        }
      ]
    }];
    state.currentScriptId = "test";
    renderEditor();
    renderScriptList();
  });

  // Export PDF
  await page.evaluate(() => {
    exportPDF();
  });

  console.log('Export triggered, waiting for download...');
  await new Promise(r => setTimeout(r, 2000));

  const files = fs.readdirSync(downloadPath);
  console.log('Downloaded files:', files);
  
  for (const f of files) {
    if (f.endsWith('.pdf')) {
      const p = path.join(downloadPath, f);
      const stat = fs.statSync(p);
      console.log(`File: ${f}, Size: ${stat.size} bytes`);
    }
  }

  await browser.close();
})();
