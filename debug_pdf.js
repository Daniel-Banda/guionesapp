const fs = require('fs');
const { JSDOM } = require('jsdom');

// Mock a script object like in app.js
const script = {
    title: "Guion de Prueba 🚀",
    blocks: [
        {
            type: 'hook',
            duration: 5,
            layers: {
                spoken: "¡Hola a todos! Este es un guion con emojis ✨ y caracteres especiales como ñ y á.",
                camera: "Plano medio 🎥"
            }
        }
    ]
};

// Mock BLOCK_TYPES and LAYERS
const BLOCK_TYPES = {
    hook: { label:'HOOK' },
    custom: { label:'LIBRE' }
};
const LAYERS = [
    { id:'spoken', label:'📝 Guion Hablado' },
    { id:'camera', label:'🎥 Tomas / Cámara' }
];

async function runTest() {
    const dom = new JSDOM('<!DOCTYPE html><html><head><script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script></head><body></body></html>', {
        runScripts: "dangerously",
        resources: "usable"
    });
    const { window } = dom;

    // Wait for script to load
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit:'mm', format:'a4' });
        const pw = doc.internal.pageSize.getWidth();
        let y = 20;

        const colorsMap = { hook:[168,85,247], custom:[99,102,241] };

        doc.setFont('helvetica','bold');
        doc.setFontSize(22);
        doc.text(script.title || 'Guion sin título', 20, y);
        y += 20;

        script.blocks.forEach(block => {
            const bt = BLOCK_TYPES[block.type]||BLOCK_TYPES.custom;
            const rgb = colorsMap[block.type]||colorsMap.custom;
            
            doc.text(`${bt.label} · ${block.duration||0}s`, 22, y);
            y += 10;

            LAYERS.forEach(layer => {
                const txt = block.layers?.[layer.id]||'';
                if (!txt.trim()) return;

                doc.setFont('helvetica','bolditalic');
                doc.text(layer.label.split(' ').slice(1).join(' ').trim() || layer.id, 22, y);
                y += 5;

                doc.setFont('helvetica','normal');
                const lines = doc.splitTextToSize(txt, pw-44);
                doc.text(lines, 22, y);
                y += lines.length * 5 + 3;
            });
        });

        const pdfData = doc.output('arraybuffer');
        fs.writeFileSync('output_debug.pdf', Buffer.from(pdfData));
        console.log("PDF generated successfully: output_debug.pdf");
    } catch (err) {
        console.error("PDF generation failed:", err);
    }
}

runTest();
