const { jsPDF } = require("jspdf");
const fs = require('fs');

function sanitizeForPDF(text) {
  if (!text) return '';
  return text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2026/g, '...')
    // Remove emojis and other characters outside the Latin-1 block
    .replace(/[^\x00-\xFF]/g, ''); 
}

function formatDuration(secs) {
  if (!secs) return '0s';
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs/60)}m ${secs%60}s`;
}

try {
  const doc = new jsPDF({ unit:'mm', format:'a4' });
  const pw = doc.internal.pageSize.getWidth();
  let y = 20;

  const script = {
    title: "Test 🌍",
    blocks: [
      {
        type: "hook",
        duration: 10,
        layers: {
          spoken: "Hola amigos 🚀",
          camera: "Face to face 😊",
          screentext: "Wow! 💥"
        }
      }
    ]
  };

  const colorsMap = { hook:[168,85,247], custom:[99,102,241] };
  const BLOCK_TYPES = { hook: { label: 'HOOK' } };
  const LAYERS = [
    { id: 'spoken', label: 'Spoken' },
    { id: 'camera', label: 'Camera' },
    { id: 'screentext', label: 'Screen' }
  ];

  doc.setFont('helvetica','bold');
  doc.setFontSize(22);
  doc.setTextColor(30,30,50);
  doc.text(sanitizeForPDF(script.title || 'Guion sin título'), 20, y);
  y += 8;

  const total = script.blocks.reduce((a,b)=>a+(parseInt(b.duration)||0),0);
  doc.text(sanitizeForPDF(`${script.blocks.length} bloques · ${formatDuration(total)} · 17/03/2026`), 20, y);
  y += 12;

  script.blocks.forEach(block => {
    const bt = BLOCK_TYPES[block.type]||{label:'CUSTOM'};
    const rgb = colorsMap[block.type]||[0,0,0];
    doc.setFillColor(...rgb);
    doc.roundedRect(18, y-4, pw-36, 8, 2, 2, 'F');
    doc.setFont('helvetica','bold');
    doc.setFontSize(9);
    doc.setTextColor(255,255,255);
    doc.text(sanitizeForPDF(`${bt.label} · ${block.duration||0}s`), 22, y+1);
    y += 10;

    LAYERS.forEach(layer => {
      const txt = block.layers?.[layer.id]||'';
      if (!txt.trim()) return;
      doc.setFont('helvetica','bolditalic');
      doc.setFontSize(8);
      doc.setTextColor(...rgb);
      doc.text(sanitizeForPDF(layer.label), 22, y);
      y += 5;
      doc.setFont('helvetica','normal');
      doc.setFontSize(10);
      doc.setTextColor(40,40,60);
      const lines = doc.splitTextToSize(sanitizeForPDF(txt), pw-44);
      doc.text(lines, 22, y);
      y += lines.length * 5 + 3;
    });
  });

  const arrayBuffer = doc.output('arraybuffer');
  fs.writeFileSync('test3.pdf', Buffer.from(arrayBuffer));
  console.log("PDF saved successfully, size:", arrayBuffer.byteLength);

} catch (e) {
  console.error("Error generating PDF:", e);
}
