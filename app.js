/* =========================================================
   GUIONES — app.js
   Full script editor logic
   ========================================================= */
'use strict';

// ============================================================
// CONSTANTS & DATA
// ============================================================
const BLOCK_TYPES = {
  hook:        { label:'HOOK',        emoji:'🟣', color:'var(--hook)',        bg:'var(--hook-bg)',        defaultDuration: 3  },
  context:     { label:'CONTEXTO',    emoji:'🔵', color:'var(--context)',     bg:'var(--context-bg)',     defaultDuration: 10 },
  development: { label:'DESARROLLO',  emoji:'🟢', color:'var(--development)', bg:'var(--development-bg)', defaultDuration: 30 },
  climax:      { label:'CLÍMAX',      emoji:'🔴', color:'var(--climax)',      bg:'var(--climax-bg)',      defaultDuration: 20 },
  cta:         { label:'CTA',         emoji:'🟡', color:'var(--cta)',         bg:'var(--cta-bg)',         defaultDuration: 10 },
  custom:      { label:'LIBRE',       emoji:'⚪', color:'var(--accent)',      bg:'rgba(99,102,241,.1)',   defaultDuration: 15 },
};

const LAYERS = [
  { id:'spoken',     label:'Diálogo:', placeholder:'Escribe lo que dirás en cámara...' },
  { id:'camera',     label:':: Toma:', placeholder:'Ej: Plano medio, walking shot, close-up...' },
  { id:'audio',      label:':: Música:', placeholder:'Ej: Música intensa de fondo, sin música, voz en off...' },
  { id:'screentext', label:':: Texto:', placeholder:'Ej: Subtítulo, título animado, lower third...' },
  { id:'notes',      label:':: Notas:', placeholder:'Ideas, referencias, observaciones...' },
];

const HOOKS_DB = [
  { text:'Nadie te dice esto sobre [tema]…', cat:'curiosity' },
  { text:'Lo que los expertos no quieren que sepas sobre [tema]', cat:'curiosity' },
  { text:'El error #1 que comete la gente al [acción]', cat:'curiosity' },
  { text:'¿Por qué todos hacen [X] mal? (y cómo hacerlo bien)', cat:'curiosity' },
  { text:'Esto te puede ahorrar miles en [tema]', cat:'curiosity' },
  { text:'Llevo [tiempo] haciendo esto y nadie me lo creyó…', cat:'storytelling' },
  { text:'Así perdí todo en [tema] (y lo que aprendí)', cat:'storytelling' },
  { text:'Hace un año no tenía nada. Hoy [logro]. Aquí el proceso:', cat:'storytelling' },
  { text:'El día que decidí cambiar todo fue cuando…', cat:'storytelling' },
  { text:'Te cuento la historia real detrás de [tema]', cat:'storytelling' },
  { text:'La verdad incómoda sobre [tema] que nadie quiere escuchar', cat:'controversy' },
  { text:'Todos están equivocados sobre [tema]', cat:'controversy' },
  { text:'¿[Afirmación polémica]? Sí, y te explico por qué.', cat:'controversy' },
  { text:'Para de hacer [cosa común]. Aquí está el por qué.', cat:'controversy' },
  { text:'Después de 10 años en [industria], esto es lo que sé:', cat:'authority' },
  { text:'Analicé [N] casos de [tema] y esto fue lo que encontré:', cat:'authority' },
  { text:'Soy [profesión] y esto es lo que realmente pasa con [tema]', cat:'authority' },
  { text:'¿Tienes [tiempo]? Esto puede cambiar tu perspectiva sobre [tema]', cat:'fear' },
  { text:'Si no haces esto ahora, lo lamentarás en [tiempo]', cat:'fear' },
  { text:'El momento de actuar es este. Mañana puede ser tarde.', cat:'fear' },
];

const TEMPLATES_DB = [
  {
    id:'inmobiliario-viral',
    icon:'🏡',
    title:'Inmobiliario Viral',
    desc:'Formato directo para mostrar propiedades con alto potencial de engagement.',
    blocks:[
      { type:'hook',        spoken:'¿Todavía buscando terreno en [ciudad]? Mira esto antes de decidir.',                  duration:5 },
      { type:'context',     spoken:'Esta es la situación actual del mercado en [zona]. Los precios subieron un X%…',      duration:12 },
      { type:'development', spoken:'Aquí te muestro las características clave: [lista de atributos]. Lo que no ves en fotos es…', duration:35 },
      { type:'climax',      spoken:'Y la parte que más me impresionó fue esto: [elemento sorpresa / valor único].',        duration:15 },
      { type:'cta',         spoken:'Si te interesa, el link está en mi perfil. DM para detalles. No te lo dejes ir.',     duration:8 },
    ]
  },
  {
    id:'tour-emocional',
    icon:'🎬',
    title:'Tour Emocional',
    desc:'Recorrido narrativo que conecta emocionalmente antes de vender.',
    blocks:[
      { type:'hook',        spoken:'Imagínate despertar y ver esto cada mañana.',                                          duration:4 },
      { type:'context',     spoken:'Este es [nombre de la propiedad] en [ubicación]. Y tiene una historia especial…',     duration:10 },
      { type:'development', spoken:'[Recorrido por amenidades, ambiente, vecindario]. Lo que más me sorprendió fue…',     duration:40 },
      { type:'climax',      spoken:'Pero el momento WOW fue cuando entré a [espacio]. Mira esto.',                        duration:12 },
      { type:'cta',         spoken:'¿Te imaginas vivir aquí? Escríbeme y hacemos un tour privado.',                       duration:8 },
    ]
  },
  {
    id:'story-venta',
    icon:'📖',
    title:'Story de Venta',
    desc:'Historia personal que humaniza y convierte sin vender directamente.',
    blocks:[
      { type:'hook',        spoken:'Hace [tiempo], un cliente me llamó desesperado porque…',                              duration:5 },
      { type:'context',     spoken:'La situación era esta: [contexto del problema]. Muchos pasan por esto.',              duration:12 },
      { type:'development', spoken:'Lo que hicimos fue [proceso / solución]. Paso a paso fue así…',                      duration:35 },
      { type:'climax',      spoken:'Y el resultado final fue [resultado poderoso]. Él no lo podía creer.',               duration:15 },
      { type:'cta',         spoken:'Si estás en una situación similar, puedo ayudarte. Escríbeme.',                      duration:7 },
    ]
  },
  {
    id:'comparativa',
    icon:'⚖️',
    title:'Terreno vs Casa',
    desc:'Comparativa educativa que posiciona como experto y genera debate.',
    blocks:[
      { type:'hook',        spoken:'¿Qué conviene más: comprar terreno o casa? La respuesta te va a sorprender.',        duration:5 },
      { type:'context',     spoken:'Mucha gente toma esta decisión sin información. Aquí va el análisis real.',          duration:10 },
      { type:'development', spoken:'Terreno: ventajas [X], desventajas [Y]. Casa: ventajas [A], desventajas [B].',       duration:40 },
      { type:'climax',      spoken:'Mi recomendación personal, basada en [experiencia], es esta:',                       duration:15 },
      { type:'cta',         spoken:'¿Cuál elegirías tú? Comenta abajo y te respondo.',                                   duration:6 },
    ]
  },
  {
    id:'tutorial-rapido',
    icon:'⚡',
    title:'Tutorial Rápido (60s)',
    desc:'Formato educativo directo, ideal para Reels cortos y alto valor.',
    blocks:[
      { type:'hook',        spoken:'En 60 segundos te explico [tema] mejor que en una hora de búsqueda.',               duration:4 },
      { type:'development', spoken:'Paso 1: [acción]. Paso 2: [acción]. Paso 3: [acción]. Así de simple.',              duration:35 },
      { type:'climax',      spoken:'El truco que cambia todo es este: [insight clave].',                                 duration:12 },
      { type:'cta',         spoken:'Guarda esto. Lo vas a necesitar. Sígueme para más.',                                 duration:6 },
    ]
  },
  {
    id:'detras-camaras',
    icon:'🎥',
    title:'Detrás de Cámaras',
    desc:'Muestra el proceso real y genera confianza y autenticidad.',
    blocks:[
      { type:'hook',        spoken:'Así es un día real de trabajo en [profesión]. Sin filtros.',                         duration:4 },
      { type:'context',     spoken:'Hoy teníamos [situación / reto]. Aquí lo que pasó…',                                duration:8 },
      { type:'development', spoken:'[Documentar proceso: preparación, ejecución, retos, soluciones]',                   duration:40 },
      { type:'climax',      spoken:'Y el resultado final del día fue este. [resultado o aprendizaje].',                  duration:10 },
      { type:'cta',         spoken:'¿Quieres ver más de esto? Activa notificaciones.',                                   duration:5 },
    ]
  },
];

// ============================================================
// STATE
// ============================================================
let state = {
  scripts: [],
  folders: [], // { id, name, icon }
  currentScriptId: null,
  activeFolderId: null, // null = All
  activeLayers: { spoken:true, camera:true, audio:true, screentext:true, notes:true },
  customHooks: [],
};

function loadState() {
  try {
    const s = localStorage.getItem('guiones_state');
    if (s) {
      Object.assign(state, JSON.parse(s));
      pushHistory(true); // Push initial state to history silently
    }
  } catch(_) {}
}
function saveState(skipHistory = false) {
  try {
    if (!skipHistory) pushHistory();
    localStorage.setItem('guiones_state', JSON.stringify(state));
    showStatus('Guardado');
  } catch(_) {}
}

let saveTimeout;
let isTyping = false;
function debouncedSave() {
  showStatus('Guardando…');
  if (!isTyping) {
    pushHistory(); // Record state before typing batch begins
    isTyping = true;
  }
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveState(true);
    isTyping = false;
  }, 700);
}

// ============================================================
// HISTORY / UNDO
// ============================================================
let stateHistory = []; // stores stringified states

function pushHistory(silent = false) {
  const serialized = JSON.stringify(state);
  // Don't push if it's identical to the last one
  if (stateHistory.length > 0 && stateHistory[stateHistory.length - 1] === serialized) return;
  stateHistory.push(serialized);
  if (stateHistory.length > 15) stateHistory.shift(); // Keep last 15 states
}

function undoLastCommand() {
  if (stateHistory.length <= 1) { // 1 is the initial/current state
    toast('Nada más para deshacer', 'info');
    return;
  }
  // Pop current state
  stateHistory.pop();
  // Get previous state
  const prevStr = stateHistory[stateHistory.length - 1];
  Object.assign(state, JSON.parse(prevStr));
  
  // Save without pushing to history again
  localStorage.setItem('guiones_state', prevStr);
  showStatus('Guardado');

  renderFolderList();
  renderScriptList();
  renderEditor();
  toast('Deshacer (Ctrl+Z)', 'success', 1500);
}

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }

function getScript(id) { return state.scripts.find(s => s.id === id); }
function getCurrentScript() { return getScript(state.currentScriptId); }

// ============================================================
// DOM REFS
// ============================================================
const $ = id => document.getElementById(id);
const $sidebar       = $('sidebar');
const $folderList    = $('folder-list');
const $scriptList    = $('script-list');
const $blocksContainer = $('blocks-container');
const $emptyState    = $('empty-state');
const $addBlockBar   = $('add-block-bar');
const $scriptTitle   = $('script-title');
const $scriptStatus  = $('script-status');
const $layerToggles  = $('layer-toggles');
const $toastContainer = $('toast-container');

// ============================================================
// TOAST
// ============================================================
function toast(msg, type='info', duration=2800) {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  $toastContainer.appendChild(el);
  setTimeout(() => el.remove(), duration);
}
function showStatus(txt) {
  $scriptStatus.textContent = txt;
}

// ============================================================
// FOLDERS LIST
// ============================================================
function renderFolderList() {
  $folderList.innerHTML = '';

  // "Todas" folder
  const elAll = document.createElement('div');
  elAll.className = `folder-item${state.activeFolderId === null ? ' active' : ''}`;
  elAll.innerHTML = `<span class="folder-icon">📁</span><span class="folder-name">Todos los guiones</span>`;
  elAll.addEventListener('click', () => { state.activeFolderId = null; renderScriptList(); renderFolderList(); });
  $folderList.appendChild(elAll);

  state.folders.forEach(f => {
    const el = document.createElement('div');
    el.className = `folder-item${state.activeFolderId === f.id ? ' active' : ''}`;
    el.dataset.id = f.id;
    el.innerHTML = `
      <span class="folder-icon">${f.icon||'📁'}</span>
      <span class="folder-name" title="${f.name}">${f.name}</span>
      <button class="folder-item-delete script-item-delete" style="opacity:0; position:absolute; right:8px; z-index:10; pointer-events:auto;" title="Eliminar">🗑</button>
    `;

    // Drop logic
    el.addEventListener('dragover', e => { e.preventDefault(); el.classList.add('drag-over'); });
    el.addEventListener('dragleave', () => el.classList.remove('drag-over'));
    el.addEventListener('drop', e => {
      e.preventDefault();
      el.classList.remove('drag-over');
      const scriptId = e.dataTransfer.getData('text/plain');
      if (scriptId) moveScriptToFolder(scriptId, f.id);
    });

    el.addEventListener('click', e => {
      // Ignore click if it came from the delete button
      if (e.target.closest('.folder-item-delete')) return;
      state.activeFolderId = f.id;
      renderScriptList();
      renderFolderList();
    });
    
    el.addEventListener('mouseenter', () => { el.querySelector('.folder-item-delete').style.opacity = 1; });
    el.addEventListener('mouseleave', () => { el.querySelector('.folder-item-delete').style.opacity = 0; });
    el.querySelector('.folder-item-delete').addEventListener('click', e => {
      e.stopPropagation();
      e.preventDefault();
      
      pushHistory();
      state.folders = state.folders.filter(x => x.id !== f.id);
      state.scripts.forEach(s => { if (s.folderId === f.id) s.folderId = null; });
      if (state.activeFolderId === f.id) state.activeFolderId = null;
      saveState(true); 
      renderFolderList(); 
      renderScriptList();
      toast(`Carpeta "${f.name}" eliminada (Ctrl+Z para deshacer)`, 'danger', 3500);
    });

    $folderList.appendChild(el);
  });
}

function createFolder() {
  const name = prompt('Nombre de la carpeta (ej: "Marca X", "Septiembre"):');
  if (!name || !name.trim()) return;
  const icon = prompt('Emoji para la carpeta (opcional):', '📁') || '📁';
  const folder = { id: uid(), name: name.trim(), icon };
  state.folders.push(folder);
  saveState();
  renderFolderList();
}

function moveScriptToFolder(scriptId, folderId) {
  const script = getScript(scriptId);
  if (!script) return;
  script.folderId = folderId;
  saveState();
  renderScriptList();
  toast('Guion movido de carpeta');
}

// ============================================================
// SCRIPTS LIST
// ============================================================
function renderScriptList(filter='') {
  $scriptList.innerHTML = '';
  const filtered = state.scripts.filter(s => {
    const matchFolder = state.activeFolderId === null || s.folderId === state.activeFolderId;
    const matchText = s.title.toLowerCase().includes(filter.toLowerCase());
    return matchFolder && matchText;
  });

  if (!filtered.length) {
    const msg = state.activeFolderId ? 'Carpeta vacía.' : 'Sin guiones creados.';
    $scriptList.innerHTML = `<div style="padding:18px;text-align:center;color:var(--text-muted);font-size:12px;">${msg}</div>`;
    return;
  }
  
  filtered.slice().reverse().forEach(script => {
    const blocks = script.blocks.length;
    const dur = script.blocks.reduce((a,b) => a + (parseInt(b.duration)||0), 0);
    const el = document.createElement('div');
    el.className = `script-item${script.id === state.currentScriptId ? ' active' : ''}`;
    el.dataset.id = script.id;
    el.draggable = true;
    
    el.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', script.id);
      e.dataTransfer.effectAllowed = 'move';
    });

    el.innerHTML = `
      <span class="script-item-icon">🎬</span>
      <div class="script-item-info">
        <div class="script-item-name">${script.title || 'Sin título'}</div>
        <div class="script-item-meta">${blocks} bloque${blocks!==1?'s':''} · ${formatDuration(dur)}</div>
      </div>
      <button class="script-item-delete" data-id="${script.id}" title="Eliminar" style="z-index:10; pointer-events:auto; position:relative;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6"/><path d="M10,11v6"/><path d="M14,11v6"/></svg>
      </button>`;
    el.addEventListener('click', e => {
      if (e.target.closest('.script-item-delete')) return;
      selectScript(script.id);
    });
    el.querySelector('.script-item-delete').addEventListener('click', e => {
      e.stopPropagation();
      e.preventDefault();
      deleteScript(script.id);
    });
    $scriptList.appendChild(el);
  });
}

function formatDuration(secs) {
  if (!secs) return '0s';
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs/60)}m ${secs%60}s`;
}

// ============================================================
// SCRIPT CRUD
// ============================================================
function createScript(templateBlocks=null) {
  const script = {
    id: uid(),
    title: 'Nuevo guion',
    blocks: templateBlocks || [],
    folderId: state.activeFolderId, // Inherit current folder
    versions: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  state.scripts.push(script);
  saveState();
  selectScript(script.id);
  renderScriptList();
  setTimeout(() => { $scriptTitle.focus(); $scriptTitle.select(); }, 80);
}

function deleteScript(id) {
  pushHistory();
  const scriptName = getScript(id)?.title || 'Guion';
  state.scripts = state.scripts.filter(s => s.id !== id);
  if (state.currentScriptId === id) {
    state.currentScriptId = state.scripts.length ? state.scripts[0].id : null;
  }
  saveState(true);
  renderScriptList();
  renderEditor();
  toast(`"${scriptName}" eliminado (Ctrl+Z para deshacer)`, 'danger', 3500);
}

function selectScript(id) {
  state.currentScriptId = id;
  renderScriptList();
  renderEditor();
}

// ============================================================
// EDITOR RENDER
// ============================================================
function renderEditor() {
  const script = getCurrentScript();
  if (!script) {
    $emptyState.classList.remove('hidden');
    $blocksContainer.classList.add('hidden');
    $addBlockBar.classList.add('hidden');
    $scriptTitle.value = '';
    return;
  }
  $emptyState.classList.add('hidden');
  $blocksContainer.classList.remove('hidden');
  $addBlockBar.classList.remove('hidden');
  $scriptTitle.value = script.title;
  renderBlocks(script);
}

function renderBlocks(script) {
  $blocksContainer.innerHTML = '';
  script.blocks.forEach(block => {
    $blocksContainer.appendChild(buildBlockEl(block));
  });
  // Auto-resize all textareas now that they are in the DOM (layout required for scrollHeight)
  $blocksContainer.querySelectorAll('.layer-textarea').forEach(ta => autoResize(ta));
  initSortable();
  applyLayerVisibility();
}

function buildBlockEl(block) {
  const bt = BLOCK_TYPES[block.type] || BLOCK_TYPES.custom;
  if (!block.hiddenLayers) block.hiddenLayers = [];
  const el = document.createElement('div');
  el.className = 'script-block';
  el.dataset.id = block.id;
  el.style.setProperty('--block-color', bt.color);

  // Short labels for the layer toggle pills
  const LAYER_PILLS = {
    spoken:     'Guion',
    camera:     'Toma',
    audio:      'Música',
    screentext: 'Texto',
    notes:      'Notas',
  };

  el.innerHTML = `
    <div class="block-header">
      <span class="block-drag-handle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="9" cy="5" r="1.2" fill="currentColor"/><circle cx="15" cy="5" r="1.2" fill="currentColor"/><circle cx="9" cy="12" r="1.2" fill="currentColor"/><circle cx="15" cy="12" r="1.2" fill="currentColor"/><circle cx="9" cy="19" r="1.2" fill="currentColor"/><circle cx="15" cy="19" r="1.2" fill="currentColor"/></svg></span>
      <span class="block-type-badge"><span class="block-type-emoji">${bt.emoji}</span>${bt.label}</span>
      <div class="block-layer-toggles">
        ${LAYERS.map(layer => {
          const hidden = block.hiddenLayers.includes(layer.id);
          return `<button class="block-layer-toggle${hidden ? '' : ' active'}" data-layer="${layer.id}" data-block-id="${block.id}" title="${hidden ? 'Mostrar' : 'Ocultar'} ${LAYER_PILLS[layer.id]}">${LAYER_PILLS[layer.id]}</button>`;
        }).join('')}
      </div>
      <span class="block-duration">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
        <input class="block-duration-input" type="number" min="1" max="600" value="${block.duration||bt.defaultDuration}" data-id="${block.id}" title="Duración en segundos" />s
      </span>
      <button class="block-menu-btn" data-id="${block.id}" title="Opciones">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>
      </button>
    </div>
    <div class="block-body">
      ${LAYERS.map(layer => {
        const hidden = block.hiddenLayers.includes(layer.id);
        return `
        <div class="block-layer${hidden ? ' hidden-layer' : ''}" data-layer="${layer.id}">
          <div class="layer-label">${layer.label}</div>
          <textarea class="layer-textarea layer-${layer.id}" data-block-id="${block.id}" data-layer="${layer.id}" placeholder="${layer.placeholder}" rows="2">${block.layers?.[layer.id] || ''}</textarea>
          <button class="layer-mic-btn" data-block-id="${block.id}" data-layer="${layer.id}" title="Dictar por voz">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>
          </button>
          <button class="layer-clear-btn" data-block-id="${block.id}" data-layer="${layer.id}" title="Limpiar ${layer.label.replace(':','').replace('::','').trim()}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>`;
      }).join('')}
    </div>`;

  // Duration input
  el.querySelector('.block-duration-input').addEventListener('input', e => {
    updateBlockField(block.id, 'duration', parseInt(e.target.value)||1);
  });

  // Layer textareas
  el.querySelectorAll('.layer-textarea').forEach(ta => {
    ta.addEventListener('input', () => {
      updateBlockLayer(ta.dataset.blockId, ta.dataset.layer, ta.value);
      autoResize(ta);
    });
    autoResize(ta);
  });

  // Layer mic buttons (voice dictation)
  el.querySelectorAll('.layer-mic-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      toggleDictation(btn.dataset.blockId, btn.dataset.layer, el);
    });
  });

  // Layer clear buttons
  el.querySelectorAll('.layer-clear-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      clearBlockLayer(btn.dataset.blockId, btn.dataset.layer, el);
    });
  });

  // Per-block layer toggle pills
  el.querySelectorAll('.block-layer-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBlockLayer(btn.dataset.blockId, btn.dataset.layer, el);
    });
  });

  // Menu button
  el.querySelector('.block-menu-btn').addEventListener('click', e => {
    showContextMenu(e, block.id);
  });

  return el;
}

function autoResize(ta) {
  ta.style.height = 'auto';
  ta.style.height = Math.max(60, ta.scrollHeight) + 'px';
}

// ============================================================
// VOICE DICTATION ENGINE
// ============================================================
let activeRecognition = null;  // currently running SpeechRecognition instance
let activeMicBtn     = null;   // the button element currently recording
let activeTa         = null;   // the textarea receiving speech

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function toggleDictation(blockId, layerId, blockEl) {
  // If already recording in THIS layer → stop
  const micBtn = blockEl.querySelector(`.layer-mic-btn[data-layer="${layerId}"]`);
  if (activeRecognition && activeMicBtn === micBtn) {
    stopDictation();
    return;
  }

  // Stop any existing session first
  stopDictation();

  if (!SpeechRecognition) {
    toast('Tu navegador no soporta dictado por voz. Usa Chrome o Edge.', 'danger', 4000);
    return;
  }

  const ta = blockEl.querySelector(`.layer-textarea[data-layer="${layerId}"]`);
  if (!ta) return;

  // Mark the active mic button & textarea
  activeMicBtn = micBtn;
  activeTa     = ta;

  const recognition = new SpeechRecognition();
  recognition.lang         = 'es-MX';   // Spanish (Mexico) — matches the app locale
  recognition.interimResults = true;     // Show partial results while speaking
  recognition.continuous   = true;       // Keep listening until explicitly stopped
  recognition.maxAlternatives = 1;

  activeRecognition = recognition;

  // Visual feedback: recording state
  micBtn.classList.add('recording');
  micBtn.title = 'Detener dictado';

  // Track the "committed" text (before current interim phrase)
  const committedBase = ta.value;
  let interimText = '';

  recognition.addEventListener('result', e => {
    let interim = '';
    let newFinals = '';

    for (let i = e.resultIndex; i < e.results.length; i++) {
      const text = e.results[i][0].transcript;
      if (e.results[i].isFinal) {
        newFinals += (newFinals || committedBase.endsWith(' ') || committedBase === '' ? '' : ' ') + text;
      } else {
        interim += text;
      }
    }

    if (newFinals) {
      // Append finalized text permanently to the textarea
      const spacer = ta.value && !ta.value.endsWith(' ') ? ' ' : '';
      ta.value = ta.value + spacer + newFinals.trim();
      updateBlockLayer(blockId, layerId, ta.value);
      autoResize(ta);
      interimText = '';
    }

    // Show interim text as a preview (not saved yet)
    if (interim) {
      interimText = interim;
      // Visually previewed but not stored – just show placeholder style
      ta.dataset.interim = interim;
      ta.style.opacity   = '.7';
    } else {
      delete ta.dataset.interim;
      ta.style.opacity = '';
    }
  });

  recognition.addEventListener('end', () => {
    // Auto-restarted only if we're still "recording" this button
    if (activeRecognition === recognition && activeMicBtn === micBtn) {
      // continuous=true normally keeps going, but some browsers stop on silence;
      // restart transparently so the user doesn't have to click again
      try { recognition.start(); } catch(_) { stopDictation(); }
    }
  });

  recognition.addEventListener('error', e => {
    if (e.error === 'no-speech') return; // harmless
    if (e.error === 'not-allowed') {
      toast('Permiso de micrófono denegado. Habilítalo en el navegador.', 'danger', 4500);
    } else {
      toast(`Error de dictado: ${e.error}`, 'danger', 3000);
    }
    stopDictation();
  });

  try {
    recognition.start();
    toast('🎤 Dictando… Haz clic en el micrófono para detener.', 'success', 2500);
  } catch(err) {
    stopDictation();
    toast('No se pudo iniciar el dictado.', 'danger');
  }
}

function stopDictation() {
  if (activeRecognition) {
    try { activeRecognition.stop(); } catch(_) {}
    activeRecognition = null;
  }
  if (activeMicBtn) {
    activeMicBtn.classList.remove('recording');
    activeMicBtn.title = 'Dictar por voz';
    activeMicBtn = null;
  }
  if (activeTa) {
    activeTa.style.opacity = '';
    delete activeTa.dataset.interim;
    activeTa = null;
  }
}

// ============================================================
// SORTABLE
// ============================================================
let sortableInstance;
function initSortable() {
  if (sortableInstance) sortableInstance.destroy();
  sortableInstance = Sortable.create($blocksContainer, {
    animation: 200,
    handle: '.block-drag-handle',
    ghostClass: 'sortable-ghost',
    dragClass: 'sortable-drag',
    onEnd: () => {
      const script = getCurrentScript();
      if (!script) return;
      const ids = [...$blocksContainer.children].map(el => el.dataset.id);
      script.blocks = ids.map(id => script.blocks.find(b => b.id === id)).filter(Boolean);
      debouncedSave();
      renderScriptList();
    }
  });
}

// ============================================================
// BLOCK DATA MUTATIONS
// ============================================================
function updateBlockField(blockId, field, value) {
  const script = getCurrentScript();
  if (!script) return;
  const block = script.blocks.find(b => b.id === blockId);
  if (block) { block[field] = value; debouncedSave(); renderScriptList(); }
}

function updateBlockLayer(blockId, layerId, value) {
  const script = getCurrentScript();
  if (!script) return;
  const block = script.blocks.find(b => b.id === blockId);
  if (block) {
    if (!block.layers) block.layers = {};
    block.layers[layerId] = value;
    debouncedSave();
  }
}

function clearBlockLayer(blockId, layerId, blockEl) {
  const script = getCurrentScript();
  if (!script) return;
  const block = script.blocks.find(b => b.id === blockId);
  if (!block) return;
  if (!block.layers) block.layers = {};
  block.layers[layerId] = '';
  // Update only the textarea in place (no full re-render needed)
  const ta = blockEl.querySelector(`.layer-textarea[data-layer="${layerId}"]`);
  if (ta) { ta.value = ''; autoResize(ta); }
  debouncedSave();
}

function toggleBlockLayer(blockId, layerId, blockEl) {
  const script = getCurrentScript();
  if (!script) return;
  const block = script.blocks.find(b => b.id === blockId);
  if (!block) return;
  if (!block.hiddenLayers) block.hiddenLayers = [];

  const isHidden = block.hiddenLayers.includes(layerId);
  if (isHidden) {
    // Show it
    block.hiddenLayers = block.hiddenLayers.filter(l => l !== layerId);
  } else {
    // Hide it
    block.hiddenLayers.push(layerId);
  }

  // Update pill button
  const pill = blockEl.querySelector(`.block-layer-toggle[data-layer="${layerId}"]`);
  if (pill) {
    pill.classList.toggle('active', !block.hiddenLayers.includes(layerId));
    pill.title = block.hiddenLayers.includes(layerId) ? `Mostrar ${pill.textContent}` : `Ocultar ${pill.textContent}`;
  }

  // Update layer row visibility
  const layerRow = blockEl.querySelector(`.block-layer[data-layer="${layerId}"]`);
  if (layerRow) {
    const isHiddenNow = block.hiddenLayers.includes(layerId);
    layerRow.classList.toggle('hidden-layer', isHiddenNow);
    if (!isHiddenNow) {
      const ta = layerRow.querySelector('.layer-textarea');
      if (ta) autoResize(ta);
    }
  }

  debouncedSave();
}

function addBlock(type) {
  const script = getCurrentScript();
  if (!script) return;
  const bt = BLOCK_TYPES[type] || BLOCK_TYPES.custom;
  const block = { id: uid(), type, duration: bt.defaultDuration, layers: {} };
  script.blocks.push(block);
  debouncedSave();
  renderBlocks(script);
  renderScriptList();
  setTimeout(() => {
    const el = $blocksContainer.querySelector(`[data-id="${block.id}"]`);
    if (el) { el.scrollIntoView({ behavior:'smooth', block:'center' }); }
  }, 50);
}

function duplicateBlock(blockId) {
  const script = getCurrentScript();
  if (!script) return;
  const idx = script.blocks.findIndex(b => b.id === blockId);
  if (idx < 0) return;
  const orig = script.blocks[idx];
  const copy = JSON.parse(JSON.stringify(orig));
  copy.id = uid();
  script.blocks.splice(idx+1, 0, copy);
  debouncedSave();
  renderBlocks(script);
  renderScriptList();
}

function deleteBlock(blockId) {
  const script = getCurrentScript();
  if (!script) return;
  script.blocks = script.blocks.filter(b => b.id !== blockId);
  debouncedSave();
  renderBlocks(script);
  renderScriptList();
}

// ============================================================
// LAYERS
// ============================================================
function applyLayerVisibility() {
  document.querySelectorAll('.block-layer').forEach(el => {
    const layer = el.dataset.layer;
    const isHiddenNow = !state.activeLayers[layer];
    el.classList.toggle('hidden-layer', isHiddenNow);
    if (!isHiddenNow) {
      const ta = el.querySelector('.layer-textarea');
      if (ta) autoResize(ta);
    }
  });
}

function toggleLayer(layerId) {
  state.activeLayers[layerId] = !state.activeLayers[layerId];
  document.querySelectorAll(`.layer-btn[data-layer="${layerId}"]`).forEach(btn => {
    btn.classList.toggle('active', state.activeLayers[layerId]);
  });
  applyLayerVisibility();
}

// ============================================================
// CONTEXT MENU
// ============================================================
let ctxBlockId = null;
const $ctxMenu = $('block-context-menu');
function showContextMenu(e, blockId) {
  ctxBlockId = blockId;
  $ctxMenu.style.left = Math.min(e.clientX, window.innerWidth-200) + 'px';
  $ctxMenu.style.top  = Math.min(e.clientY, window.innerHeight-150) + 'px';
  $ctxMenu.classList.remove('hidden');
  e.stopPropagation();
}
document.addEventListener('click', () => $ctxMenu.classList.add('hidden'));
$ctxMenu.addEventListener('click', e => {
  const btn = e.target.closest('.ctx-btn');
  if (!btn || !ctxBlockId) return;
  const action = btn.dataset.action;
  if (action === 'duplicate') duplicateBlock(ctxBlockId);
  if (action === 'delete') deleteBlock(ctxBlockId);
  if (action === 'add-hook-from-lib') openModal('modal-hooks');
  $ctxMenu.classList.add('hidden');
});

// ============================================================
// MODALS
// ============================================================
function openModal(id) {
  $(id)?.classList.remove('hidden');
  if (id==='modal-simulate') renderSimulation();
  if (id==='modal-versions') renderVersions();
  if (id==='modal-hooks') renderHooks('all');
  if (id==='modal-templates') renderTemplatesList();
}
function closeModal(id) { $(id)?.classList.add('hidden'); }
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.modal));
});
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', e => {
    if (e.target === modal && !modal.classList.contains('modal-fullscreen'))
      closeModal(modal.id);
  });
});

// ============================================================
// PERFORMANCE SIMULATION
// ============================================================
function renderSimulation() {
  const script = getCurrentScript();
  const body = $('simulate-body');
  if (!script || !script.blocks.length) {
    body.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:30px;">Crea bloques primero para simular el rendimiento.</p>';
    return;
  }
  const totalSecs = script.blocks.reduce((a,b) => a+(parseInt(b.duration)||0), 0);
  const hookBlock = script.blocks.find(b => b.type==='hook');
  const hookText  = hookBlock?.layers?.spoken || '';
  const ctaBlock  = script.blocks.find(b => b.type==='cta');
  const hasAudio  = script.blocks.some(b => b.layers?.audio?.trim());
  const blockCount = script.blocks.length;

  // Simple retention estimate
  let retention = 85;
  if (!hookBlock) retention -= 25;
  else if (hookText.length < 20) retention -= 15;
  if (totalSecs > 90) retention -= 10;
  if (totalSecs > 180) retention -= 10;
  if (!ctaBlock) retention -= 8;
  if (blockCount < 3) retention -= 10;
  retention = Math.max(20, Math.min(95, retention));

  const pace = totalSecs < 30 ? 'Muy rápido' : totalSecs < 60 ? 'Óptimo' : totalSecs < 120 ? 'Moderado' : 'Lento';
  const paceColor = totalSecs < 60 ? 'var(--success)' : totalSecs < 120 ? 'var(--warning)' : 'var(--danger)';

  // Alerts
  const alerts = [];
  if (!hookBlock) alerts.push({ type:'danger', msg:'❌ Sin bloque HOOK. Agrega uno para captar atención desde el inicio.' });
  else if (hookText.length < 20) alerts.push({ type:'warning', msg:'⚠️ Hook débil: escribe más de 20 caracteres en el guion hablado del HOOK.' });
  else alerts.push({ type:'success', msg:'✅ Hook detectado y con contenido.' });
  if (totalSecs > 90) alerts.push({ type:'warning', msg:'⚠️ Duración larga. Considera reducir el guion para mejorar la retención.' });
  if (!ctaBlock) alerts.push({ type:'warning', msg:'⚠️ Sin bloque CTA. Siempre pide una acción al final.' });
  if (!hasAudio) alerts.push({ type:'warning', msg:'💡 Considera agregar indicaciones de audio/música para mejorar la producción.' });
  const climaxBlock = script.blocks.find(b => b.type==='climax');
  if (!climaxBlock) alerts.push({ type:'warning', msg:'⚠️ Sin CLÍMAX / VALOR. Este es el momento de más impacto del video.' });
  else alerts.push({ type:'success', msg:'✅ Tienes un bloque de Clímax. Asegúrate de que tenga el mayor valor.' });

  body.innerHTML = `
    <div class="sim-overview">
      <div class="sim-card">
        <div class="sim-card-value" style="color:var(--accent)">${formatDuration(totalSecs)}</div>
        <div class="sim-card-label">Duración Total</div>
      </div>
      <div class="sim-card">
        <div class="sim-card-value" style="color:${retention>=70?'var(--success)':retention>=50?'var(--warning)':'var(--danger)'}">${retention}%</div>
        <div class="sim-card-label">Retención Est.</div>
      </div>
      <div class="sim-card">
        <div class="sim-card-value" style="color:${paceColor};font-size:18px;">${pace}</div>
        <div class="sim-card-label">Ritmo</div>
      </div>
    </div>
    <div class="sim-bar-wrap">
      <div class="sim-bar-label"><span>Retención estimada</span><span>${retention}%</span></div>
      <div class="sim-bar"><div class="sim-bar-fill" style="width:${retention}%"></div></div>
    </div>
    <div class="sim-alerts">
      ${alerts.map(a => `<div class="sim-alert ${a.type}">${a.msg}</div>`).join('')}
    </div>`;
}

// ============================================================
// VERSIONS
// ============================================================
function renderVersions() {
  const script = getCurrentScript();
  const body = $('versions-body');
  if (!script) { body.innerHTML = '<p style="color:var(--text-muted)">No hay guion activo.</p>'; return; }
  const versions = script.versions || [];
  if (!versions.length) {
    body.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px;">Sin versiones guardadas. Guarda la versión actual para poder restaurarla después.</p>';
    return;
  }
  body.innerHTML = versions.slice().reverse().map((v,ri) => {
    const i = versions.length - 1 - ri;
    const d = new Date(v.savedAt).toLocaleString('es-MX',{dateStyle:'short',timeStyle:'short'});
    return `<div class="version-item">
      <div>
        <div class="version-label">${v.label || 'Versión ' + (i+1)}</div>
        <div class="version-meta">${d} · ${v.blocks.length} bloques</div>
      </div>
      <button class="version-restore" data-vi="${i}">Restaurar</button>
    </div>`;
  }).join('');
  body.querySelectorAll('.version-restore').forEach(btn => {
    btn.addEventListener('click', () => {
      const vi = parseInt(btn.dataset.vi);
      restoreVersion(vi);
    });
  });
}

function saveVersion() {
  const script = getCurrentScript();
  if (!script) return;
  const label = prompt('Nombre de esta versión (opcional):', `v${(script.versions||[]).length+1} — ${new Date().toLocaleDateString('es-MX')}`);
  if (label === null) return;
  if (!script.versions) script.versions = [];
  script.versions.push({ savedAt: Date.now(), label: label||'', blocks: JSON.parse(JSON.stringify(script.blocks)) });
  saveState();
  toast('Versión guardada', 'success');
  renderVersions();
}

function restoreVersion(vi) {
  const script = getCurrentScript();
  if (!script || !confirm('¿Restaurar esta versión? Se perderán los cambios actuales no guardados como versión.')) return;
  script.blocks = JSON.parse(JSON.stringify(script.versions[vi].blocks));
  saveState();
  renderBlocks(script);
  renderScriptList();
  closeModal('modal-versions');
  toast('Versión restaurada', 'success');
}

// ============================================================
// TELEPROMPTER
// ============================================================
let tpPlaying = false;
let tpInterval = null;
let tpFontSize = 32;

function openTeleprompter() {
  const script = getCurrentScript();
  const modal = $('modal-teleprompter');
  const content = $('teleprompter-content');
  if (!script || !script.blocks.length) { toast('Agrega bloques primero', 'danger'); return; }

  let html = '<div class="teleprompter-inner" id="tp-inner">';
  html += '<div class="tp-focus-line"></div>';
  script.blocks.forEach(block => {
    const bt = BLOCK_TYPES[block.type] || BLOCK_TYPES.custom;
    const text = block.layers?.spoken || '';
    if (!text.trim()) return;
    html += `<div class="tp-block-title" style="color:${bt.color}">${bt.emoji} ${bt.label}</div>`;
    html += `<p>${text.replace(/\n/g,'<br>')}</p>`;
  });
  html += '</div>';
  content.innerHTML = html;
  content.querySelector('.teleprompter-inner').style.fontSize = tpFontSize + 'px';
  modal.classList.remove('hidden');
  stopTeleprompter();
}

function startTeleprompter() {
  tpPlaying = true;
  $('tp-play').textContent = '⏸ Pausar';
  $('tp-play').classList.add('playing');
  const speed = parseInt($('tp-speed').value);
  const inner = document.getElementById('tp-inner');
  if (!inner) return;
  let pos = 0;
  tpInterval = setInterval(() => {
    pos += speed * 0.4;
    inner.style.transform = `translateY(-${pos}px)`;
    const maxScroll = inner.scrollHeight - $('teleprompter-content').clientHeight + 120;
    if (pos >= maxScroll) stopTeleprompter();
  }, 40);
}

function stopTeleprompter() {
  tpPlaying = false;
  clearInterval(tpInterval);
  const btn = $('tp-play');
  if (btn) { btn.textContent = '▶ Iniciar'; btn.classList.remove('playing'); }
}

// ============================================================
// HOOKS LIBRARY
// ============================================================
function renderHooks(cat) {
  const all = [...HOOKS_DB.map(h=>({...h, custom:false})), ...state.customHooks.map(h=>({...h, custom:true}))];
  const filtered = cat==='all' ? all : cat==='custom' ? all.filter(h=>h.custom) : all.filter(h=>h.cat===cat);
  const $list = $('hooks-list');
  if (!filtered.length) {
    $list.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px;">Sin hooks en esta categoría.</p>';
    return;
  }
  $list.innerHTML = filtered.map((h,i) => `
    <div class="hook-item">
      <span class="hook-item-text">${h.text}</span>
      <span class="hook-item-cat">${catLabel(h.cat)}</span>
      <button class="hook-item-use" data-idx="${i}" data-text="${encodeURIComponent(h.text)}">Usar</button>
    </div>`).join('');
  $list.querySelectorAll('.hook-item-use').forEach(btn => {
    btn.addEventListener('click', () => {
      const txt = decodeURIComponent(btn.dataset.text);
      insertHookIntoBlock(txt);
      closeModal('modal-hooks');
    });
  });
}

function catLabel(cat) {
  return {curiosity:'🤔 Curiosidad', controversy:'🔥 Polémica', storytelling:'📖 Story', authority:'👑 Autoridad', fear:'😱 Urgencia', custom:'⭐ Mío'}[cat] || cat;
}

function insertHookIntoBlock(text) {
  const script = getCurrentScript();
  if (!script) return;
  let hookBlock = script.blocks.find(b => b.type==='hook');
  if (!hookBlock) {
    hookBlock = { id: uid(), type:'hook', duration: 5, layers:{} };
    script.blocks.unshift(hookBlock);
  }
  if (!hookBlock.layers) hookBlock.layers = {};
  hookBlock.layers.spoken = text;
  debouncedSave();
  renderBlocks(script);
  renderScriptList();
  toast('Hook insertado en el bloque HOOK', 'success');
}

// ============================================================
// TEMPLATES
// ============================================================
function renderTemplatesList() {
  const list = $('templates-list');
  list.innerHTML = TEMPLATES_DB.map(t => `
    <div class="template-card" data-tpl="${t.id}">
      <div class="template-icon">${t.icon}</div>
      <div class="template-title">${t.title}</div>
      <div class="template-desc">${t.desc}</div>
      <div class="template-blocks">
        ${t.blocks.map(b => `<span class="template-block-tag">${BLOCK_TYPES[b.type]?.emoji||''} ${BLOCK_TYPES[b.type]?.label||b.type}</span>`).join('')}
      </div>
    </div>`).join('');
  list.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('click', () => {
      applyTemplate(card.dataset.tpl);
      closeModal('modal-templates');
    });
  });
}

function applyTemplate(tplId) {
  const tpl = TEMPLATES_DB.find(t => t.id === tplId);
  if (!tpl) return;
  const blocks = tpl.blocks.map(b => ({
    id: uid(), type: b.type, duration: b.duration,
    layers: { spoken: b.spoken||'', camera:'', audio:'', screentext:'', notes:'' }
  }));
  createScript(blocks);
  const script = getCurrentScript();
  if (script) { script.title = tpl.title; $scriptTitle.value = tpl.title; saveState(); renderScriptList(); }
  toast(`Plantilla "${tpl.title}" aplicada`, 'success');
}

// ============================================================
// EXPORT & BACKUPS
// ============================================================
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

function getSafeFilename(title, defaultName) {
  return (title || defaultName)
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/\s+/g, '-') // spaces to dashes
    .replace(/[^a-zA-Z0-9-]/g, '') // remove special chars/emojis
    .replace(/-+/g, '-') // collapse dashes
    .replace(/^-|-$/g, '') // trim dashes
    || defaultName;
}

function downloadFile(filename, content, type = 'text/plain') {
  const blob = new Blob([content], { type });
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(blob),
    download: filename
  });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function exportPDF() {
  const script = getCurrentScript();
  if (!script) return;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:'mm', format:'a4' });
  const pw = doc.internal.pageSize.getWidth();
  let y = 20;

  doc.setFont('courier', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(30,30,50);
  const titleStr = sanitizeForPDF(script.title || 'Guion sin título');
  doc.text(titleStr, (pw - doc.getTextWidth(titleStr)) / 2, y);
  y += 8;

  doc.setFont('courier', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(120,120,140);
  const total = script.blocks.reduce((a,b)=>a+(parseInt(b.duration)||0),0);
  const metaStr = sanitizeForPDF(`${script.blocks.length} bloques · ${formatDuration(total)} · ${new Date().toLocaleDateString('es-MX')}`);
  doc.text(metaStr, (pw - doc.getTextWidth(metaStr)) / 2, y);
  y += 14;

  script.blocks.forEach(block => {
    if (y > 260) { doc.addPage(); y = 20; }
    const bt = BLOCK_TYPES[block.type]||BLOCK_TYPES.custom;

    // Center divider
    doc.setFont('courier', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(150,150,150);
    const headerStr = sanitizeForPDF(`------------- ${bt.label} (${block.duration||0}s) -------------`);
    doc.text(headerStr, (pw - doc.getTextWidth(headerStr)) / 2, y);
    y += 10;

    // Layers
    LAYERS.forEach(layer => {
      const txt = block.layers?.[layer.id]||'';
      if (!txt.trim()) return;
      if (y > 265) { doc.addPage(); y = 20; }

      let fontStyle = 'normal';
      let r=40, g=40, b=60; // Dialogue color
      if (layer.id === 'camera') { fontStyle = 'italic'; r=96; g=165; b=250; }
      else if (layer.id === 'audio') { fontStyle = 'italic'; r=217; g=70; b=239; }
      else if (layer.id === 'screentext') { r=200; g=150; b=20; }
      else if (layer.id === 'notes') { fontStyle = 'italic'; r=120; g=120; b=140; }

      doc.setFont('courier', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(r, g, b);
      doc.text(sanitizeForPDF(layer.label), 22, y);
      y += 5;

      doc.setFont('courier', fontStyle);
      const lines = doc.splitTextToSize(sanitizeForPDF(txt), pw-44);
      doc.text(lines, 22, y);
      y += lines.length * 4.5 + 4;
    });
    y += 6;
  });

  doc.save(`${getSafeFilename(script.title, 'guion').toLowerCase()}.pdf`);
  toast('PDF exportado', 'success');
}

function exportText(mode='full') {
  const script = getCurrentScript();
  if (!script) return;
  let txt = `${script.title || 'Guion'}\n${'='.repeat(40)}\n\n`;
  script.blocks.forEach(block => {
    const bt = BLOCK_TYPES[block.type]||BLOCK_TYPES.custom;
    txt += `[${bt.label} — ${block.duration||0}s]\n`;
    if (mode==='full') {
      LAYERS.forEach(l => { const v=block.layers?.[l.id]||''; if(v.trim()) txt += `  ${l.id.toUpperCase()}: ${v}\n`; });
    } else {
      const spoken = block.layers?.spoken||'';
      if (spoken.trim()) txt += spoken + '\n';
    }
    txt += '\n';
  });
  const blob = new Blob([txt], {type:'text/plain'});
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `${getSafeFilename(script.title, 'guion').toLowerCase()}.txt` });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  toast('Texto exportado', 'success');
}

function exportChecklist() {
  const script = getCurrentScript();
  if (!script) return;
  let txt = `CHECKLIST DE GRABACIÓN — ${script.title||'Guion'}\n${'='.repeat(40)}\n\n`;
  script.blocks.forEach(block => {
    const bt = BLOCK_TYPES[block.type]||BLOCK_TYPES.custom;
    txt += `☐ ${bt.label} (${block.duration||0}s)\n`;
    const cam = block.layers?.camera||''; if(cam.trim()) txt += `   📷 Cámara: ${cam}\n`;
    const aud = block.layers?.audio||'';  if(aud.trim()) txt += `   🎧 Audio: ${aud}\n`;
    const st  = block.layers?.screentext||''; if(st.trim()) txt += `   📱 Texto: ${st}\n`;
    txt += '\n';
  });
  const blob = new Blob([txt], {type:'text/plain'});
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `checklist-${getSafeFilename(script.title, 'guion').toLowerCase()}.txt` });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  toast('Checklist exportado', 'success');
}

function exportNotion() {
  const script = getCurrentScript();
  if (!script) return;
  const folderName = script.folderId ? state.folders.find(f => f.id === script.folderId)?.name : '';
  
  let txt = `# ${script.title || 'Guion'}\n`;
  if (folderName) txt += `📁 **Carpeta:** ${folderName}\n`;
  const dur = script.blocks.reduce((a,b)=>a+(parseInt(b.duration)||0),0);
  txt += `⏱ **Duración Est:** ${formatDuration(dur)}  |  📊 **Bloques:** ${script.blocks.length}\n\n---\n\n`;

  script.blocks.forEach(block => {
    const bt = BLOCK_TYPES[block.type]||BLOCK_TYPES.custom;
    txt += `### ${bt.emoji} ${bt.label} (${block.duration||0}s)\n`;
    
    const layerTitles = { camera:'🎥 Cámara', audio:'🎧 Audio', screentext:'📱 Texto', notes:'💡 Notas' };
    
    // Spoken text as main paragraph block or quote block
    const spoken = block.layers?.spoken||'';
    if (spoken.trim()) {
      txt += `> ${spoken.replace(/\n/g, '\n> ')}\n\n`;
    }

    // Other layers as bullet points
    ['camera', 'audio', 'screentext', 'notes'].forEach(l => {
      const v = block.layers?.[l]||'';
      if (v.trim()) {
        txt += `- **${layerTitles[l]}:** ${v.replace(/\n/g, ' ')}\n`;
      }
    });
    txt += '\n';
  });

  const blob = new Blob([txt], {type:'text/markdown'});
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `${(script.title||'guion').replace(/\s+/g,'-')}-notion.md` });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  toast('Markdown exportado. Cópialo y pégalo en Notion.', 'success', 4000);
}

function exportJSON() {
  const data = JSON.stringify(state, null, 2);
  const blob = new Blob([data], {type: 'application/json'});
  const a = Object.assign(document.createElement('a'), { 
    href: URL.createObjectURL(blob), 
    download: `guiones_backup_${new Date().toISOString().split('T')[0]}.json` 
  });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  toast('Backup descargado correctamente', 'success');
}

function importJSON(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.scripts) throw new Error("Archivo inválido");
      Object.assign(state, data);
      
      // Ensure missing refs
      if (!state.folders) state.folders = [];
      state.activeFolderId = null;
      if (!state.scripts.find(s => s.id === state.currentScriptId)) {
        state.currentScriptId = state.scripts.length ? state.scripts[0].id : null;
      }
      
      saveState();
      renderFolderList();
      renderScriptList();
      renderEditor();
      toast('Backup restaurado correctamente', 'success');
    } catch(err) {
      toast('Error al leer el archivo. ¿Es un backup válido?', 'danger');
    }
  };
  reader.readAsText(file);
}

// ============================================================
// BATCH EXPORT (Multi-Script PDF)
// ============================================================
function openBatchExportModal() {
  const listEl = document.getElementById('batch-script-list');
  listEl.innerHTML = '';
  
  // Only show scripts in current folder, or all if no folder is selected
  const viewableScripts = state.activeFolderId 
    ? state.scripts.filter(s => s.folderId === state.activeFolderId)
    : state.scripts;

  if (viewableScripts.length === 0) {
    listEl.innerHTML = '<div style="padding:16px; text-align:center; color:var(--text-muted); font-size:13px;">No hay guiones para exportar en esta vista.</div>';
    document.getElementById('batch-selected-count').textContent = '0 seleccionados';
    openModal('modal-batch-export');
    return;
  }

  viewableScripts.forEach(script => {
    const total = script.blocks.reduce((a,b)=>a+(parseInt(b.duration)||0),0);
    const div = document.createElement('div');
    div.className = 'batch-script-item';
    // By default, select all
    div.innerHTML = `
      <input type="checkbox" class="batch-script-checkbox" value="${script.id}" checked>
      <div class="batch-script-info">
        <div class="batch-script-name">${escapeHTML(script.title || 'Guion sin título')}</div>
        <div class="batch-script-meta">${script.blocks.length} bloques · ${formatDuration(total)}</div>
      </div>
    `;
    div.addEventListener('click', (e) => {
      if (e.target.tagName !== 'INPUT') {
        const cb = div.querySelector('input');
        cb.checked = !cb.checked;
        updateBatchSelectedCount();
      } else {
        updateBatchSelectedCount();
      }
    });
    listEl.appendChild(div);
  });
  
  updateBatchSelectedCount();
  openModal('modal-batch-export');
}

function updateBatchSelectedCount() {
  const count = document.querySelectorAll('.batch-script-checkbox:checked').length;
  document.getElementById('batch-selected-count').textContent = `${count} seleccionado${count!==1?'s':''}`;
}

function toggleBatchSelectAll() {
  const cbs = document.querySelectorAll('.batch-script-checkbox');
  const allChecked = Array.from(cbs).every(cb => cb.checked);
  cbs.forEach(cb => cb.checked = !allChecked);
  updateBatchSelectedCount();
  document.getElementById('btn-batch-select-all').textContent = allChecked ? 'Seleccionar todo' : 'Deseleccionar todo';
}

function exportBatchPDF() {
  const selectedIds = Array.from(document.querySelectorAll('.batch-script-checkbox:checked')).map(cb => cb.value);
  if (selectedIds.length === 0) {
    toast('Selecciona al menos un guion', 'warning');
    return;
  }

  const scriptsToExport = state.scripts.filter(s => selectedIds.includes(s.id));
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:'mm', format:'a4' });
  const pw = doc.internal.pageSize.getWidth();
  let y = 30;

  // --- COVER PAGE ---
  doc.setFont('courier', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(30,30,50);
  const titleStr = 'PLAN DE CONTENIDO';
  doc.text(titleStr, (pw - doc.getTextWidth(titleStr)) / 2, 100);
  
  doc.setFontSize(12);
  doc.setTextColor(120,120,140);
  const dateStr = `Generado el: ${new Date().toLocaleDateString('es-MX')}`;
  doc.text(dateStr, (pw - doc.getTextWidth(dateStr)) / 2, 120);
  const countStr = `${scriptsToExport.length} guiones incluidos`;
  doc.text(countStr, (pw - doc.getTextWidth(countStr)) / 2, 128);

  // --- INDEX PAGE ---
  doc.addPage();
  y = 20;
  doc.setFont('courier', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(30,30,50);
  doc.text('ÍNDICE DE GUIONES', 20, y);
  y += 15;
  
  doc.setFont('courier', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(40,40,60);
  
  scriptsToExport.forEach((script, index) => {
    if (y > 270) { doc.addPage(); y = 20; }
    const total = script.blocks.reduce((a,b)=>a+(parseInt(b.duration)||0),0);
    const itemNum = `${index + 1}. `;
    const cleanTitle = sanitizeForPDF(script.title || 'Guion sin título');
    const durFormat = `[${formatDuration(total)}]`;
    
    doc.text(itemNum, 20, y);
    doc.text(cleanTitle, 28, y);
    doc.text(durFormat, pw - 20 - doc.getTextWidth(durFormat), y);
    y += 8;
  });

  // --- SCRIPTS PAGES ---
  scriptsToExport.forEach((script, idx) => {
    doc.addPage();
    y = 20;

    // Script Header
    doc.setFont('courier', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(30,30,50);
    const sTitle = sanitizeForPDF(`${idx+1}. ${script.title || 'Guion sin título'}`);
    doc.text(sTitle, (pw - doc.getTextWidth(sTitle)) / 2, y);
    y += 8;

    doc.setFont('courier', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(120,120,140);
    const total = script.blocks.reduce((a,b)=>a+(parseInt(b.duration)||0),0);
    const metaStr = sanitizeForPDF(`${script.blocks.length} bloques · ${formatDuration(total)}`);
    doc.text(metaStr, (pw - doc.getTextWidth(metaStr)) / 2, y);
    y += 14;

    // Blocks
    script.blocks.forEach(block => {
      if (y > 260) { doc.addPage(); y = 20; }
      const bt = BLOCK_TYPES[block.type]||BLOCK_TYPES.custom;

      // Center divider
      doc.setFont('courier', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(150,150,150);
      const headerStr = sanitizeForPDF(`------------- ${bt.label} (${block.duration||0}s) -------------`);
      doc.text(headerStr, (pw - doc.getTextWidth(headerStr)) / 2, y);
      y += 10;

      // Layers
      LAYERS.forEach(layer => {
        const txt = block.layers?.[layer.id]||'';
        if (!txt.trim()) return;
        if (y > 265) { doc.addPage(); y = 20; }

        let fontStyle = 'normal';
        let r=40, g=40, b=60;
        if (layer.id === 'camera') { fontStyle = 'italic'; r=96; g=165; b=250; }
        else if (layer.id === 'audio') { fontStyle = 'italic'; r=217; g=70; b=239; }
        else if (layer.id === 'screentext') { r=200; g=150; b=20; }
        else if (layer.id === 'notes') { fontStyle = 'italic'; r=120; g=120; b=140; }

        doc.setFont('courier', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(r, g, b);
        doc.text(sanitizeForPDF(layer.label), 22, y);
        y += 5;

        doc.setFont('courier', fontStyle);
        const lines = doc.splitTextToSize(sanitizeForPDF(txt), pw-44);
        doc.text(lines, 22, y);
        y += lines.length * 4.5 + 4;
      });
      y += 6;
    });
  });

  const folderName = state.activeFolderId 
    ? state.folders.find(f => f.id === state.activeFolderId)?.name || 'lote'
    : 'plan_contenido';
  
  doc.save(`${getSafeFilename(folderName, 'plan').toLowerCase()}_guiones.pdf`);
  closeModal('modal-batch-export');
  toast('Plan de Contenido exportado', 'success');
}

// ============================================================
// EVENT WIRING
// ============================================================
function wireEvents() {
  // New script
  $('btn-new-script').addEventListener('click', () => createScript());
  $('btn-new-script-empty')?.addEventListener('click', () => createScript());

  // Sidebar toggle
  $('btn-toggle-sidebar').addEventListener('click', () => {
    $sidebar.classList.toggle('collapsed');
  });

  // Title edit
  $scriptTitle.addEventListener('input', () => {
    const script = getCurrentScript();
    if (script) { script.title = $scriptTitle.value; debouncedSave(); renderScriptList(); }
  });

  // Search
  $('search-scripts').addEventListener('input', e => renderScriptList(e.target.value));

  // Layer toggles
  $layerToggles.querySelectorAll('.layer-btn').forEach(btn => {
    btn.addEventListener('click', () => toggleLayer(btn.dataset.layer));
  });

  // Batch Export
  document.getElementById('btn-batch-export').addEventListener('click', openBatchExportModal);
  document.getElementById('btn-generate-batch-pdf').addEventListener('click', exportBatchPDF);
  document.getElementById('btn-batch-select-all').addEventListener('click', toggleBatchSelectAll);

  // Add blocks
  document.querySelectorAll('.add-block-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!state.currentScriptId) { toast('Crea un guion primero', 'danger'); return; }
      addBlock(btn.dataset.type);
    });
  });

  // Modals
  $('btn-simulate').addEventListener('click', () => {
    if (!state.currentScriptId) { toast('Selecciona un guion primero', 'danger'); return; }
    openModal('modal-simulate');
  });
  $('btn-versions').addEventListener('click', () => {
    if (!state.currentScriptId) { toast('Selecciona un guion primero', 'danger'); return; }
    openModal('modal-versions');
  });
  $('btn-teleprompter').addEventListener('click', openTeleprompter);
  $('btn-export').addEventListener('click', () => {
    if (!state.currentScriptId) { toast('Selecciona un guion primero', 'danger'); return; }
    openModal('modal-export');
  });
  $('btn-hooks-lib').addEventListener('click', () => openModal('modal-hooks'));
  $('btn-templates').addEventListener('click', () => openModal('modal-templates'));
  $('btn-save-version').addEventListener('click', saveVersion);

  // Teleprompter controls
  $('tp-play').addEventListener('click', () => {
    tpPlaying ? stopTeleprompter() : startTeleprompter();
  });
  $('tp-close').addEventListener('click', () => {
    stopTeleprompter();
    closeModal('modal-teleprompter');
  });
  $('tp-speed').addEventListener('input', e => {
    $('tp-speed-val').textContent = e.target.value;
    if (tpPlaying) { stopTeleprompter(); startTeleprompter(); }
  });
  $('tp-font-up').addEventListener('click', () => {
    tpFontSize = Math.min(56, tpFontSize + 4);
    const inner = document.getElementById('tp-inner');
    if (inner) inner.style.fontSize = tpFontSize + 'px';
  });
  $('tp-font-down').addEventListener('click', () => {
    tpFontSize = Math.max(16, tpFontSize - 4);
    const inner = document.getElementById('tp-inner');
    if (inner) inner.style.fontSize = tpFontSize + 'px';
  });
  document.addEventListener('keydown', e => {
    // CTRL + Z logic
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      undoLastCommand();
      return;
    }

    if (e.key==='Escape') { stopTeleprompter(); closeModal('modal-teleprompter'); }
    if (e.key===' ' && document.querySelector('#modal-teleprompter:not(.hidden)')) {
      e.preventDefault();
      tpPlaying ? stopTeleprompter() : startTeleprompter();
    }
  });

  // Export buttons
  $('export-pdf').addEventListener('click', () => { closeModal('modal-export'); exportPDF(); });
  $('export-txt').addEventListener('click', () => { closeModal('modal-export'); exportText('full'); });
  $('export-notion').addEventListener('click', () => { closeModal('modal-export'); exportNotion(); });
  $('export-teleprompter').addEventListener('click', () => { closeModal('modal-export'); exportText('spoken'); });
  $('export-checklist').addEventListener('click', () => { closeModal('modal-export'); exportChecklist(); });
  
  // Backup buttons
  $('btn-backup-json').addEventListener('click', () => { closeModal('modal-export'); exportJSON(); });
  $('btn-restore-json').addEventListener('click', () => $('input-restore-json').click());
  $('input-restore-json').addEventListener('change', e => {
    if (e.target.files.length) {
      closeModal('modal-export');
      importJSON(e.target.files[0]);
      e.target.value = ''; // reset
    }
  });

  // Hooks filter
  $('hooks-filter').querySelectorAll('.hook-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $('hooks-filter').querySelectorAll('.hook-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderHooks(btn.dataset.cat);
    });
  });

  // Add custom hook
  $('btn-add-custom-hook').addEventListener('click', () => {
    const input = $('custom-hook-input');
    const text = input.value.trim();
    if (!text) return;
    state.customHooks.push({ text, cat:'custom' });
    saveState();
    input.value = '';
    renderHooks('custom');
    toast('Hook guardado', 'success');
    $('hooks-filter').querySelectorAll('.hook-cat-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.cat==='custom');
    });
  });
}

// ============================================================
// INIT
// ============================================================
function init() {
  loadState();
  wireEvents();
  renderScriptList();
  if (state.currentScriptId && getScript(state.currentScriptId)) {
    renderEditor();
  } else {
    state.currentScriptId = null;
    renderEditor();
  }
}

document.addEventListener('DOMContentLoaded', init);
