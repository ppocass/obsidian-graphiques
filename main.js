'use strict';

const { Plugin, TextFileView, Modal, FuzzySuggestModal, Component, Notice, Menu, PluginSettingTab, Setting, setIcon, TFolder, TFile } = require('obsidian');

/* ================================================================== */
/*  Réglages et traductions                                           */
/* ================================================================== */

const DEFAULT_SETTINGS = {
  language: 'fr',          // fr | en | auto (suit Obsidian)
  showHelp: true,          // textes explicatifs et liste des raccourcis
  showCoords: true,        // position du curseur dans la barre d'outils
  showHints: true,         // messages passagers pendant le tracé
  panelWidth: 250,
  snapDefault: true,
  defaultColor: '#2d7ff9',
  defaultWidth: 2,
  newQuadrant: false,
  newGrid: true,
  newAxes: true,
  newScale: 45,
  embedHeight: 380,
  embedOpenButton: true,
  plainLinkPreview: true,   // [[figure.graph]] seul sur sa ligne s'affiche comme un aperçu
};

let SETTINGS = Object.assign({}, DEFAULT_SETTINGS);
let LANG = 'fr';

const STRINGS = {
  fr: {
    'view.title': 'Graphique',
    'tool.select': 'Sélectionner et déplacer',
    'tool.point': 'Point',
    'tool.seg': 'Segment',
    'tool.line': 'Droite',
    'tool.arrow': 'Flèche',
    'tool.poly': 'Zone libre',
    'tool.inter': 'Point d\'intersection',
    'tool.text': 'Texte',
    'tool.tangent': 'Tangente à une courbe',
    'shape.rect': 'Rectangle',
    'shape.square': 'Carré',
    'shape.circle': 'Cercle',
    'shape.ellipse': 'Ellipse',
    'shape.tri': 'Triangle isocèle',
    'shape.tri-rect': 'Triangle rectangle',
    'shape.diamond': 'Losange',
    'shape.penta': 'Pentagone',
    'shape.hexa': 'Hexagone',
    'obj.poly': 'Forme',
    'obj.ellipse': 'Cercle / ellipse',
    'shapes.button': 'Formes',
    'shapes.current': 'Forme active : %s',
    'bar.color': 'Couleur du tracé',
    'bar.snap': 'Aimantation (quadrillage et objets)',
    'bar.zoomOut': 'Réduire',
    'bar.zoomIn': 'Agrandir',
    'bar.reset': 'Recentrer',
    'bar.export': 'Exporter et partager',
    'panel.curves': 'Courbes',
    'panel.frame': 'Repère',
    'panel.empty': 'Sélectionnez un objet pour afficher ses propriétés.',
    'panel.addCurve': 'Ajouter une courbe',
    'curve.toggle': 'Afficher ou masquer',
    'curve.fill': 'Colorier l\'aire sous la courbe',
    'curve.delete': 'Supprimer la courbe',
    'curve.placeholder': 'y = 2x + 1',
    'bounds.from': 'de',
    'bounds.to': 'à',
    'frame.grid': 'Quadrillage',
    'frame.axes': 'Axes et graduations',
    'frame.quadrant': 'Quart positif',
    'frame.scaleX': 'Échelle x',
    'frame.scaleY': 'Échelle y',
    'frame.lock': 'Lier les échelles',
    'frame.xlabel': 'axe horizontal',
    'frame.ylabel': 'axe vertical',
    'help.title': 'Raccourcis',
    'sel.slope': 'Coefficient directeur a = %s',
    'sel.length': 'longueur %s',
    'sel.vertical': 'Droite verticale',
    'sel.radius': 'Cercle de rayon %s',
    'sel.semiaxes': 'Demi-axes %s et %s',
    'sel.polygon': '%s sommets · aire %s',
    'sel.linked': 'Point d\'intersection, recalculé automatiquement.',
    'sel.detach': 'Détacher',
    'sel.bound': 'Extrémité accrochée à un point : elle le suit.',
    'sel.tangent': 'Tangente à %s en x = %s',
    'sel.rotation': 'Rotation (°)',
    'sel.follow': 'Suivre les objets',
    'sel.following': '%s sommets sur %s suivent la géométrie.',
    'menu.follow': 'Faire suivre la géométrie',
    'menu.unfollow': 'Détacher de la géométrie',
    'hint.anchored': 'Zone accrochée : %s sommets suivent.',
    'hint.notAnchored': 'Aucun sommet ne touche une droite ou une courbe.',
    'hint.tangentPick': 'Cliquez une courbe à l\'endroit voulu.',
    'hint.tangentDone': 'Tangente en x = %s',
    'hint.tangentCurveOnly': 'La tangente s\'applique à une courbe saisie au clavier.',
    'sel.impose': 'Imposer une équation : y = 2x + 1',
    'field.name': 'Nom',
    'field.text': 'Texte',
    'style.color': 'Couleur',
    'style.width': 'Épaisseur',
    'width.1': 'Fin',
    'width.2': 'Normal',
    'width.3': 'Épais',
    'width.5': 'Très épais',
    'style.dash': 'Pointillés',
    'style.eq': 'Afficher l\'équation sur le graphique',
    'style.coords': 'Afficher les coordonnées',
    'style.fill': 'Remplir la forme',
    'style.delete': 'Supprimer',
    'menu.showEq': 'Afficher l\'équation',
    'menu.hideEq': 'Masquer l\'équation',
    'menu.showCoords': 'Afficher les coordonnées',
    'menu.hideCoords': 'Masquer les coordonnées',
    'menu.detach': 'Détacher du calcul',
    'menu.solid': 'Trait plein',
    'menu.dashed': 'Pointillés',
    'menu.rename': 'Renommer',
    'menu.duplicate': 'Dupliquer',
    'menu.delete': 'Supprimer',
    'export.copy': 'Copier l\'image',
    'export.png': 'Exporter en PNG',
    'export.pdf': 'Exporter en PDF',
    'export.link': 'Copier le lien d\'insertion',
    'notice.copied': 'Image copiée dans le presse-papiers.',
    'notice.copyFail': 'Copie impossible : %s',
    'notice.exported': 'Exporté vers %s',
    'notice.exportFail': 'Export impossible : %s',
    'notice.linkCopied': 'Lien copié. Collez-le dans une note.',
    'notice.created': 'Graphique créé : %s',
    'notice.badEquation': 'Équation invalide : %s',
    'modal.placeText': 'Texte à placer',
    'modal.objectName': 'Nom de l\'objet',
    'modal.editText': 'Modifier le texte',
    'modal.confirm': 'Valider',
    'picker.placeholder': 'Choisir un graphique à insérer',
    'hint.inter': 'Cliquez deux droites ou deux courbes.',
    'hint.poly': 'Cliquez les sommets, Entrée pour fermer.',
    'hint.shape': '%s : tracez en glissant, Maj pour conserver les proportions.',
    'hint.pickLine': 'Cliquez une droite ou une courbe.',
    'hint.picked': '%s retenu. Cliquez le deuxième objet.',
    'hint.noInter': 'Aucune intersection dans la zone visible.',
    'hint.oneInter': 'Intersection : (%s ; %s)',
    'hint.manyInter': '%s intersections placées.',
    'hint.zone': 'Zone créée.',
    'hint.computed': 'Ce point est calculé à partir de deux objets.',
    'cmd.create': 'Créer un graphique',
    'cmd.insert': 'Insérer un graphique dans la note',
    'menu.newGraph': 'Nouveau graphique',
    'embed.missingPath': 'Indiquez le chemin du graphique : file: dossier/graphique.graph',
    'embed.notFound': 'Graphique introuvable : %s',
    'embed.unreadable': 'Ce graphique ne peut pas être lu.',
    'embed.open': 'Ouvrir',
    'embed.reset': 'Recadrer',
    'set.general': 'Général',
    'set.language': 'Langue',
    'set.languageDesc': 'Langue de l\'interface du plugin.',
    'set.langAuto': 'Suivre Obsidian',
    'set.interface': 'Interface',
    'set.help': 'Textes d\'aide',
    'set.helpDesc': 'Affiche les explications et la liste des raccourcis dans le panneau latéral.',
    'set.coords': 'Position du curseur',
    'set.coordsDesc': 'Affiche les coordonnées du curseur dans la barre d\'outils.',
    'set.hints': 'Messages contextuels',
    'set.hintsDesc': 'Affiche les indications passagères pendant le tracé d\'une zone ou d\'une intersection.',
    'set.panelWidth': 'Largeur du panneau',
    'set.panelWidthDesc': 'Largeur du panneau latéral, en pixels.',
    'set.drawing': 'Tracé',
    'set.snap': 'Aimantation par défaut',
    'set.snapDesc': 'Active l\'aimant à l\'ouverture d\'un graphique. La touche ⌘ l\'ignore ponctuellement.',
    'set.color': 'Couleur par défaut',
    'set.colorDesc': 'Couleur appliquée aux nouveaux objets.',
    'set.width': 'Épaisseur par défaut',
    'set.widthDesc': 'Épaisseur des traits, des formes et des zones.',
    'set.newFiles': 'Nouveaux graphiques',
    'set.newFilesDesc': 'Ces réglages s\'appliquent aux graphiques créés ensuite. Les fichiers existants ne sont pas modifiés.',
    'set.frame': 'Repère',
    'set.frameStandard': 'Quatre quadrants',
    'set.frameQuadrant': 'Quart positif',
    'set.newGrid': 'Quadrillage',
    'set.newGridDesc': 'Affiche le quadrillage dans les nouveaux graphiques.',
    'set.newAxes': 'Axes et graduations',
    'set.newAxesDesc': 'Affiche les axes et leurs graduations dans les nouveaux graphiques.',
    'set.newScale': 'Échelle initiale',
    'set.newScaleDesc': 'Nombre de pixels par unité à l\'ouverture.',
    'set.embed': 'Aperçu dans les notes',
    'set.embedHeight': 'Hauteur de l\'aperçu',
    'set.embedHeightDesc': 'Hauteur des graphiques insérés dans une note, en pixels.',
    'set.embedButton': 'Bouton d\'ouverture',
    'set.embedButtonDesc': 'Affiche un bouton « Ouvrir » au survol d\'un aperçu.',
    'set.plainLink': 'Liens simples affichés',
    'set.plainLinkDesc': 'Un lien vers un graphique, seul sur sa ligne, s\'affiche comme un aperçu sans avoir à écrire le point d\'exclamation.',
  },
  en: {
    'view.title': 'Graph',
    'tool.select': 'Select and move',
    'tool.point': 'Point',
    'tool.seg': 'Segment',
    'tool.line': 'Line',
    'tool.arrow': 'Arrow',
    'tool.poly': 'Free shape',
    'tool.inter': 'Intersection point',
    'tool.text': 'Text',
    'tool.tangent': 'Tangent to a curve',
    'shape.rect': 'Rectangle',
    'shape.square': 'Square',
    'shape.circle': 'Circle',
    'shape.ellipse': 'Ellipse',
    'shape.tri': 'Isosceles triangle',
    'shape.tri-rect': 'Right triangle',
    'shape.diamond': 'Rhombus',
    'shape.penta': 'Pentagon',
    'shape.hexa': 'Hexagon',
    'obj.poly': 'Shape',
    'obj.ellipse': 'Circle / ellipse',
    'shapes.button': 'Shapes',
    'shapes.current': 'Active shape: %s',
    'bar.color': 'Stroke colour',
    'bar.snap': 'Snapping (grid and objects)',
    'bar.zoomOut': 'Zoom out',
    'bar.zoomIn': 'Zoom in',
    'bar.reset': 'Reset view',
    'bar.export': 'Export and share',
    'panel.curves': 'Curves',
    'panel.frame': 'Axes',
    'panel.empty': 'Select an object to edit its properties.',
    'panel.addCurve': 'Add a curve',
    'curve.toggle': 'Show or hide',
    'curve.fill': 'Shade the area under the curve',
    'curve.delete': 'Delete curve',
    'curve.placeholder': 'y = 2x + 1',
    'bounds.from': 'from',
    'bounds.to': 'to',
    'frame.grid': 'Grid',
    'frame.axes': 'Axes and ticks',
    'frame.quadrant': 'First quadrant only',
    'frame.scaleX': 'X scale',
    'frame.scaleY': 'Y scale',
    'frame.lock': 'Link scales',
    'frame.xlabel': 'horizontal axis',
    'frame.ylabel': 'vertical axis',
    'help.title': 'Shortcuts',
    'sel.slope': 'Slope a = %s',
    'sel.length': 'length %s',
    'sel.vertical': 'Vertical line',
    'sel.radius': 'Circle of radius %s',
    'sel.semiaxes': 'Semi-axes %s and %s',
    'sel.polygon': '%s vertices · area %s',
    'sel.linked': 'Intersection point, recalculated automatically.',
    'sel.detach': 'Detach',
    'sel.bound': 'Endpoint attached to a point; it follows along.',
    'sel.tangent': 'Tangent to %s at x = %s',
    'sel.rotation': 'Rotation (°)',
    'hint.tangentPick': 'Click a curve where you want the tangent.',
    'hint.tangentDone': 'Tangent at x = %s',
    'hint.tangentCurveOnly': 'Tangents apply to curves entered from the keyboard.',
    'sel.impose': 'Set an equation: y = 2x + 1',
    'field.name': 'Name',
    'field.text': 'Text',
    'style.color': 'Colour',
    'style.width': 'Thickness',
    'width.1': 'Thin',
    'width.2': 'Normal',
    'width.3': 'Thick',
    'width.5': 'Extra thick',
    'style.dash': 'Dashed',
    'style.eq': 'Show the equation on the graph',
    'style.coords': 'Show coordinates',
    'style.fill': 'Fill the shape',
    'style.delete': 'Delete',
    'menu.showEq': 'Show equation',
    'menu.hideEq': 'Hide equation',
    'menu.showCoords': 'Show coordinates',
    'menu.hideCoords': 'Hide coordinates',
    'menu.detach': 'Detach from computation',
    'menu.solid': 'Solid line',
    'menu.dashed': 'Dashed line',
    'sel.follow': 'Follow objects',
    'sel.following': '%s of %s vertices follow the geometry.',
    'menu.follow': 'Follow the geometry',
    'menu.unfollow': 'Detach from the geometry',
    'hint.anchored': 'Shape attached: %s vertices now follow.',
    'hint.notAnchored': 'No vertex sits on a line or a curve.',
    'menu.rename': 'Rename',
    'menu.duplicate': 'Duplicate',
    'menu.delete': 'Delete',
    'export.copy': 'Copy image',
    'export.png': 'Export as PNG',
    'export.pdf': 'Export as PDF',
    'export.link': 'Copy embed link',
    'notice.copied': 'Image copied to the clipboard.',
    'notice.copyFail': 'Could not copy: %s',
    'notice.exported': 'Exported to %s',
    'notice.exportFail': 'Could not export: %s',
    'notice.linkCopied': 'Link copied. Paste it into a note.',
    'notice.created': 'Graph created: %s',
    'notice.badEquation': 'Invalid equation: %s',
    'modal.placeText': 'Text to place',
    'modal.objectName': 'Object name',
    'modal.editText': 'Edit text',
    'modal.confirm': 'Confirm',
    'picker.placeholder': 'Choose a graph to insert',
    'hint.inter': 'Click two lines or curves.',
    'hint.poly': 'Click each vertex, press Enter to close.',
    'hint.shape': '%s: drag to draw, hold Shift to keep proportions.',
    'hint.pickLine': 'Click a line or a curve.',
    'hint.picked': '%s selected. Click the second object.',
    'hint.noInter': 'No intersection in the visible area.',
    'hint.oneInter': 'Intersection: (%s ; %s)',
    'hint.manyInter': '%s intersection points added.',
    'hint.zone': 'Shape created.',
    'hint.computed': 'This point is computed from two objects.',
    'cmd.create': 'Create graph',
    'cmd.insert': 'Insert a graph into the note',
    'menu.newGraph': 'New graph',
    'embed.missingPath': 'Specify the graph path: file: folder/graph.graph',
    'embed.notFound': 'Graph not found: %s',
    'embed.unreadable': 'This graph cannot be read.',
    'embed.open': 'Open',
    'embed.reset': 'Reset view',
    'set.general': 'General',
    'set.language': 'Language',
    'set.languageDesc': 'Language used by the plugin interface.',
    'set.langAuto': 'Match Obsidian',
    'set.interface': 'Interface',
    'set.help': 'Help text',
    'set.helpDesc': 'Show explanations and the shortcut list in the side panel.',
    'set.coords': 'Cursor position',
    'set.coordsDesc': 'Show the cursor coordinates in the toolbar.',
    'set.hints': 'Contextual messages',
    'set.hintsDesc': 'Show transient guidance while drawing a shape or an intersection.',
    'set.panelWidth': 'Panel width',
    'set.panelWidthDesc': 'Width of the side panel, in pixels.',
    'set.drawing': 'Drawing',
    'set.snap': 'Snapping by default',
    'set.snapDesc': 'Enable snapping when a graph opens. Hold ⌘ to bypass it temporarily.',
    'set.color': 'Default colour',
    'set.colorDesc': 'Colour applied to new objects.',
    'set.width': 'Default thickness',
    'set.widthDesc': 'Thickness of lines, shapes and areas.',
    'set.newFiles': 'New graphs',
    'set.newFilesDesc': 'These settings apply to graphs created from now on. Existing files are left untouched.',
    'set.frame': 'Coordinate system',
    'set.frameStandard': 'Four quadrants',
    'set.frameQuadrant': 'First quadrant only',
    'set.newGrid': 'Grid',
    'set.newGridDesc': 'Show the grid in new graphs.',
    'set.newAxes': 'Axes and ticks',
    'set.newAxesDesc': 'Show axes and their ticks in new graphs.',
    'set.newScale': 'Initial scale',
    'set.newScaleDesc': 'Pixels per unit when a graph opens.',
    'set.embed': 'Note previews',
    'set.embedHeight': 'Preview height',
    'set.embedHeightDesc': 'Height of graphs embedded in a note, in pixels.',
    'set.embedButton': 'Open button',
    'set.embedButtonDesc': 'Show an “Open” button when hovering a preview.',
    'set.plainLink': 'Render plain links',
    'set.plainLinkDesc': 'A link to a graph, alone on its line, renders as a preview without needing the leading exclamation mark.',
  },
};

const HELP_LINES = {
  fr: [
    'Glisser le fond : déplacer · molette : zoomer',
    'Maj + molette : zoom horizontal · ⌥ + molette : zoom vertical',
    'Clic droit sur un objet : menu contextuel',
    'Maj en traçant : horizontal, vertical ou 45°',
    'Maj sur une forme : carré ou cercle parfait',
    '⌘ en traçant : placement libre, sans aimantation',
    'Double-clic : renommer · Flèches : déplacer',
    '⌘D : dupliquer · Suppr : effacer · ⌘Z : annuler',
  ],
  en: [
    'Drag the background to pan · scroll to zoom',
    'Shift + scroll: horizontal zoom · ⌥ + scroll: vertical zoom',
    'Right-click an object for its menu',
    'Shift while drawing: horizontal, vertical or 45°',
    'Shift on a shape: perfect square or circle',
    '⌘ while drawing: free placement, no snapping',
    'Double-click to rename · Arrow keys to nudge',
    '⌘D duplicate · Del remove · ⌘Z undo',
  ],
};

function resolveLang(pref) {
  if (pref === 'fr' || pref === 'en') return pref;
  let app = '';
  try { app = window.localStorage.getItem('language') || ''; } catch (e) { app = ''; }
  return app.toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

/* Traduction. %s est remplacé par les arguments, dans l'ordre. */
function tr(key) {
  const table = STRINGS[LANG] || STRINGS.fr;
  let out = key in table ? table[key] : (STRINGS.fr[key] || key);
  for (let i = 1; i < arguments.length; i++) out = out.replace('%s', String(arguments[i]));
  return out;
}

const VIEW_TYPE = 'graphique-view';
const EXT = 'graph';

const PALETTE = ['#2d7ff9', '#e5484d', '#30a46c', '#f76808', '#8e4ec6', '#0d9488', '#d6409f'];

let uidCounter = 0;
function uid() {
  uidCounter++;
  return 'o' + Date.now().toString(36) + uidCounter.toString(36);
}

function defaultModel() {
  return {
    version: 2,
    view: { cx: 0, cy: 0, sx: 45, sy: 45 },
    style: { grid: true, axes: true, quadrant: false, lock: true, xlabel: 'x', ylabel: 'y' },
    functions: [],
    objects: [],
  };
}

/* Compatibilité : les fichiers de la version 1 n'avaient qu'une échelle. */
function migrate(m) {
  const d = defaultModel();
  const src = m || {};
  // fusion en profondeur : un fichier à qui il manque une clé garde la valeur
  // par défaut au lieu de se retrouver avec `undefined` (sx manquant = tout casse)
  const out = Object.assign({}, d, src);
  out.view = Object.assign({}, d.view, src.view || {});
  out.style = Object.assign({}, d.style, src.style || {});
  if (src.view && typeof src.view.scale === 'number') {
    if (typeof src.view.sx !== 'number') out.view.sx = src.view.scale;
    if (typeof src.view.sy !== 'number') out.view.sy = src.view.scale;
  }
  delete out.view.scale;
  if (!Array.isArray(out.functions)) out.functions = [];
  if (!Array.isArray(out.objects)) out.objects = [];
  for (const f of out.functions) if (!f.id) f.id = uid();
  for (const o of out.objects) if (!o.id) o.id = uid();
  out.version = 2;
  return out;
}

/* ================================================================== */
/*  Calcul des expressions  —  "2x^2 - 3x + 1", "sin(x)/x", "100-2x"   */
/* ================================================================== */

const FUNCS = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan,
  asin: Math.asin, acos: Math.acos, atan: Math.atan,
  sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh,
  exp: Math.exp, ln: Math.log, log: Math.log10, log2: Math.log2,
  sqrt: Math.sqrt, abs: Math.abs, sign: Math.sign,
  floor: Math.floor, ceil: Math.ceil, round: Math.round,
  min: Math.min, max: Math.max, pow: Math.pow,
};
const CONSTS = { pi: Math.PI, 'π': Math.PI, e: Math.E, tau: 2 * Math.PI };

const EXPOSANTS = { '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 };

function tokenize(src) {
  const out = [];
  const calls = [];          // pile des parenthèses : true = arguments d'une fonction
  const inCall = () => calls.length > 0 && calls[calls.length - 1];
  const digit = (ch) => ch !== undefined && ch >= '0' && ch <= '9';
  let i = 0;

  while (i < src.length) {
    const c = src[i];
    if (c === ' ' || c === '\t') { i++; continue; }

    // nombres, avec la virgule décimale française — sauf entre les arguments
    // d'une fonction, où la virgule reste un séparateur : max(1,5) fait bien deux
    if (/[0-9.]/.test(c) || (c === ',' && digit(src[i + 1]) && !inCall())) {
      let j = i, raw = '';
      while (j < src.length) {
        const d = src[j];
        if (/[0-9.]/.test(d)) { raw += d; j++; continue; }
        if (d === ',' && digit(src[j + 1]) && !inCall()) { raw += '.'; j++; continue; }
        break;
      }
      if (!/^(\d+\.?\d*|\.\d+)$/.test(raw)) throw new Error('nombre invalide « ' + raw + ' »');
      out.push({ t: 'num', v: parseFloat(raw) });
      i = j; continue;
    }

    if (/[a-zA-Zπ_]/.test(c)) {
      let j = i;
      while (j < src.length && /[a-zA-Z0-9π_]/.test(src[j])) j++;
      out.push({ t: 'id', v: src.slice(i, j) });
      i = j; continue;
    }

    if (c in EXPOSANTS) {                      // x² , x³ …
      let j = i, n = '';
      while (j < src.length && src[j] in EXPOSANTS) { n += EXPOSANTS[src[j]]; j++; }
      out.push({ t: '^' });
      out.push({ t: 'num', v: parseInt(n, 10) });
      i = j; continue;
    }

    if (c === '(') {
      const prev = out[out.length - 1];
      calls.push(!!(prev && prev.t === 'id' && prev.v.toLowerCase() in FUNCS));
      out.push({ t: '(' }); i++; continue;
    }
    if (c === ')') { calls.pop(); out.push({ t: ')' }); i++; continue; }

    if ('+-*/^,'.includes(c)) { out.push({ t: c }); i++; continue; }
    if (c === '·' || c === '×') { out.push({ t: '*' }); i++; continue; }
    if (c === '÷' || c === ':') { out.push({ t: '/' }); i++; continue; }
    if (c === '−' || c === '–') { out.push({ t: '-' }); i++; continue; }
    if (c === '√') { out.push({ t: 'id', v: 'sqrt' }); i++; continue; }
    throw new Error('caractère inattendu « ' + c + ' »');
  }
  return out;
}

/* Renvoie une fonction f(x). Lève une erreur si l'expression est invalide. */
function compile(source) {
  let src = String(source).trim();
  src = src.replace(/^\s*(y|f\s*\(\s*x\s*\))\s*=/i, '');   // accepte "y = ..." et "f(x) = ..."
  const tk = tokenize(src);
  let p = 0;

  const peek = () => tk[p];
  const eat = (t) => { if (tk[p] && tk[p].t === t) { p++; return true; } return false; };

  function parseExpr() {
    let node = parseTerm();
    for (;;) {
      if (eat('+')) { const r = parseTerm(), l = node; node = (x) => l(x) + r(x); }
      else if (eat('-')) { const r = parseTerm(), l = node; node = (x) => l(x) - r(x); }
      else return node;
    }
  }

  function parseTerm() {
    let node = parseUnary();
    for (;;) {
      if (eat('*')) { const r = parseUnary(), l = node; node = (x) => l(x) * r(x); }
      else if (eat('/')) { const r = parseUnary(), l = node; node = (x) => l(x) / r(x); }
      else if (peek() && (peek().t === 'num' || peek().t === 'id' || peek().t === '(')) {
        const r = parseUnary(), l = node;                    // multiplication implicite : 2x, 3(x+1)
        node = (x) => l(x) * r(x);
      } else return node;
    }
  }

  // le moins unaire est moins prioritaire que la puissance : -x^2 vaut -(x^2)
  function parseUnary() {
    if (eat('-')) { const v = parseUnary(); return (x) => -v(x); }
    if (eat('+')) return parseUnary();
    return parsePower();
  }

  function parsePower() {
    const base = parsePrimary();
    if (eat('^')) { const exp = parseUnary(); return (x) => Math.pow(base(x), exp(x)); }
    return base;
  }

  function parsePrimary() {
    const t = peek();
    if (!t) throw new Error('expression incomplète');
    if (t.t === 'num') { p++; return () => t.v; }
    if (t.t === '(') {
      p++;
      const v = parseExpr();
      if (!eat(')')) throw new Error('parenthèse fermante manquante');
      return v;
    }
    if (t.t === 'id') {
      p++;
      const name = t.v.toLowerCase();
      if (peek() && peek().t === '(') {
        const fn = FUNCS[name];
        if (!fn) throw new Error('fonction inconnue « ' + t.v + ' »');
        p++;
        const args = [parseExpr()];
        while (eat(',')) args.push(parseExpr());
        if (!eat(')')) throw new Error('parenthèse fermante manquante');
        return (x) => fn.apply(null, args.map((a) => a(x)));
      }
      if (name === 'x') return (x) => x;
      if (name in CONSTS) { const c = CONSTS[name]; return () => c; }
      if (name in FUNCS) {                    // √x ou sin x, sans parenthèses
        const fn = FUNCS[name];
        const arg = parseUnary();
        return (x) => fn(arg(x));
      }
      throw new Error('nom inconnu « ' + t.v + ' »');
    }
    throw new Error('expression invalide');
  }

  const f = parseExpr();
  if (p < tk.length) throw new Error('fin d\'expression inattendue');
  f(1);  // test rapide
  return f;
}

function safeCompile(expr) {
  try { return compile(expr); } catch (e) { return null; }
}

/* ================================================================== */
/*  Géométrie                                                         */
/* ================================================================== */

function niceStep(scale) {
  const raw = 80 / scale;
  const ex = Math.floor(Math.log10(raw));
  const base = raw / Math.pow(10, ex);
  const mult = base <= 1 ? 1 : base <= 2 ? 2 : base <= 5 ? 5 : 10;
  return mult * Math.pow(10, ex);
}

function fmt(n) {
  if (Math.abs(n) < 1e-10) return '0';
  const r = Math.round(n * 1e6) / 1e6;
  return String(r);
}

function round3(n) { return Math.round(n * 1000) / 1000; }

/* Équation de la droite qui porte un segment / une droite / une flèche. */
function lineEquation(o) {
  const dx = o.x2 - o.x1;
  if (Math.abs(dx) < 1e-9) return 'x = ' + fmt(round3(o.x1));
  const a = round3((o.y2 - o.y1) / dx);
  const b = round3(o.y1 - ((o.y2 - o.y1) / dx) * o.x1);
  let s = 'y = ';
  if (a === 0) return s + fmt(b);
  s += a === 1 ? 'x' : a === -1 ? '−x' : fmt(a) + 'x';
  if (b > 0) s += ' + ' + fmt(b);
  else if (b < 0) s += ' − ' + fmt(-b);
  return s;
}

function slopeOf(o) {
  const dx = o.x2 - o.x1;
  if (Math.abs(dx) < 1e-9) return null;
  return round3((o.y2 - o.y1) / dx);
}

/* Intersection de deux droites (segments prolongés). null si parallèles. */
function lineIntersection(A, B) {
  const x1 = A.x1, y1 = A.y1, x2 = A.x2, y2 = A.y2;
  const x3 = B.x1, y3 = B.y1, x4 = B.x2, y4 = B.y2;
  const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(den) < 1e-12) return null;
  const a = x1 * y2 - y1 * x2, b = x3 * y4 - y3 * x4;
  return { x: (a * (x3 - x4) - (x1 - x2) * b) / den, y: (a * (y3 - y4) - (y1 - y2) * b) / den };
}

/* Racines de g sur [x0,x1] : balayage puis bissection. */
function findRoots(g, x0, x1, samples) {
  const n = samples || 1200;
  const out = [];
  const h = (x1 - x0) / n;
  let prevX = x0, prevY = g(x0);
  for (let i = 1; i <= n && out.length < 12; i++) {
    const x = x0 + i * h;
    const y = g(x);
    if (isFinite(prevY) && isFinite(y)) {
      if (prevY === 0) out.push(prevX);
      else if (prevY * y < 0) {
        let lo = prevX, hi = x, flo = prevY;
        for (let k = 0; k < 60; k++) {
          const mid = (lo + hi) / 2, fm = g(mid);
          if (!isFinite(fm)) break;
          if (flo * fm <= 0) hi = mid; else { lo = mid; flo = fm; }
        }
        const r = (lo + hi) / 2;
        if (Math.abs(g(r)) < 1e-6 * (1 + Math.abs(r))) out.push(r);
      }
    }
    prevX = x; prevY = y;
  }
  return out;
}

/* Toutes les intersections entre deux objets — droite tracée ou courbe.
   Sert à la fois à l'outil et au recalcul permanent des points liés. */
function intersectionsOf(A, B, x0, x1) {
  if (A.kind === 'line' && B.kind === 'line') {
    const q = lineIntersection(A.o, B.o);
    return q ? [q] : [];
  }
  const toF = (P) => {
    if (P.kind === 'fn') return P.f;
    const a = slopeOf(P.o);
    if (a === null) return null;          // droite verticale : pas une fonction de x
    const b = P.o.y1 - a * P.o.x1;
    return (x) => a * x + b;
  };
  const fa = toF(A), fb = toF(B);
  if (fa && fb) {
    return findRoots((x) => fa(x) - fb(x), x0, x1).map((r) => ({ x: r, y: fa(r) }));
  }
  const vert = !fa ? A.o : B.o;           // une verticale x = c contre une courbe
  const other = !fa ? fb : fa;
  if (!vert || !other) return [];
  const y = other(vert.x1);
  return isFinite(y) ? [{ x: vert.x1, y }] : [];
}

/* Un point d'intersection garde le souvenir de ses deux parents et se
   recalcule à chaque affichage : bouger une droite déplace le point. */
function syncLinks(model, x0, x1) {
  const objById = {}, fnById = {};
  for (const o of model.objects) objById[o.id] = o;
  for (const f of model.functions) fnById[f.id] = f;

  const resolve = (id) => {
    const o = objById[id];
    if (o) return (o.t === 'seg' || o.t === 'line' || o.t === 'arrow') ? { kind: 'line', o } : undefined;
    const fn = fnById[id];
    if (fn) { const f = safeCompile(fn.expr); return f ? { kind: 'fn', f } : null; }
    return undefined;   // parent disparu
  };

  // tangentes : recalculées à partir de la fonction et de l'abscisse
  for (const o of model.objects) {
    if (!o.tangent) continue;
    const fn = fnById[o.tangent.fn];
    if (!fn) { delete o.tangent; continue; }
    const f = safeCompile(fn.expr);
    if (!f) continue;
    const a = o.tangent.x;
    const h = Math.max(1e-6, Math.abs(x1 - x0) / 100000);
    const y = f(a), pente = (f(a + h) - f(a - h)) / (2 * h);
    if (!isFinite(y) || !isFinite(pente)) continue;
    const d = Math.abs(x1 - x0) / 8 || 1;
    o.x1 = a - d; o.y1 = y - pente * d;
    o.x2 = a + d; o.y2 = y + pente * d;
  }

  for (const p of model.objects) {
    if (p.t !== 'point' || !p.link) continue;
    const A = resolve(p.link.a), B = resolve(p.link.b);
    if (A === undefined || B === undefined) { delete p.link; continue; }
    if (A === null || B === null) continue;   // expression en cours de saisie

    const q = intersectionsOf(A, B, x0, x1)[p.link.k || 0];
    if (q) { p.x = round3(q.x); p.y = round3(q.y); }
  }

  applyBindings(model);
  applyAnchors(model, x0, x1);
}

/* Sommets de zone accrochés à la géométrie : un sommet posé sur une droite y
   reste, un sommet posé sur un croisement suit le croisement. */
function applyAnchors(model, x0, x1) {
  const objById = {}, fnById = {};
  for (const o of model.objects) objById[o.id] = o;
  for (const f of model.functions) fnById[f.id] = f;

  const commeCourbe = (id) => {
    const o = objById[id];
    if (o) return (o.t === 'seg' || o.t === 'line' || o.t === 'arrow') ? { kind: 'line', o } : null;
    const fn = fnById[id];
    if (!fn) return null;
    const f = safeCompile(fn.expr);
    return f ? { kind: 'fn', f } : null;
  };

  for (const poly of model.objects) {
    if (poly.t !== 'poly' || !poly.anchors) continue;
    for (let i = 0; i < poly.pts.length; i++) {
      const a = poly.anchors[i];
      if (!a) continue;

      if (a.p) {
        const pt = objById[a.p];
        if (pt) poly.pts[i] = [pt.x, pt.y];
        continue;
      }
      if (a.i) {
        const A = commeCourbe(a.i[0]), B = commeCourbe(a.i[1]);
        if (!A || !B) continue;
        const q = intersectionsOf(A, B, x0, x1)[a.k || 0];
        if (q) poly.pts[i] = [round3(q.x), round3(q.y)];
        continue;
      }
      if (a.on) {
        const o = objById[a.on];
        if (!o) continue;
        poly.pts[i] = [round3(o.x1 + (o.x2 - o.x1) * a.t), round3(o.y1 + (o.y2 - o.y1) * a.t)];
        continue;
      }
      if (a.fn) {
        const fn = fnById[a.fn];
        if (!fn) continue;
        const f = safeCompile(fn.expr);
        if (!f) continue;
        const y = f(a.x);
        if (isFinite(y)) poly.pts[i] = [round3(a.x), round3(y)];
      }
    }
  }
}

/* Une extrémité accrochée à un point le suit. Appelé après le calcul des
   points d'intersection, donc une projection suit bien un équilibre mobile. */
function applyBindings(model) {
  const parPoint = {};
  for (const o of model.objects) if (o.t === 'point') parPoint[o.id] = o;
  for (const o of model.objects) {
    if (!o.bind) continue;
    const a = o.bind.a ? parPoint[o.bind.a] : null;
    const b = o.bind.b ? parPoint[o.bind.b] : null;
    if (o.bind.a && !a) delete o.bind.a;
    if (o.bind.b && !b) delete o.bind.b;
    if (a) { o.x1 = a.x; o.y1 = a.y; }
    if (b) { o.x2 = b.x; o.y2 = b.y; }
    if (!o.bind.a && !o.bind.b) delete o.bind;
  }
}

/* Fait tourner des sommets autour de leur centre, d'un angle en degrés. */
function rotatePoints(pts, deg) {
  const a = (deg * Math.PI) / 180;
  const cos = Math.cos(a), sin = Math.sin(a);
  let cx = 0, cy = 0;
  for (const p of pts) { cx += p[0]; cy += p[1]; }
  cx /= pts.length; cy /= pts.length;
  return pts.map((p) => {
    const dx = p[0] - cx, dy = p[1] - cy;
    return [round3(cx + dx * cos - dy * sin), round3(cy + dx * sin + dy * cos)];
  });
}

function pointInPolygon(px, py, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i][0], yi = pts[i][1], xj = pts[j][0], yj = pts[j][1];
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/* Contraint un point à l'horizontale, la verticale ou 45° depuis une origine. */
function constrain(ox, oy, x, y) {
  const dx = x - ox, dy = y - oy;
  const len = Math.hypot(dx, dy);
  if (!len) return [x, y];
  const a = Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) * (Math.PI / 4);
  return [ox + Math.cos(a) * len, oy + Math.sin(a) * len];
}

function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const len2 = dx * dx + dy * dy;
  if (!len2) return Math.hypot(px - ax, py - ay);
  let t = ((px - ax) * dx + (py - ay) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function distToLine(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const n = Math.hypot(dx, dy);
  if (!n) return Math.hypot(px - ax, py - ay);
  return Math.abs((px - ax) * dy - (py - ay) * dx) / n;
}

const OBJ_KEYS = {
  point: 'tool.point', seg: 'tool.seg', line: 'tool.line', arrow: 'tool.arrow',
  text: 'tool.text', poly: 'obj.poly', ellipse: 'obj.ellipse',
};

const SHAPES = [
  { id: 'rect', icon: 'rectangle-horizontal' },
  { id: 'square', icon: 'square' },
  { id: 'circle', icon: 'circle' },
  { id: 'ellipse', icon: 'circle' },
  { id: 'tri', icon: 'triangle' },
  { id: 'tri-rect', icon: 'triangle' },
  { id: 'diamond', icon: 'diamond' },
  { id: 'penta', icon: 'pentagon' },
  { id: 'hexa', icon: 'hexagon' },
];

/* Construit une forme à partir du rectangle tracé à la souris. Les formes
   régulières sont égalisées en pixels, pour rester régulières à l'écran même
   quand les deux échelles diffèrent. */
function shapeFrom(kind, ax, ay, bx, by, sxs, sys) {
  let dx = bx - ax, dy = by - ay;
  const regulier = kind === 'square' || kind === 'circle' || kind === 'penta' || kind === 'hexa';
  if (regulier) {
    const taille = Math.max(Math.abs(dx * sxs), Math.abs(dy * sys));
    dx = (dx < 0 ? -1 : 1) * taille / sxs;
    dy = (dy < 0 ? -1 : 1) * taille / sys;
    bx = ax + dx; by = ay + dy;
  }
  const cx = (ax + bx) / 2, cy = (ay + by) / 2;

  if (kind === 'circle' || kind === 'ellipse') {
    return { t: 'ellipse', cx, cy, rx: Math.abs(dx) / 2, ry: Math.abs(dy) / 2 };
  }

  const reguliers = { penta: 5, hexa: 6 };
  if (kind in reguliers) {
    const n = reguliers[kind];
    const R = Math.min(Math.abs(dx * sxs), Math.abs(dy * sys)) / 2;
    const pts = [];
    for (let k = 0; k < n; k++) {
      const a = Math.PI / 2 + (2 * Math.PI * k) / n;
      pts.push([cx + (R * Math.cos(a)) / sxs, cy + (R * Math.sin(a)) / sys]);
    }
    return { t: 'poly', pts };
  }

  const pts = kind === 'tri' ? [[ax, ay], [bx, ay], [cx, by]]
    : kind === 'tri-rect' ? [[ax, ay], [bx, ay], [ax, by]]
    : kind === 'diamond' ? [[cx, ay], [bx, cy], [cx, by], [ax, cy]]
    : [[ax, ay], [bx, ay], [bx, by], [ax, by]];            // rect et carré
  return { t: 'poly', pts };
}

function makeTransform(model, W, H) {
  const v = model.view;
  const q = model.style.quadrant;
  const ox = (q ? 60 : W / 2) - v.cx * v.sx;
  const oy = (q ? H - 50 : H / 2) + v.cy * v.sy;
  return {
    sxs: v.sx, sys: v.sy,
    sx: (x) => ox + x * v.sx,
    sy: (y) => oy - y * v.sy,
    wx: (px) => (px - ox) / v.sx,
    wy: (py) => (oy - py) / v.sy,
  };
}

/* ================================================================== */
/*  Dessin                                                            */
/* ================================================================== */

function draw(ctx, model, W, H, theme) {
  const T = makeTransform(model, W, H);
  const st = model.style;
  const stepX = niceStep(T.sxs), stepY = niceStep(T.sys);

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, W, H);

  const x0 = T.wx(0), x1 = T.wx(W), y0 = T.wy(H), y1 = T.wy(0);

  syncLinks(model, x0, x1);

  if (st.grid) {
    const lines = (sX, sY, alpha) => {
      ctx.strokeStyle = theme.border;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = Math.ceil(x0 / sX) * sX; x < x1; x += sX) {
        const px = Math.round(T.sx(x)) + 0.5; ctx.moveTo(px, 0); ctx.lineTo(px, H);
      }
      for (let y = Math.ceil(y0 / sY) * sY; y < y1; y += sY) {
        const py = Math.round(T.sy(y)) + 0.5; ctx.moveTo(0, py); ctx.lineTo(W, py);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    };
    lines(stepX / 5, stepY / 5, 0.4);
    lines(stepX, stepY, 1);
  }

  if (st.axes) {
    const ax = Math.round(T.sx(0)) + 0.5, ay = Math.round(T.sy(0)) + 0.5;
    ctx.strokeStyle = theme.muted;
    ctx.fillStyle = theme.muted;
    ctx.lineWidth = 1.4;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(0, ay); ctx.lineTo(W, ay);
    ctx.moveTo(ax, 0); ctx.lineTo(ax, H);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(W - 1, ay); ctx.lineTo(W - 9, ay - 4); ctx.lineTo(W - 9, ay + 4); ctx.closePath();
    ctx.moveTo(ax, 1); ctx.lineTo(ax - 4, 9); ctx.lineTo(ax + 4, 9); ctx.closePath();
    ctx.fill();

    ctx.font = '11px ' + theme.font;
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    for (let x = Math.ceil(x0 / stepX) * stepX; x < x1; x += stepX) {
      if (Math.abs(x) < 1e-9) continue;
      const px = T.sx(x);
      ctx.strokeStyle = theme.muted; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px, ay - 3); ctx.lineTo(px, ay + 3); ctx.stroke();
      ctx.fillStyle = theme.faint;
      ctx.fillText(fmt(round3(x)), px, Math.min(ay + 5, H - 14));
    }
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    for (let y = Math.ceil(y0 / stepY) * stepY; y < y1; y += stepY) {
      if (Math.abs(y) < 1e-9) continue;
      const py = T.sy(y);
      ctx.strokeStyle = theme.muted; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ax - 3, py); ctx.lineTo(ax + 3, py); ctx.stroke();
      ctx.fillStyle = theme.faint;
      ctx.fillText(fmt(round3(y)), Math.max(ax - 6, 30), py);
    }

    ctx.fillStyle = theme.text;
    ctx.font = '600 12.5px ' + theme.font;
    ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
    ctx.fillText(st.xlabel || 'x', W - 6, ay - 6);
    ctx.textAlign = 'left';
    ctx.fillText(st.ylabel || 'y', ax + 8, 16);
  }

  // aires sous les courbes (dessinées avant les traits)
  for (const fn of model.functions) {
    if (fn.visible === false || !fn.expr || !fn.fill) continue;
    const f = safeCompile(fn.expr);
    if (!f) continue;
    const from = typeof fn.from === 'number' ? Math.max(fn.from, x0) : x0;
    const to = typeof fn.to === 'number' ? Math.min(fn.to, x1) : x1;
    if (!(to > from)) continue;
    ctx.fillStyle = fn.color || PALETTE[0];
    ctx.globalAlpha = 0.16;
    ctx.beginPath();
    ctx.moveTo(T.sx(from), T.sy(0));
    for (let px = T.sx(from); px <= T.sx(to); px++) {
      const y = f(T.wx(px));
      if (isFinite(y)) ctx.lineTo(px, Math.max(-H, Math.min(2 * H, T.sy(y))));
    }
    ctx.lineTo(T.sx(to), T.sy(0));
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // courbes
  for (const fn of model.functions) {
    if (fn.visible === false || !fn.expr) continue;
    const f = safeCompile(fn.expr);
    if (!f) continue;
    ctx.strokeStyle = fn.color || PALETTE[0];
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath();
    let pen = false, prevY = null;
    for (let px = 0; px <= W; px++) {
      const x = T.wx(px);
      let y;
      try { y = f(x); } catch (e) { y = NaN; }
      if (!isFinite(y)) { pen = false; prevY = null; continue; }
      const py = T.sy(y);
      if (prevY !== null && Math.abs(py - prevY) > H * 1.5) pen = false;
      if (py < -H * 4 || py > H * 5) { pen = false; prevY = py; continue; }
      if (pen) ctx.lineTo(px, py); else { ctx.moveTo(px, py); pen = true; }
      prevY = py;
    }
    ctx.stroke();
  }

  for (const o of model.objects) drawObject(ctx, o, T, W, H, theme, false);
}

function drawObject(ctx, o, T, W, H, theme, highlight) {
  const color = o.color || theme.text;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = (o.width || 2) + (highlight ? 1.5 : 0);
  ctx.setLineDash(o.dash ? [7, 5] : []);

  if (o.t === 'ellipse') {
    const rx = Math.abs(o.rx * (T.sx(1) - T.sx(0)));
    const ry = Math.abs(o.ry * (T.sy(0) - T.sy(1)));
    ctx.beginPath();
    ctx.ellipse(T.sx(o.cx), T.sy(o.cy), Math.max(rx, 0.5), Math.max(ry, 0.5),
      ((-o.rot || 0) * Math.PI) / 180, 0, Math.PI * 2);
    if (o.fill) {
      ctx.globalAlpha = o.alpha || 0.18;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.stroke();
    ctx.setLineDash([]);
    if (highlight) {
      ctx.fillStyle = theme.select;
      for (const [hx, hy] of [[T.sx(o.cx) + rx, T.sy(o.cy)], [T.sx(o.cx), T.sy(o.cy) - ry], [T.sx(o.cx), T.sy(o.cy)]]) {
        ctx.beginPath(); ctx.arc(hx, hy, 5, 0, Math.PI * 2); ctx.fill();
      }
    }
    if (o.label) {
      ctx.fillStyle = color;
      ctx.font = '12.5px ' + theme.font;
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.fillText(o.label, T.sx(o.cx), T.sy(o.cy) - ry - 6);
    }
    return;
  }

  if (o.t === 'poly') {
    const pts = o.pts || [];
    if (pts.length < 2) { ctx.setLineDash([]); return; }
    ctx.beginPath();
    ctx.moveTo(T.sx(pts[0][0]), T.sy(pts[0][1]));
    for (let i = 1; i < pts.length; i++) ctx.lineTo(T.sx(pts[i][0]), T.sy(pts[i][1]));
    ctx.closePath();
    if (o.fill !== false) {
      ctx.globalAlpha = o.alpha || 0.18;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.stroke();
    if (highlight) {
      ctx.fillStyle = theme.select;
      for (const p of pts) { ctx.beginPath(); ctx.arc(T.sx(p[0]), T.sy(p[1]), 5, 0, Math.PI * 2); ctx.fill(); }
    }
    if (o.label) {
      let cx = 0, cy = 0;
      for (const p of pts) { cx += p[0]; cy += p[1]; }
      ctx.fillStyle = color;
      ctx.font = '12.5px ' + theme.font;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(o.label, T.sx(cx / pts.length), T.sy(cy / pts.length));
    }
    ctx.setLineDash([]);
    return;
  }

  if (o.t === 'text') {
    ctx.font = (o.size || 14) + 'px ' + theme.font;
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(o.s || '', T.sx(o.x) + 4, T.sy(o.y));
    if (highlight) {
      const w = ctx.measureText(o.s || '').width;
      ctx.strokeStyle = theme.select;
      ctx.lineWidth = 1;
      ctx.strokeRect(T.sx(o.x) + 1, T.sy(o.y) - 10, w + 7, 20);
    }
    return;
  }

  if (o.t === 'point') {
    ctx.beginPath();
    ctx.arc(T.sx(o.x), T.sy(o.y), highlight ? 6 : 4.5, 0, Math.PI * 2);
    ctx.fill();
    const cap = [o.label, o.showCoords ? '(' + fmt(round3(o.x)) + ' ; ' + fmt(round3(o.y)) + ')' : null].filter(Boolean);
    if (cap.length) {
      ctx.font = '12.5px ' + theme.font;
      ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
      cap.forEach((l, k) => ctx.fillText(l, T.sx(o.x) + 7, T.sy(o.y) - 5 + k * 15));
    }
    return;
  }

  let ax = T.sx(o.x1), ay = T.sy(o.y1), bx = T.sx(o.x2), by = T.sy(o.y2);

  if (o.t === 'line') {
    const dx = bx - ax, dy = by - ay;
    const n = Math.hypot(dx, dy) || 1;
    const k = (W + H) * 2 / n;
    const cx = ax, cy = ay;
    ax = cx - dx * k; ay = cy - dy * k;
    bx = cx + dx * k; by = cy + dy * k;
  }

  ctx.beginPath();
  ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
  ctx.stroke();
  ctx.setLineDash([]);

  if (o.t === 'arrow') {
    const a = Math.atan2(by - ay, bx - ax);
    const h = 11;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx - h * Math.cos(a - 0.4), by - h * Math.sin(a - 0.4));
    ctx.lineTo(bx - h * Math.cos(a + 0.4), by - h * Math.sin(a + 0.4));
    ctx.closePath();
    ctx.fill();
  }

  const caption = [o.label, o.showEq ? lineEquation(o) : null].filter(Boolean);
  if (caption.length) {
    ctx.font = '12.5px ' + theme.font;
    ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
    const lx = o.t === 'line' ? T.sx(o.x2) : bx;
    const ly = o.t === 'line' ? T.sy(o.y2) : by;
    caption.forEach((line, k) => ctx.fillText(line, lx + 8, ly - 6 + k * 16));
  }

  if (highlight) {
    ctx.fillStyle = theme.select;
    for (const [px, py] of [[T.sx(o.x1), T.sy(o.y1)], [T.sx(o.x2), T.sy(o.y2)]]) {
      ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
    }
  }
}

function themeOf(el) {
  const cs = getComputedStyle(el);
  const v = (n, d) => (cs.getPropertyValue(n) || '').trim() || d;
  const dark = document.body.classList.contains('theme-dark');
  return {
    bg: v('--background-primary', dark ? '#1e1e1e' : '#ffffff'),
    border: v('--background-modifier-border', dark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.11)'),
    text: v('--text-normal', dark ? '#dcddde' : '#222'),
    muted: v('--text-muted', dark ? '#999' : '#6b6b6b'),
    faint: v('--text-faint', dark ? '#666' : '#999'),
    select: v('--interactive-accent', '#5fa2ce'),
    // le canvas ne sait pas lire une variable CSS : il lui faut la police résolue
    font: (cs.fontFamily || '').trim() || '-apple-system, BlinkMacSystemFont, sans-serif',
  };
}

/* Thème clair figé, pour les exports : un PDF noir, ce serait dommage. */
const PRINT_THEME = {
  bg: '#ffffff',
  border: 'rgba(0,0,0,0.13)',
  text: '#1a1a1a',
  muted: '#5a5a5a',
  faint: '#8c8c8c',
  select: '#5fa2ce',
  font: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
};

/* ================================================================== */
/*  Export : PNG et PDF (JPEG encapsulé, sans dépendance)             */
/* ================================================================== */

function renderToCanvas(model, W, H, scale) {
  const c = document.createElement('canvas');
  c.width = Math.round(W * scale);
  c.height = Math.round(H * scale);
  const ctx = c.getContext('2d');
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  draw(ctx, model, W, H, PRINT_THEME);
  return c;
}

function dataUrlToBytes(url) {
  const bin = atob(url.split(',')[1]);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

/* Un PDF d'une page contenant l'image. Écrit à la main : pas de bibliothèque. */
function buildPdf(jpegBytes, imgW, imgH) {
  const pageW = 792;
  const pageH = Math.round((pageW * imgH) / imgW);
  const chunks = [];
  const offsets = [];
  let length = 0;

  const push = (s) => {
    const bytes = typeof s === 'string' ? Uint8Array.from(s, (ch) => ch.charCodeAt(0) & 0xff) : s;
    chunks.push(bytes);
    length += bytes.length;
  };
  const obj = (n, body) => { offsets[n] = length; push(n + ' 0 obj\n' + body + '\nendobj\n'); };

  push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
  obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
  obj(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  obj(3, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + pageW + ' ' + pageH + ']' +
        ' /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>');

  offsets[4] = length;
  push('4 0 obj\n<< /Type /XObject /Subtype /Image /Width ' + imgW + ' /Height ' + imgH +
       ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + jpegBytes.length + ' >>\nstream\n');
  push(jpegBytes);
  push('\nendstream\nendobj\n');

  const content = 'q\n' + pageW + ' 0 0 ' + pageH + ' 0 0 cm\n/Im0 Do\nQ\n';
  obj(5, '<< /Length ' + content.length + ' >>\nstream\n' + content + 'endstream');

  const xref = length;
  let table = 'xref\n0 6\n0000000000 65535 f \n';
  for (let i = 1; i <= 5; i++) table += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  push(table);
  push('trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF\n');

  const out = new Uint8Array(length);
  let at = 0;
  for (const c of chunks) { out.set(c, at); at += c.length; }
  return out;
}

/* ================================================================== */
/*  Petites fenêtres                                                  */
/* ================================================================== */

class AskModal extends Modal {
  constructor(app, title, value, onSubmit) {
    super(app);
    this.title = title; this.value = value || ''; this.onSubmit = onSubmit;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('h3', { text: this.title });
    const input = contentEl.createEl('input', { type: 'text', value: this.value });
    input.style.width = '100%';
    const row = contentEl.createDiv({ cls: 'modal-button-container' });
    const ok = row.createEl('button', { text: tr('modal.confirm'), cls: 'mod-cta' });
    const submit = () => { this.close(); this.onSubmit(input.value); };
    ok.onclick = submit;
    input.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); submit(); } };
    window.setTimeout(() => { input.focus(); input.select(); }, 10);
  }
  onClose() { this.contentEl.empty(); }
}

class GraphPickerModal extends FuzzySuggestModal {
  constructor(app, onChoose) {
    super(app);
    this.onChoose = onChoose;
    this.setPlaceholder(tr('picker.placeholder'));
  }
  getItems() { return this.app.vault.getFiles().filter((f) => f.extension === EXT); }
  getItemText(f) { return f.path; }
  onChooseItem(f) { this.onChoose(f); }
}

/* ================================================================== */
/*  La vue « graphique »                                              */
/* ================================================================== */

const TOOLS = [
  { id: 'select', icon: 'mouse-pointer-2', label: '↖' },
  { id: 'point', icon: 'circle-dot', label: '•' },
  { id: 'seg', icon: 'minus', label: '—' },
  { id: 'line', icon: 'move-diagonal', label: '╱' },
  { id: 'arrow', icon: 'arrow-up-right', label: '→' },
  { id: 'poly', icon: 'triangle', label: '▰' },
  { id: 'inter', icon: 'crosshair', label: '⨯' },
  { id: 'text', icon: 'type', label: 'T' },
  { id: 'tangent', icon: 'spline', label: '∂' },
];

/* Bouton d'icône façon Obsidian. Si le nom d'icône n'existe pas dans la version
   installée, on retombe sur le caractère plutôt que sur un bouton vide. */
function iconButton(parent, icon, fallback, title, cls) {
  const b = parent.createEl('button', { cls: cls || 'graphique-btn', attr: { title, 'aria-label': title } });
  try { setIcon(b, icon); } catch (e) { /* icône inconnue */ }
  if (!b.querySelector('svg')) b.setText(fallback);
  return b;
}

class GraphiqueView extends TextFileView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.model = defaultModel();
    this.tool = 'select';
    this.color = SETTINGS.defaultColor || PALETTE[0];
    this.snap = SETTINGS.snapDefault !== false;
    this.selected = -1;
    this.history = [];
    this.built = false;
    this.shape = 'rect';      // forme géométrique en cours dans le menu
    this.pending = null;      // premier objet cliqué pour une intersection
    this.polyDraft = null;    // zone en cours de tracé
  }

  getViewType() { return VIEW_TYPE; }
  getIcon() { return 'line-chart'; }
  getDisplayText() { return this.file ? this.file.basename : tr('view.title'); }

  getViewData() { return JSON.stringify(this.model, null, 1); }

  setViewData(data) {
    let m = null;
    try { m = data && data.trim() ? JSON.parse(data) : null; } catch (e) { m = null; }
    this.model = migrate(m);
    this.selected = -1;
    this.pending = null;
    this.polyDraft = null;
    this.build();
    this.refresh();
  }

  clear() { this.model = defaultModel(); }

  async onOpen() { this.build(); }
  onResize() { this.redraw(); }

  /* ---------------- interface ---------------- */

  build() {
    if (this.built) return;
    const root = this.contentEl;
    root.empty();
    root.addClass('graphique-root');
    root.style.setProperty('--graphique-panel-width', (SETTINGS.panelWidth || 250) + 'px');

    const bar = root.createDiv({ cls: 'graphique-toolbar' });
    this.toolButtons = {};
    for (const t of TOOLS) {
      const b = iconButton(bar, t.icon, t.label, tr('tool.' + t.id));
      b.onclick = () => { this.setTool(t.id); };
      this.toolButtons[t.id] = b;
    }

    this.shapeBtn = iconButton(bar, 'square', '◻', tr('shapes.button'));
    this.shapeBtn.onclick = (e) => this.shapeMenu(e);
    this.toolButtons.shape = this.shapeBtn;
    this.syncShapeButton();

    bar.createSpan({ cls: 'graphique-sep' });

    const colorInput = bar.createEl('input', { type: 'color', cls: 'graphique-swatch', attr: { title: tr('bar.color') } });
    colorInput.value = this.color;
    colorInput.onchange = () => { this.color = colorInput.value; };

    const snapBtn = iconButton(bar, 'grid', '⌗', tr('bar.snap'));
    const syncSnap = () => snapBtn.toggleClass('is-active', this.snap);
    snapBtn.onclick = () => { this.snap = !this.snap; syncSnap(); };
    syncSnap();

    bar.createSpan({ cls: 'graphique-sep' });

    const mk = (icon, fallback, title, fn) => { iconButton(bar, icon, fallback, title).onclick = fn; };
    mk('zoom-out', '−', tr('bar.zoomOut'), () => this.zoomBy(1 / 1.25));
    mk('zoom-in', '+', tr('bar.zoomIn'), () => this.zoomBy(1.25));
    mk('locate-fixed', '⌂', tr('bar.reset'), () => { this.model.view = Object.assign({}, defaultModel().view); this.touch(); this.buildPanel(); });
    mk('download', '⇩', tr('bar.export'), (e) => this.exportMenu(e));

    if (SETTINGS.showCoords) this.status = bar.createSpan({ cls: 'graphique-coords' });

    const body = root.createDiv({ cls: 'graphique-body' });
    this.panel = body.createDiv({ cls: 'graphique-panel' });
    const stage = body.createDiv({ cls: 'graphique-stage' });
    this.canvas = stage.createEl('canvas');

    this.buildPanel();
    this.syncTools();
    this.bindCanvas();
    this.built = true;

    this.registerDomEvent(window, 'resize', () => this.redraw());
    this.registerDomEvent(root, 'keydown', (e) => this.onKey(e));
    root.tabIndex = 0;
  }

  setTool(id) {
    this.tool = id;
    this.pending = null;
    if (this.polyDraft) this.closePolygon();
    this.syncTools();
    this.hint(id === 'inter' ? tr('hint.inter') : id === 'poly' ? tr('hint.poly') : '');
  }

  /* Le bouton des formes porte l'icône de la forme choisie. */
  syncShapeButton() {
    if (!this.shapeBtn) return;
    const sh = SHAPES.find((x) => x.id === this.shape) || SHAPES[0];
    this.shapeBtn.empty();
    try { setIcon(this.shapeBtn, sh.icon); } catch (e) { /* icône inconnue */ }
    if (!this.shapeBtn.querySelector('svg')) this.shapeBtn.setText('◻');
    this.shapeBtn.setAttr('title', tr('shapes.current', tr('shape.' + sh.id)));
  }

  shapeMenu(e) {
    const menu = new Menu();
    for (const sh of SHAPES) {
      menu.addItem((it) => it
        .setTitle(tr('shape.' + sh.id))
        .setIcon(sh.icon)
        .setChecked(this.tool === 'shape' && this.shape === sh.id)
        .onClick(() => {
          this.shape = sh.id;
          this.tool = 'shape';
          this.pending = null;
          if (this.polyDraft) this.closePolygon();
          this.syncShapeButton();
          this.syncTools();
          this.hint(tr('hint.shape', tr('shape.' + sh.id)));
        }));
    }
    menu.showAtMouseEvent(e);
  }

  syncTools() {
    for (const id in this.toolButtons) this.toolButtons[id].toggleClass('is-active', id === this.tool);
    this.syncCursor();
  }

  syncCursor(overObject) {
    if (!this.canvas) return;
    if (this.tool !== 'select') { this.canvas.style.cursor = 'crosshair'; return; }
    this.canvas.style.cursor = overObject ? 'move' : 'grab';
  }

  hint(text) {
    if (!SETTINGS.showHints) return;
    this.hintText = text;
    this.hintAt = Date.now();
    if (this.status) this.status.setText(text || '');
  }

  /* Reconstruit l'interface après un changement de réglages. */
  rebuildUI() {
    this.built = false;
    this.contentEl.empty();
    this.color = SETTINGS.defaultColor || this.color;
    this.build();
    this.refresh();
  }

  buildPanel() {
    const p = this.panel;
    p.empty();

    this.selEl = p.createDiv({ cls: 'graphique-selection' });
    this.renderSelection();

    p.createEl('div', { cls: 'graphique-panel-title', text: tr('panel.curves') });
    const list = p.createDiv({ cls: 'graphique-fn-list' });

    this.model.functions.forEach((fn, i) => {
      const row = list.createDiv({ cls: 'graphique-fn' });

      const eye = iconButton(row, fn.visible === false ? 'eye-off' : 'eye',
        fn.visible === false ? '○' : '●', tr('curve.toggle'), 'graphique-mini');
      eye.onclick = () => { fn.visible = fn.visible === false; this.touch(); this.buildPanel(); };

      const col = row.createEl('input', { type: 'color', cls: 'graphique-swatch' });
      col.value = fn.color || PALETTE[i % PALETTE.length];
      col.onchange = () => { fn.color = col.value; this.touch(); };

      const input = row.createEl('input', { type: 'text', cls: 'graphique-fn-input' });
      input.value = fn.expr || '';
      input.placeholder = tr('curve.placeholder');
      const check = () => {
        if (!input.value.trim()) { input.removeClass('is-error'); return; }
        try { compile(input.value); input.removeClass('is-error'); input.title = ''; }
        catch (e) { input.addClass('is-error'); input.title = e.message; }
      };
      input.oninput = () => { fn.expr = input.value; check(); this.touch(); };
      check();

      const fill = iconButton(row, 'paint-bucket', '▒', tr('curve.fill'), 'graphique-mini');
      fill.toggleClass('is-active', !!fn.fill);
      fill.onclick = () => { fn.fill = !fn.fill; this.touch(); this.buildPanel(); };

      const del = iconButton(row, 'x', '×', tr('curve.delete'), 'graphique-mini');
      del.onclick = () => { this.pushHistory(); this.model.functions.splice(i, 1); this.touch(); this.buildPanel(); };

      if (fn.fill) {
        const bounds = list.createDiv({ cls: 'graphique-bounds' });
        bounds.createEl('label', { text: tr('bounds.from') });
        const a = bounds.createEl('input', { type: 'number' });
        a.step = 'any'; a.value = typeof fn.from === 'number' ? String(fn.from) : '';
        a.placeholder = '−∞';
        a.onchange = () => { const v = parseFloat(a.value); fn.from = isFinite(v) ? v : undefined; this.touch(); };
        bounds.createEl('label', { text: tr('bounds.to') });
        const b = bounds.createEl('input', { type: 'number' });
        b.step = 'any'; b.value = typeof fn.to === 'number' ? String(fn.to) : '';
        b.placeholder = '+∞';
        b.onchange = () => { const v = parseFloat(b.value); fn.to = isFinite(v) ? v : undefined; this.touch(); };
      }
    });

    const add = p.createEl('button', { cls: 'graphique-add', text: tr('panel.addCurve') });
    add.onclick = () => {
      this.pushHistory();
      this.model.functions.push({ id: uid(), expr: '', color: PALETTE[this.model.functions.length % PALETTE.length], visible: true });
      this.touch(); this.buildPanel();
      const inputs = this.panel.querySelectorAll('.graphique-fn-input');
      if (inputs.length) inputs[inputs.length - 1].focus();
    };

    p.createEl('div', { cls: 'graphique-panel-title', text: tr('panel.frame') });

    const opt = (label, key) => {
      const row = p.createDiv({ cls: 'graphique-opt' });
      const cb = row.createEl('input', { type: 'checkbox' });
      cb.checked = !!this.model.style[key];
      cb.onchange = () => { this.model.style[key] = cb.checked; this.touch(); };
      row.createEl('label', { text: label });
    };
    opt(tr('frame.grid'), 'grid');
    opt(tr('frame.axes'), 'axes');
    opt(tr('frame.quadrant'), 'quadrant');

    // échelles séparées
    const sc = p.createDiv({ cls: 'graphique-scales' });
    const mkScale = (axis, title) => {
      const cell = sc.createDiv({ cls: 'graphique-scale' });
      cell.createEl('label', { text: title });
      const inp = cell.createEl('input', { type: 'number' });
      inp.step = 'any';
      inp.value = String(Math.round(this.model.view[axis] * 100) / 100);
      inp.onchange = () => {
        const v = parseFloat(inp.value);
        if (!(v > 0.01)) return;
        const ratio = v / this.model.view[axis];
        this.model.view[axis] = v;
        if (this.model.style.lock) this.model.view[axis === 'sx' ? 'sy' : 'sx'] *= ratio;
        this.touch(); this.buildPanel();
      };
    };
    mkScale('sx', tr('frame.scaleX'));
    mkScale('sy', tr('frame.scaleY'));

    const lockRow = p.createDiv({ cls: 'graphique-opt' });
    const lockCb = lockRow.createEl('input', { type: 'checkbox' });
    lockCb.checked = !!this.model.style.lock;
    lockCb.onchange = () => { this.model.style.lock = lockCb.checked; this.touch(); };
    lockRow.createEl('label', { text: tr('frame.lock') });

    const names = p.createDiv({ cls: 'graphique-axis-names' });
    const xi = names.createEl('input', { type: 'text' });
    xi.value = this.model.style.xlabel || '';
    xi.placeholder = tr('frame.xlabel');
    xi.oninput = () => { this.model.style.xlabel = xi.value; this.touch(); };
    const yi = names.createEl('input', { type: 'text' });
    yi.value = this.model.style.ylabel || '';
    yi.placeholder = tr('frame.ylabel');
    yi.oninput = () => { this.model.style.ylabel = yi.value; this.touch(); };

    if (SETTINGS.showHelp) {
      const help = p.createEl('details', { cls: 'graphique-help' });
      help.createEl('summary', { text: tr('help.title') });
      const hint = help.createDiv({ cls: 'graphique-hint' });
      (HELP_LINES[LANG] || HELP_LINES.fr).forEach((ligne) => hint.createEl('div', { text: ligne }));
    }
  }

  renderSelection() {
    const box = this.selEl;
    if (!box) return;
    box.empty();

    const o = this.model.objects[this.selected];
    if (!o) {
      if (SETTINGS.showHelp) box.createDiv({ cls: 'graphique-selection-empty', text: tr('panel.empty') });
      return;
    }

    box.createEl('div', { cls: 'graphique-panel-title', text: tr(OBJ_KEYS[o.t] || 'obj.poly') });

    const isLine = o.t === 'seg' || o.t === 'line' || o.t === 'arrow';

    if (o.tangent) {
      const fn = this.model.functions.find((f) => f.id === o.tangent.fn);
      box.createDiv({ cls: 'graphique-sub' })
        .setText(tr('sel.tangent', fn ? fn.expr : '?', fmt(round3(o.tangent.x))));
      const row = box.createDiv({ cls: 'graphique-field' });
      row.createEl('label', { text: 'x' });
      const xi = row.createEl('input', { type: 'number' });
      xi.step = 'any'; xi.value = String(round3(o.tangent.x));
      xi.onchange = () => {
        const v = parseFloat(xi.value);
        if (!isFinite(v)) return;
        this.pushHistory(); o.tangent.x = v; this.touch(); this.renderSelection();
      };
      const libre = box.createEl('button', { cls: 'graphique-add', text: tr('sel.detach') });
      libre.onclick = () => { this.pushHistory(); delete o.tangent; this.touch(); this.renderSelection(); };
    }

    if (o.bind) {
      box.createDiv({ cls: 'graphique-sub' }).setText(tr('sel.bound'));
      const libre = box.createEl('button', { cls: 'graphique-add', text: tr('sel.detach') });
      libre.onclick = () => { this.pushHistory(); delete o.bind; this.touch(); this.renderSelection(); };
    }

    if (isLine) {
      box.createDiv({ cls: 'graphique-eq' }).createSpan({ text: lineEquation(o) });
      const a = slopeOf(o);
      box.createDiv({ cls: 'graphique-sub' }).setText(a === null
        ? tr('sel.vertical')
        : tr('sel.slope', fmt(a)) +
          (o.t === 'seg' ? ' · ' + tr('sel.length', fmt(Math.round(Math.hypot(o.x2 - o.x1, o.y2 - o.y1) * 100) / 100)) : ''));

      const eqIn = box.createEl('input', { type: 'text', cls: 'graphique-eq-input' });
      if (o.tangent) eqIn.disabled = true;
      eqIn.placeholder = tr('sel.impose');
      eqIn.onkeydown = (ev) => {
        if (ev.key !== 'Enter') return;
        ev.preventDefault();
        let f;
        try { f = compile(eqIn.value); } catch (err) { new Notice(tr('notice.badEquation', err.message)); return; }
        this.pushHistory();
        if (Math.abs(o.x2 - o.x1) < 1e-9) { o.x1 -= 1; o.x2 += 1; }
        o.y1 = f(o.x1); o.y2 = f(o.x2);
        eqIn.value = '';
        this.touch(); this.renderSelection();
      };
    }

    if (o.t === 'ellipse') {
      const rond = Math.abs(o.rx - o.ry) < 1e-9;
      box.createDiv({ cls: 'graphique-sub' }).setText(
        rond ? tr('sel.radius', fmt(round3(o.rx))) : tr('sel.semiaxes', fmt(round3(o.rx)), fmt(round3(o.ry))));
    }

    if (o.t === 'poly') {
      const pts = o.pts || [];
      let area = 0;
      for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        area += (pts[j][0] * pts[i][1] - pts[i][0] * pts[j][1]);
      }
      box.createDiv({ cls: 'graphique-sub' })
        .setText(tr('sel.polygon', pts.length, fmt(Math.round(Math.abs(area / 2) * 100) / 100)));

      if (o.anchors) {
        const suivis = o.anchors.filter(Boolean).length;
        box.createDiv({ cls: 'graphique-sub' }).setText(tr('sel.following', suivis, pts.length));
      }
      const suivre = box.createEl('button', {
        cls: 'graphique-add',
        text: o.anchors ? tr('menu.unfollow') : tr('sel.follow'),
      });
      suivre.onclick = () => this.toggleAnchors(o);
    }

    const num = (label, get, set) => {
      const row = box.createDiv({ cls: 'graphique-field' });
      row.createEl('label', { text: label });
      const inp = row.createEl('input', { type: 'number' });
      inp.value = String(round3(get()));
      inp.step = 'any';
      inp.onchange = () => {
        const v = parseFloat(inp.value);
        if (!isFinite(v)) return;
        this.pushHistory(); set(v); this.touch(); this.renderSelection();
      };
    };

    if (o.t === 'ellipse') {
      num('cx', () => o.cx, (v) => { o.cx = v; });
      num('cy', () => o.cy, (v) => { o.cy = v; });
      num('rx', () => o.rx, (v) => { o.rx = Math.abs(v); });
      num('ry', () => o.ry, (v) => { o.ry = Math.abs(v); });
    } else if (o.t === 'point' && o.link) {
      box.createDiv({ cls: 'graphique-eq' })
        .createSpan({ text: '(' + fmt(round3(o.x)) + ' ; ' + fmt(round3(o.y)) + ')' });
      box.createDiv({ cls: 'graphique-sub' }).setText(tr('sel.linked'));
      const free = box.createEl('button', { cls: 'graphique-add', text: tr('sel.detach') });
      free.onclick = () => {
        this.pushHistory();
        delete o.link;
        this.touch(); this.renderSelection();
      };
    } else if (o.t === 'point' || o.t === 'text') {
      num('x', () => o.x, (v) => { o.x = v; });
      num('y', () => o.y, (v) => { o.y = v; });
    } else if (isLine) {
      num('x₁', () => o.x1, (v) => { o.x1 = v; });
      num('y₁', () => o.y1, (v) => { o.y1 = v; });
      num('x₂', () => o.x2, (v) => { o.x2 = v; });
      num('y₂', () => o.y2, (v) => { o.y2 = v; });
    }

    if (o.t === 'poly' || o.t === 'ellipse') {
      const rot = box.createDiv({ cls: 'graphique-field' });
      rot.createEl('label', { text: tr('sel.rotation') });
      const ri = rot.createEl('input', { type: 'number' });
      ri.step = '5';
      ri.value = String(round3(o.rot || 0));
      ri.onchange = () => {
        const v = parseFloat(ri.value);
        if (!isFinite(v)) return;
        this.pushHistory();
        if (o.t === 'poly') o.pts = rotatePoints(o.pts, v - (o.rot || 0));
        o.rot = v;
        this.touch(); this.redraw();
      };
    }

    const textRow = box.createDiv({ cls: 'graphique-field' });
    textRow.createEl('label', { text: o.t === 'text' ? tr('field.text') : tr('field.name') });
    const ti = textRow.createEl('input', { type: 'text' });
    ti.value = (o.t === 'text' ? o.s : o.label) || '';
    ti.oninput = () => { if (o.t === 'text') o.s = ti.value; else o.label = ti.value; this.touch(); };

    const style = box.createDiv({ cls: 'graphique-style-row' });
    const col = style.createEl('input', { type: 'color', cls: 'graphique-swatch', attr: { title: tr('style.color') } });
    col.value = o.color || PALETTE[0];
    col.onchange = () => { o.color = col.value; this.touch(); };

    if (o.t === 'poly' || o.t === 'ellipse') {
      const fillBtn = style.createEl('button', { cls: 'graphique-toggle', text: '▨', attr: { title: tr('style.fill') } });
      fillBtn.toggleClass('is-active', o.fill !== false);
      fillBtn.onclick = () => {
        o.fill = o.fill === false;
        fillBtn.toggleClass('is-active', o.fill !== false);
        this.touch();
      };
    }

    if (isLine || o.t === 'poly' || o.t === 'ellipse') {
      const w = style.createEl('select', { attr: { title: tr('style.width') } });
      ['1', '2', '3', '5'].forEach((v) => {
        const op = w.createEl('option', { text: tr('width.' + v) }); op.value = v;
      });
      w.value = String(o.width || 2);
      w.onchange = () => { o.width = parseInt(w.value, 10); this.touch(); };

      const dash = style.createEl('button', { cls: 'graphique-toggle', text: '┄', attr: { title: tr('style.dash') } });
      dash.toggleClass('is-active', !!o.dash);
      dash.onclick = () => { o.dash = !o.dash; dash.toggleClass('is-active', !!o.dash); this.touch(); };
    }

    if (isLine) {
      const eqBtn = style.createEl('button', { cls: 'graphique-toggle', text: 'f(x)', attr: { title: tr('style.eq') } });
      eqBtn.toggleClass('is-active', !!o.showEq);
      eqBtn.onclick = () => { o.showEq = !o.showEq; eqBtn.toggleClass('is-active', !!o.showEq); this.touch(); };
    }

    if (o.t === 'point') {
      const cBtn = style.createEl('button', { cls: 'graphique-toggle', text: '(x;y)', attr: { title: tr('style.coords') } });
      cBtn.toggleClass('is-active', !!o.showCoords);
      cBtn.onclick = () => { o.showCoords = !o.showCoords; cBtn.toggleClass('is-active', !!o.showCoords); this.touch(); };
    }

    const del = iconButton(style, 'trash-2', '×', tr('style.delete'), 'graphique-toggle graphique-danger');
    del.onclick = () => {
      this.pushHistory();
      this.model.objects.splice(this.selected, 1);
      this.selected = -1;
      this.touch(); this.renderSelection();
    };
  }

  select(i) {
    this.selected = i;
    this.renderSelection();
    this.redraw();
  }

  objectMenu(e, index) {
    const o = this.model.objects[index];
    const menu = new Menu();
    const isLine = o.t === 'seg' || o.t === 'line' || o.t === 'arrow';

    if (isLine) {
      menu.addItem((it) => it.setTitle(lineEquation(o)).setIcon('function-square').setDisabled(true));
      menu.addItem((it) => it.setTitle(tr(o.showEq ? 'menu.hideEq' : 'menu.showEq'))
        .setIcon('eye').onClick(() => { this.pushHistory(); o.showEq = !o.showEq; this.touch(); this.renderSelection(); }));
    }
    if (o.t === 'point') {
      menu.addItem((it) => it.setTitle('(' + fmt(round3(o.x)) + ' ; ' + fmt(round3(o.y)) + ')').setDisabled(true));
      menu.addItem((it) => it.setTitle(tr(o.showCoords ? 'menu.hideCoords' : 'menu.showCoords'))
        .setIcon('eye').onClick(() => { this.pushHistory(); o.showCoords = !o.showCoords; this.touch(); this.renderSelection(); }));
      if (o.link) {
        menu.addItem((it) => it.setTitle(tr('menu.detach')).setIcon('unlink')
          .onClick(() => { this.pushHistory(); delete o.link; this.touch(); this.renderSelection(); }));
      }
    }
    if (o.t === 'poly') {
      menu.addItem((it) => it
        .setTitle(tr(o.anchors ? 'menu.unfollow' : 'menu.follow'))
        .setIcon(o.anchors ? 'unlink' : 'link')
        .onClick(() => this.toggleAnchors(o)));
    }
    if (isLine || o.t === 'poly' || o.t === 'ellipse') {
      menu.addItem((it) => it.setTitle(tr(o.dash ? 'menu.solid' : 'menu.dashed'))
        .setIcon('minus').onClick(() => { this.pushHistory(); o.dash = !o.dash; this.touch(); this.renderSelection(); }));
    }
    menu.addSeparator();
    menu.addItem((it) => it.setTitle(tr('menu.rename')).setIcon('pencil').onClick(() => {
      new AskModal(this.app, tr('modal.objectName'), (o.t === 'text' ? o.s : o.label) || '', (s) => {
        this.pushHistory();
        if (o.t === 'text') o.s = s; else o.label = s;
        this.touch(); this.renderSelection();
      }).open();
    }));
    menu.addItem((it) => it.setTitle(tr('menu.duplicate')).setIcon('copy').onClick(() => this.duplicate(index)));
    menu.addSeparator();
    menu.addItem((it) => it.setTitle(tr('menu.delete')).setIcon('trash').onClick(() => {
      this.pushHistory();
      this.model.objects.splice(index, 1);
      this.selected = -1;
      this.touch(); this.renderSelection();
    }));
    menu.showAtMouseEvent(e);
  }

  exportMenu(e) {
    const menu = new Menu();
    menu.addItem((it) => it.setTitle(tr('export.copy')).setIcon('image').onClick(() => this.copyImage()));
    menu.addItem((it) => it.setTitle(tr('export.png')).setIcon('file-image').onClick(() => this.exportFile('png')));
    menu.addItem((it) => it.setTitle(tr('export.pdf')).setIcon('file-text').onClick(() => this.exportFile('pdf')));
    menu.addSeparator();
    menu.addItem((it) => it.setTitle(tr('export.link')).setIcon('link').onClick(() => {
      if (!this.file) return;
      navigator.clipboard.writeText('![[' + this.file.path + ']]');
      new Notice(tr('notice.linkCopied'));
    }));
    menu.showAtMouseEvent(e);
  }

  duplicate(index) {
    const o = this.model.objects[index];
    if (!o) return;
    this.pushHistory();
    const c = JSON.parse(JSON.stringify(o));
    c.id = uid();
    delete c.link;                       // une copie n'est plus une intersection calculée
    const dx = niceStep(this.model.view.sx) / 2;
    const dy = niceStep(this.model.view.sy) / 2;
    if (c.t === 'ellipse') { c.cx += dx; c.cy -= dy; }
    else if (c.t === 'poly') c.pts = c.pts.map((p) => [p[0] + dx, p[1] - dy]);
    else if (c.t === 'point' || c.t === 'text') { c.x += dx; c.y -= dy; }
    else { c.x1 += dx; c.y1 -= dy; c.x2 += dx; c.y2 -= dy; }
    this.model.objects.push(c);
    this.selected = this.model.objects.length - 1;
    this.touch(); this.renderSelection();
  }

  /* ---------------- intersections ---------------- */

  /* Un "objet cliquable" pour l'intersection : droite tracée ou courbe. */
  pickCurve(e) {
    const hit = this.hitTest(e);
    if (hit) {
      const o = this.model.objects[hit.index];
      if (o.t === 'seg' || o.t === 'line' || o.t === 'arrow') return { kind: 'line', o, id: o.id, name: lineEquation(o) };
      return null;
    }
    const rect = this.canvas.getBoundingClientRect();
    const T = makeTransform(this.model, rect.width, rect.height);
    const px = e.clientX - rect.left, py = e.clientY - rect.top;
    for (const fn of this.model.functions) {
      if (fn.visible === false || !fn.expr) continue;
      const f = safeCompile(fn.expr);
      if (!f) continue;
      for (let d = -6; d <= 6; d++) {
        const y = f(T.wx(px + d));
        if (isFinite(y) && Math.abs(T.sy(y) - py) < 7) return { kind: 'fn', f, id: fn.id, name: fn.expr };
      }
    }
    return null;
  }

  handleIntersection(e) {
    const pick = this.pickCurve(e);
    if (!pick) { this.hint(tr('hint.pickLine')); return; }

    if (!this.pending) {
      this.pending = pick;
      this.hint(tr('hint.picked', pick.name));
      return;
    }

    const A = this.pending, B = pick;
    this.pending = null;
    const rect = this.canvas.getBoundingClientRect();
    const T = makeTransform(this.model, rect.width, rect.height);
    const x0 = T.wx(0), x1 = T.wx(rect.width);
    const pts = intersectionsOf(A, B, x0, x1);

    if (!pts.length) { this.hint(tr('hint.noInter')); return; }

    this.pushHistory();
    pts.forEach((p, k) => {
      this.model.objects.push({
        t: 'point', id: uid(), x: round3(p.x), y: round3(p.y),
        color: this.color, showCoords: true,
        link: { a: A.id, b: B.id, k },
      });
    });
    this.selected = this.model.objects.length - 1;
    this.touch();
    this.renderSelection();
    this.hint(pts.length === 1
      ? tr('hint.oneInter', fmt(round3(pts[0].x)), fmt(round3(pts[0].y)))
      : tr('hint.manyInter', pts.length));
  }

  /* Trace la tangente à une courbe au point cliqué. Elle reste liée : changer
     l'expression ou l'abscisse la replace. */
  handleTangent(e, x) {
    const pick = this.pickCurve(e);
    if (!pick) { this.hint(tr('hint.tangentPick')); return; }
    if (pick.kind !== 'fn') { this.hint(tr('hint.tangentCurveOnly')); return; }
    this.pushHistory();
    this.model.objects.push({
      t: 'line', id: uid(), color: this.color, width: SETTINGS.defaultWidth,
      dash: true, showEq: true,
      tangent: { fn: pick.id, x: round3(x) },
      x1: x - 1, y1: 0, x2: x + 1, y2: 0,
    });
    this.selected = this.model.objects.length - 1;
    this.touch();
    this.renderSelection();
    this.hint(tr('hint.tangentDone', fmt(round3(x))));
  }

  /* Cherche, pour chaque sommet d'une zone, ce sur quoi il est posé :
     un point, un croisement de deux objets, une droite, ou une courbe. */
  anchorPolygon(o) {
    const rect = this.canvas.getBoundingClientRect();
    const T = makeTransform(this.model, rect.width, rect.height);
    const x0 = T.wx(0), x1 = T.wx(rect.width);
    const tol = 6;
    const anchors = [];
    let n = 0;

    const descripteur = (id) => {
      const q = this.model.objects.find((z) => z.id === id);
      if (q) return { kind: 'line', o: q };
      const fn = this.model.functions.find((z) => z.id === id);
      const f = fn && safeCompile(fn.expr);
      return f ? { kind: 'fn', f } : null;
    };

    for (const [wx, wy] of o.pts) {
      const px = T.sx(wx), py = T.sy(wy);

      const pt = this.model.objects.find((q) =>
        q.t === 'point' && Math.hypot(T.sx(q.x) - px, T.sy(q.y) - py) < 9);
      if (pt) { anchors.push({ p: pt.id }); n++; continue; }

      const lignes = [];
      for (const q of this.model.objects) {
        if (q === o || (q.t !== 'seg' && q.t !== 'line' && q.t !== 'arrow')) continue;
        const ax = T.sx(q.x1), ay = T.sy(q.y1), bx = T.sx(q.x2), by = T.sy(q.y2);
        const d = q.t === 'line' ? distToLine(px, py, ax, ay, bx, by) : distToSegment(px, py, ax, ay, bx, by);
        if (d < tol) lignes.push(q.id);
      }
      const courbes = [];
      for (const fn of this.model.functions) {
        if (fn.visible === false || !fn.expr) continue;
        const f = safeCompile(fn.expr);
        if (!f) continue;
        const y = f(wx);
        if (isFinite(y) && Math.abs(T.sy(y) - py) < tol) courbes.push(fn.id);
      }

      const ids = lignes.concat(courbes);
      if (ids.length >= 2) {
        const A = descripteur(ids[0]), B = descripteur(ids[1]);
        const pts = A && B ? intersectionsOf(A, B, x0, x1) : [];
        let k = 0, mieux = Infinity;
        pts.forEach((q, idx) => {
          const d = Math.hypot(q.x - wx, q.y - wy);
          if (d < mieux) { mieux = d; k = idx; }
        });
        if (pts.length) { anchors.push({ i: [ids[0], ids[1]], k }); n++; continue; }
      }
      if (lignes.length === 1) {
        const q = this.model.objects.find((z) => z.id === lignes[0]);
        const dx = q.x2 - q.x1, dy = q.y2 - q.y1;
        const len2 = dx * dx + dy * dy;
        anchors.push({ on: q.id, t: len2 ? ((wx - q.x1) * dx + (wy - q.y1) * dy) / len2 : 0 });
        n++; continue;
      }
      if (courbes.length === 1) { anchors.push({ fn: courbes[0], x: wx }); n++; continue; }

      anchors.push(null);
    }
    return { anchors, n };
  }

  toggleAnchors(o) {
    if (o.anchors) {
      this.pushHistory();
      delete o.anchors;
      this.touch(); this.renderSelection();
      return;
    }
    const res = this.anchorPolygon(o);
    if (!res.n) { this.hint(tr('hint.notAnchored')); return; }
    this.pushHistory();
    o.anchors = res.anchors;
    this.touch(); this.renderSelection();
    this.hint(tr('hint.anchored', res.n));
  }

  /* ---------------- zones ---------------- */

  closePolygon() {
    const d = this.polyDraft;
    this.polyDraft = null;
    this.polyCursor = null;
    if (!d || d.pts.length < 3) { this.redraw(); return; }
    this.pushHistory();
    this.model.objects.push({ t: 'poly', id: uid(), pts: d.pts, color: d.color, width: SETTINGS.defaultWidth, fill: true, alpha: 0.18 });
    this.selected = this.model.objects.length - 1;
    this.touch();
    this.renderSelection();
    this.hint(tr('hint.zone'));
  }

  /* ---------------- souris ---------------- */

  bindCanvas() {
    const c = this.canvas;

    this.registerDomEvent(c, 'contextmenu', (e) => {
      e.preventDefault();
      const hit = this.hitTest(e);
      if (hit && !this.panned) { this.select(hit.index); this.objectMenu(e, hit.index); }
    });

    this.registerDomEvent(c, 'pointerdown', (e) => {
      c.setPointerCapture(e.pointerId);
      this.contentEl.focus({ preventScroll: true });   // sinon Suppr et ⌘Z ne reçoivent rien
      const [x, y] = this.pos(e);

      if (e.button === 2 || e.button === 1 || e.altKey) {
        this.panned = false;
        if (e.button === 2 && this.hitTest(e)) return;
        this.drag = { mode: 'pan', px: e.clientX, py: e.clientY, cx: this.model.view.cx, cy: this.model.view.cy };
        this.canvas.style.cursor = 'grabbing';
        return;
      }

      if (this.tool === 'inter') { this.handleIntersection(e); return; }

      if (this.tool === 'tangent') { this.handleTangent(e, x); return; }

      if (this.tool === 'poly') {
        if (!this.polyDraft) this.polyDraft = { pts: [], color: this.color };
        const first = this.polyDraft.pts[0];
        const v = this.model.view;
        const closeEnough = first && Math.hypot((x - first[0]) * v.sx, (y - first[1]) * v.sy) < 10;
        if (closeEnough && this.polyDraft.pts.length > 2) {
          this.closePolygon();
        } else {
          this.polyDraft.pts.push([x, y]);
          this.redraw();
        }
        return;
      }

      if (this.tool === 'select') {
        const hit = this.hitTest(e);
        this.select(hit ? hit.index : -1);
        if (hit) {
          this.pushHistory();
          this.drag = {
            mode: 'move', part: hit.part, x0: x, y0: y,
            snapshot: JSON.parse(JSON.stringify(this.model.objects[hit.index])),
          };
        } else {
          this.drag = { mode: 'pan', px: e.clientX, py: e.clientY, cx: this.model.view.cx, cy: this.model.view.cy };
          this.canvas.style.cursor = 'grabbing';
        }
        return;
      }

      if (this.tool === 'shape') {
        this.pushHistory();
        const v = this.model.view;
        this.model.objects.push(Object.assign(
          { id: uid(), color: this.color, width: SETTINGS.defaultWidth, fill: false },
          shapeFrom(this.shape, x, y, x, y, v.sx, v.sy)));
        this.selected = this.model.objects.length - 1;
        this.drag = { mode: 'shape', ax: x, ay: y };
        return;
      }

      if (this.tool === 'point') {
        this.pushHistory();
        this.model.objects.push({ t: 'point', id: uid(), x, y, color: this.color });
        this.selected = this.model.objects.length - 1;
        this.touch(); this.renderSelection();
        return;
      }

      if (this.tool === 'text') {
        new AskModal(this.app, tr('modal.placeText'), '', (s) => {
          if (!s) return;
          this.pushHistory();
          this.model.objects.push({ t: 'text', id: uid(), x, y, s, color: this.color });
          this.selected = this.model.objects.length - 1;
          this.touch(); this.renderSelection();
        }).open();
        return;
      }

      this.pushHistory();
      this.model.objects.push({ t: this.tool, id: uid(), x1: x, y1: y, x2: x, y2: y, color: this.color, width: SETTINGS.defaultWidth });
      this.selected = this.model.objects.length - 1;
      this.drag = { mode: 'draw', bindA: this.pointUnderCursor() };
    });

    this.registerDomEvent(c, 'pointermove', (e) => {
      const moving = this.drag && this.selected >= 0 ? this.model.objects[this.selected] : null;
      const [x, y] = this.pos(e, moving ? moving.id : null);
      // le message d'aide s'efface au bout de quelques secondes, les coordonnées reprennent
      if (this.status && (!this.hintText || Date.now() - (this.hintAt || 0) > 4000)) {
        this.hintText = '';
        this.status.setText('x = ' + fmt(Math.round(x * 100) / 100) + '   y = ' + fmt(Math.round(y * 100) / 100));
      }

      if (this.polyDraft) { this.polyCursor = [x, y]; this.redraw(); return; }

      if (!this.drag) {
        if (this.tool === 'select') this.syncCursor(!!this.hitTest(e));
        return;
      }

      if (this.drag.mode === 'pan') {
        this.panned = true;
        this.model.view.cx = this.drag.cx - (e.clientX - this.drag.px) / this.model.view.sx;
        this.model.view.cy = this.drag.cy + (e.clientY - this.drag.py) / this.model.view.sy;
        this.redraw();
        return;
      }

      const o = this.model.objects[this.selected];
      if (!o) return;

      if (this.drag.mode === 'shape') {
        const v = this.model.view;
        let kind = this.shape;
        if (e.shiftKey) kind = kind === 'rect' ? 'square' : kind === 'ellipse' ? 'circle' : kind;
        const frais = shapeFrom(kind, this.drag.ax, this.drag.ay, x, y, v.sx, v.sy);
        delete o.pts; delete o.cx; delete o.cy; delete o.rx; delete o.ry;
        Object.assign(o, frais);
        this.redraw();
        return;
      }

      if (this.drag.mode === 'draw') {
        const [px2, py2] = e.shiftKey ? constrain(o.x1, o.y1, x, y) : [x, y];
        o.x2 = px2; o.y2 = py2;
        this.redraw();
        return;
      }

      if (this.drag.mode === 'move') {
        if (o.link || o.tangent) { this.hint(tr('hint.computed')); return; }
        if (o.anchors && o.anchors.some(Boolean)) { this.hint(tr('hint.computed')); return; }
        const dx = x - this.drag.x0, dy = y - this.drag.y0;
        const s = this.drag.snapshot;
        const part = this.drag.part || 'all';

        if (o.t === 'ellipse') {
          if (part === 'rx') o.rx = Math.abs(x - o.cx);
          else if (part === 'ry') o.ry = Math.abs(y - o.cy);
          else { o.cx = this.snapX(s.cx + dx); o.cy = this.snapY(s.cy + dy); }
        } else if (part[0] === 'v' && o.t === 'poly') {          // un sommet de zone
          o.pts[parseInt(part.slice(1), 10)] = [x, y];
        } else if (o.t === 'poly') {
          o.pts = s.pts.map((q) => [this.snapX(q[0] + dx), this.snapY(q[1] + dy)]);
        } else if (part === 'a') {
          const [nx, ny] = e.shiftKey ? constrain(o.x2, o.y2, x, y) : [x, y];
          o.x1 = nx; o.y1 = ny;
        } else if (part === 'b') {
          const [nx, ny] = e.shiftKey ? constrain(o.x1, o.y1, x, y) : [x, y];
          o.x2 = nx; o.y2 = ny;
        } else if (o.t === 'point' || o.t === 'text') {
          o.x = this.snapX(s.x + dx); o.y = this.snapY(s.y + dy);
        } else {
          o.x1 = this.snapX(s.x1 + dx); o.y1 = this.snapY(s.y1 + dy);
          o.x2 = this.snapX(s.x2 + dx); o.y2 = this.snapY(s.y2 + dy);
        }
        this.redraw();
      }
    });

    this.registerDomEvent(c, 'pointerup', () => {
      this.syncCursor();
      if (this.drag && this.drag.mode === 'pan') { this.drag = null; this.saveLater(); return; }
      if (this.drag) {
        const wasDraw = this.drag.mode === 'draw';
        const o = this.model.objects[this.selected];
        if (o && (o.t === 'seg' || o.t === 'line' || o.t === 'arrow') && !o.tangent) {
          if (wasDraw) {
            this.setBinding(o, 'a', this.drag.bindA);
            this.setBinding(o, 'b', this.pointUnderCursor());
          } else if (this.drag.mode === 'move' && (this.drag.part === 'a' || this.drag.part === 'b')) {
            this.setBinding(o, this.drag.part, this.pointUnderCursor());
          }
        }
        const v = this.model.view;
        const minuscule = () => {
          if (!o) return false;
          if (wasDraw) return Math.hypot((o.x2 - o.x1) * v.sx, (o.y2 - o.y1) * v.sy) < 4;
          if (this.drag.mode !== 'shape') return false;
          if (o.t === 'ellipse') return Math.abs(o.rx * v.sx) < 3 && Math.abs(o.ry * v.sy) < 3;
          const xs = o.pts.map((q) => q[0] * v.sx), ys = o.pts.map((q) => q[1] * v.sy);
          return (Math.max(...xs) - Math.min(...xs)) < 4 && (Math.max(...ys) - Math.min(...ys)) < 4;
        };
        if (minuscule()) {
          this.model.objects.splice(this.selected, 1);
          this.selected = -1;
        }
        this.drag = null;
        this.touch();
        this.renderSelection();
      }
    });

    this.registerDomEvent(c, 'dblclick', (e) => {
      if (this.polyDraft) { this.closePolygon(); return; }
      const hit = this.hitTest(e);
      if (!hit) return;
      const o = this.model.objects[hit.index];
      const current = o.t === 'text' ? o.s : (o.label || '');
      new AskModal(this.app, tr(o.t === 'text' ? 'modal.editText' : 'modal.objectName'), current, (s) => {
        this.pushHistory();
        if (o.t === 'text') o.s = s; else o.label = s;
        this.touch(); this.renderSelection();
      }).open();
    });

    this.registerDomEvent(c, 'wheel', (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const T = makeTransform(this.model, rect.width, rect.height);
      const wx = T.wx(e.clientX - rect.left), wy = T.wy(e.clientY - rect.top);
      const k = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      const v = this.model.view;
      const onlyX = e.shiftKey, onlyY = e.altKey;
      if (!onlyY) v.sx = Math.min(20000, Math.max(0.05, v.sx * k));
      if (!onlyX) v.sy = Math.min(20000, Math.max(0.05, v.sy * k));
      const T2 = makeTransform(this.model, rect.width, rect.height);
      v.cx += wx - T2.wx(e.clientX - rect.left);
      v.cy += wy - T2.wy(e.clientY - rect.top);
      this.redraw();
      this.saveLater();
    }, { passive: false });
  }

  pos(e, excludeId) {
    const rect = this.canvas.getBoundingClientRect();
    const T = makeTransform(this.model, rect.width, rect.height);
    const px = e.clientX - rect.left, py = e.clientY - rect.top;
    const wx = T.wx(px), wy = T.wy(py);

    if (e.metaKey || e.ctrlKey) {          // ⌘ : placement totalement libre
      this.magnetHint = null;
      return [round3(wx), round3(wy)];
    }
    const m = this.snap ? this.magnet(px, py, T, excludeId) : null;
    if (m) { this.magnetHint = m; return [round3(m.x), round3(m.y)]; }
    this.magnetHint = null;
    return [this.snapX(wx), this.snapY(wy)];
  }

  /* Cherche de quoi accrocher le curseur : sommet, droite, puis courbe.
     Un sommet l'emporte toujours sur un simple bord. */
  magnet(px, py, T, excludeId) {
    const R = 12;
    let best = null;

    const vertex = (wx, wy, kind, id) => {
      const d = Math.hypot(T.sx(wx) - px, T.sy(wy) - py);
      if (d <= R && (!best || d < best.d)) best = { x: wx, y: wy, kind, d, id };
    };
    for (const o of this.model.objects) {
      if (o.id === excludeId) continue;
      if (o.t === 'point') vertex(o.x, o.y, 'point', o.id);
      else if (o.t === 'ellipse') vertex(o.cx, o.cy, 'centre');
      else if (o.t === 'poly') for (const q of (o.pts || [])) vertex(q[0], q[1], 'sommet');
      else if (o.t === 'seg' || o.t === 'line' || o.t === 'arrow') {
        vertex(o.x1, o.y1, 'extrémité'); vertex(o.x2, o.y2, 'extrémité');
      }
    }
    if (best) return best;                 // un sommet proche gagne

    for (const o of this.model.objects) {
      if (o.id === excludeId) continue;
      if (o.t !== 'seg' && o.t !== 'line' && o.t !== 'arrow') continue;
      const ax = T.sx(o.x1), ay = T.sy(o.y1), bx = T.sx(o.x2), by = T.sy(o.y2);
      const dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy;
      if (!len2) continue;
      let t = ((px - ax) * dx + (py - ay) * dy) / len2;
      if (o.t !== 'line') t = Math.max(0, Math.min(1, t));
      const qx = ax + t * dx, qy = ay + t * dy;
      const d = Math.hypot(qx - px, qy - py);
      if (d <= R && (!best || d < best.d)) best = { x: T.wx(qx), y: T.wy(qy), kind: 'droite', d };
    }

    for (const fn of this.model.functions) {
      if (fn.visible === false || !fn.expr) continue;
      const f = safeCompile(fn.expr);
      if (!f) continue;
      const y = f(T.wx(px));
      if (!isFinite(y)) continue;
      const d = Math.abs(T.sy(y) - py);
      if (d <= R && (!best || d < best.d)) best = { x: T.wx(px), y, kind: 'courbe', d };
    }
    return best;
  }

  snapX(v) {
    if (!this.snap) return round3(v);
    const s = niceStep(this.model.view.sx) / 5;
    return Math.round(v / s) * s;
  }

  snapY(v) {
    if (!this.snap) return round3(v);
    const s = niceStep(this.model.view.sy) / 5;
    return Math.round(v / s) * s;
  }

  hitTest(e) {
    const rect = this.canvas.getBoundingClientRect();
    const T = makeTransform(this.model, rect.width, rect.height);
    const px = e.clientX - rect.left, py = e.clientY - rect.top;

    for (let i = this.model.objects.length - 1; i >= 0; i--) {
      const o = this.model.objects[i];

      if (o.t === 'ellipse') {
        const ex = T.sx(o.cx), ey = T.sy(o.cy);
        const rx = Math.abs(o.rx * (T.sx(1) - T.sx(0)));
        const ry = Math.abs(o.ry * (T.sy(0) - T.sy(1)));
        if (Math.hypot(px - (ex + rx), py - ey) < 9) return { index: i, part: 'rx' };
        if (Math.hypot(px - ex, py - (ey - ry)) < 9) return { index: i, part: 'ry' };
        if (rx > 1 && ry > 1) {
          let ux = px - ex, uy = py - ey;
          if (o.rot) {                       // on annule la rotation avant de tester
            const a = ((-o.rot) * Math.PI) / 180;
            const c = Math.cos(-a), s2 = Math.sin(-a);
            const nx = ux * c - uy * s2, ny = ux * s2 + uy * c;
            ux = nx; uy = ny;
          }
          const k = Math.hypot(ux / rx, uy / ry);
          if (Math.abs(k - 1) * Math.min(rx, ry) < 8) return { index: i, part: 'all' };
          if (o.fill && k < 1) return { index: i, part: 'all' };
        }
        continue;
      }
      if (o.t === 'poly') {
        const pts = (o.pts || []).map((p) => [T.sx(p[0]), T.sy(p[1])]);
        for (let k = 0; k < pts.length; k++) {
          if (Math.hypot(pts[k][0] - px, pts[k][1] - py) < 9) return { index: i, part: 'v' + k };
        }
        if (pts.length > 2 && pointInPolygon(px, py, pts)) return { index: i, part: 'all' };
        continue;
      }
      if (o.t === 'point' || o.t === 'text') {
        const d = Math.hypot(T.sx(o.x) - px, T.sy(o.y) - py);
        if (o.t === 'point' && d < 9) return { index: i, part: 'all' };
        if (o.t === 'text' && px > T.sx(o.x) && px < T.sx(o.x) + 8 * (o.s || '').length + 12 && Math.abs(T.sy(o.y) - py) < 12)
          return { index: i, part: 'all' };
        continue;
      }
      const ax = T.sx(o.x1), ay = T.sy(o.y1), bx = T.sx(o.x2), by = T.sy(o.y2);
      if (Math.hypot(ax - px, ay - py) < 9) return { index: i, part: 'a' };
      if (Math.hypot(bx - px, by - py) < 9) return { index: i, part: 'b' };
      if (distToSegment(px, py, ax, ay, bx, by) < 7) return { index: i, part: 'all' };
      if (o.t === 'line' && distToLine(px, py, ax, ay, bx, by) < 7) return { index: i, part: 'all' };
    }
    return null;
  }

  onKey(e) {
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (this.polyDraft && (e.key === 'Enter' || e.key === 'Escape')) {
      e.preventDefault();
      if (e.key === 'Escape') { this.polyDraft = null; this.polyCursor = null; this.redraw(); }
      else this.closePolygon();
      return;
    }

    if ((e.key === 'Delete' || e.key === 'Backspace') && this.selected >= 0) {
      e.preventDefault();
      this.pushHistory();
      this.model.objects.splice(this.selected, 1);
      this.selected = -1;
      this.touch(); this.renderSelection();
    } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault(); this.undo();
    } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
      e.preventDefault();
      if (this.selected >= 0) this.duplicate(this.selected);
    } else if (e.key.startsWith('Arrow') && this.selected >= 0) {
      e.preventDefault();
      const o = this.model.objects[this.selected];
      if (o.link) { this.hint(tr('hint.computed')); return; }
      const dX = niceStep(this.model.view.sx) / (e.shiftKey ? 1 : 5);
      const dY = niceStep(this.model.view.sy) / (e.shiftKey ? 1 : 5);
      const dx = (e.key === 'ArrowRight' ? dX : e.key === 'ArrowLeft' ? -dX : 0);
      const dy = (e.key === 'ArrowUp' ? dY : e.key === 'ArrowDown' ? -dY : 0);
      this.pushHistory();
      if (o.t === 'ellipse') { o.cx += dx; o.cy += dy; }
      else if (o.t === 'poly') o.pts = o.pts.map((p) => [p[0] + dx, p[1] + dy]);
      else if (o.t === 'point' || o.t === 'text') { o.x += dx; o.y += dy; }
      else { o.x1 += dx; o.y1 += dy; o.x2 += dx; o.y2 += dy; }
      this.touch(); this.renderSelection();
    } else if (e.key === 'Escape') {
      this.pending = null;
      this.select(-1);
    }
  }

  /* Identifiant du point sous le curseur, si l'aimant vient de s'y accrocher. */
  pointUnderCursor() {
    const m = this.magnetHint;
    return m && m.kind === 'point' && m.id ? m.id : null;
  }

  /* Accroche ou détache une extrémité selon ce que l'aimant a attrapé. */
  setBinding(o, extremite, pointId) {
    if (!o) return;
    if (pointId) {
      o.bind = o.bind || {};
      o.bind[extremite] = pointId;
    } else if (o.bind) {
      delete o.bind[extremite];
      if (!o.bind.a && !o.bind.b) delete o.bind;
    }
  }

  /* ---------------- rendu et sauvegarde ---------------- */

  redraw() {
    if (!this.canvas) return;
    const stage = this.canvas.parentElement;
    const W = stage.clientWidth, H = stage.clientHeight;
    if (W < 2 || H < 2) return;
    const dpr = window.devicePixelRatio || 1;
    const cw = Math.round(W * dpr), ch = Math.round(H * dpr);
    if (this.canvas.width !== cw || this.canvas.height !== ch) {
      this.canvas.width = cw;
      this.canvas.height = ch;
      this.canvas.style.width = W + 'px';
      this.canvas.style.height = H + 'px';
    }
    const ctx = this.canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const theme = themeOf(this.containerEl);
    draw(ctx, this.model, W, H, theme);

    const T = makeTransform(this.model, W, H);

    if (this.selected >= 0 && this.model.objects[this.selected]) {
      drawObject(ctx, this.model.objects[this.selected], T, W, H, theme, true);
    }

    const panning = this.drag && this.drag.mode === 'pan';
    if (this.magnetHint && !panning && (this.tool !== 'select' || this.drag)) {
      const m = this.magnetHint;
      ctx.strokeStyle = theme.select;
      ctx.lineWidth = 1.6;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(T.sx(m.x), T.sy(m.y), 7, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (this.polyDraft && this.polyDraft.pts.length) {
      const pts = this.polyDraft.pts;
      ctx.strokeStyle = this.polyDraft.color;
      ctx.fillStyle = this.polyDraft.color;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(T.sx(pts[0][0]), T.sy(pts[0][1]));
      for (let i = 1; i < pts.length; i++) ctx.lineTo(T.sx(pts[i][0]), T.sy(pts[i][1]));
      if (this.polyCursor) ctx.lineTo(T.sx(this.polyCursor[0]), T.sy(this.polyCursor[1]));
      ctx.stroke();
      ctx.setLineDash([]);
      for (const p of pts) { ctx.beginPath(); ctx.arc(T.sx(p[0]), T.sy(p[1]), 4, 0, Math.PI * 2); ctx.fill(); }
    }
  }

  refresh() { this.buildPanel(); this.redraw(); }

  /* 🔴 Ne JAMAIS nommer cette méthode save() : TextFileView mémorise une version
     différée de sa propre save() à la construction, et une méthode de même nom
     dans la sous-classe la remplace. La minuterie appelait alors la nôtre, qui
     redemandait une sauvegarde, sans que rien ne soit jamais écrit. */
  touch() {
    this.redraw();
    this.requestSave();
  }

  saveLater() {
    window.clearTimeout(this._t);
    this._t = window.setTimeout(() => this.requestSave(), 400);
  }

  pushHistory() {
    this.history.push(JSON.stringify({ functions: this.model.functions, objects: this.model.objects }));
    if (this.history.length > 60) this.history.shift();
  }

  undo() {
    const prev = this.history.pop();
    if (!prev) return;
    const s = JSON.parse(prev);
    this.model.functions = s.functions;
    this.model.objects = s.objects;
    this.selected = -1;
    this.refresh();
    this.requestSave();
  }

  zoomBy(k) {
    const v = this.model.view;
    v.sx = Math.min(20000, Math.max(0.05, v.sx * k));
    v.sy = Math.min(20000, Math.max(0.05, v.sy * k));
    this.touch();
    this.buildPanel();
  }

  async copyImage() {
    try {
      const stage = this.canvas.parentElement;
      const clean = renderToCanvas(this.model, stage.clientWidth, stage.clientHeight, 2);
      const blob = await new Promise((res) => clean.toBlob(res, 'image/png'));
      await navigator.clipboard.write([new window.ClipboardItem({ 'image/png': blob })]);
      new Notice(tr('notice.copied'));
    } catch (e) {
      new Notice(tr('notice.copyFail', e.message));
    }
  }

  async exportFile(kind) {
    try {
      const stage = this.canvas.parentElement;
      const W = stage.clientWidth, H = stage.clientHeight;
      const c = renderToCanvas(this.model, W, H, 2);
      const base = (this.file ? this.file.path.replace(/\.graph$/, '') : 'graphique');
      let path, bytes;

      if (kind === 'png') {
        path = base + '.png';
        bytes = dataUrlToBytes(c.toDataURL('image/png'));
      } else {
        path = base + '.pdf';
        bytes = buildPdf(dataUrlToBytes(c.toDataURL('image/jpeg', 0.92)), c.width, c.height);
      }

      const existing = this.app.vault.getAbstractFileByPath(path);
      if (existing) await this.app.vault.modifyBinary(existing, bytes.buffer);
      else await this.app.vault.createBinary(path, bytes.buffer);
      new Notice(tr('notice.exported', path));
    } catch (e) {
      new Notice(tr('notice.exportFail', e.message));
    }
  }
}

/* ================================================================== */
/*  Aperçu d'un graphique dans une note                               */
/* ================================================================== */

/* Aperçu d'un graphique dans une note. Avec ⌘ (ou Ctrl) enfoncé, on peut
   déplacer et zoomer sans ouvrir le fichier : le cadrage reste local à
   l'aperçu, le fichier n'est jamais modifié. */
function renderPreview(app, file, container, height) {
  const wrap = container.createDiv({ cls: 'graphique-embed' });
  const canvas = wrap.createEl('canvas');
  const barre = wrap.createDiv({ cls: 'graphique-embed-actions' });

  let modele = null;         // relu depuis le disque
  let cadrage = null;        // cadrage local, null tant qu'on n'a rien bougé
  let boutonReset = null;

  if (SETTINGS.embedOpenButton) {
    const open = barre.createEl('button', { cls: 'graphique-embed-open', text: tr('embed.open') });
    open.onclick = (e) => { e.preventDefault(); app.workspace.getLeaf(true).openFile(file); };
  }

  const dessiner = () => {
    if (!modele) return;
    const W = wrap.clientWidth || 600, H = height || SETTINGS.embedHeight || 380;
    const dpr = window.devicePixelRatio || 1;
    const cw = Math.round(W * dpr), ch = Math.round(H * dpr);
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw; canvas.height = ch;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const vue = cadrage ? Object.assign({}, modele, { view: cadrage }) : modele;
    draw(ctx, vue, W, H, themeOf(container));
  };

  const majReset = () => {
    if (cadrage && !boutonReset) {
      boutonReset = barre.createEl('button', { cls: 'graphique-embed-open', text: tr('embed.reset') });
      boutonReset.onclick = (e) => {
        e.preventDefault();
        cadrage = null;
        boutonReset.remove(); boutonReset = null;
        dessiner();
      };
    }
  };

  const cadrageCourant = () => {
    if (!cadrage) cadrage = Object.assign({}, modele.view);
    return cadrage;
  };

  const modif = (e) => e.metaKey || e.ctrlKey;   // ⌘ sur Mac, Ctrl ailleurs

  canvas.addEventListener('pointerdown', (e) => {
    if (!modif(e) || !modele || e.button !== 0) return;
    e.preventDefault();
    const v = cadrageCourant();
    const depart = { px: e.clientX, py: e.clientY, cx: v.cx, cy: v.cy };
    canvas.setPointerCapture(e.pointerId);
    canvas.addClass('is-panning');

    const bouge = (ev) => {
      v.cx = depart.cx - (ev.clientX - depart.px) / v.sx;
      v.cy = depart.cy + (ev.clientY - depart.py) / v.sy;
      dessiner();
    };
    const fini = () => {
      canvas.removeEventListener('pointermove', bouge);
      canvas.removeEventListener('pointerup', fini);
      canvas.removeClass('is-panning');
      majReset();
    };
    canvas.addEventListener('pointermove', bouge);
    canvas.addEventListener('pointerup', fini);
  });

  canvas.addEventListener('wheel', (e) => {
    if (!modif(e) || !modele) return;            // sinon la note défile normalement
    e.preventDefault();
    const v = cadrageCourant();
    const rect = canvas.getBoundingClientRect();
    const W = rect.width, H = rect.height;
    const avant = makeTransform({ view: v, style: modele.style }, W, H);
    const wx = avant.wx(e.clientX - rect.left), wy = avant.wy(e.clientY - rect.top);
    const k = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    v.sx = Math.min(20000, Math.max(0.05, v.sx * k));
    v.sy = Math.min(20000, Math.max(0.05, v.sy * k));
    const apres = makeTransform({ view: v, style: modele.style }, W, H);
    v.cx += wx - apres.wx(e.clientX - rect.left);
    v.cy += wy - apres.wy(e.clientY - rect.top);
    dessiner();
    majReset();
  }, { passive: false });

  // le curseur annonce qu'on peut attraper le graphique
  const survol = (e) => canvas.toggleClass('is-grabbable', modif(e));
  canvas.addEventListener('pointermove', survol);
  canvas.addEventListener('pointerleave', () => canvas.removeClass('is-grabbable'));

  const paint = async () => {
    try { modele = migrate(JSON.parse(await app.vault.cachedRead(file))); }
    catch (e) { wrap.setText(tr('embed.unreadable')); return; }
    dessiner();
  };
  paint();
  window.setTimeout(dessiner, 60);
  return paint;
}

/* ================================================================== */

/* ================================================================== */
/*  Onglet de réglages                                                */
/* ================================================================== */

class GraphiquesSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();

    const enregistrer = () => this.plugin.saveSettings();
    const titre = (nom, desc) => {
      const s = new Setting(containerEl).setName(nom).setHeading();
      if (desc) s.setDesc(desc);
    };
    const ligne = (nom, desc) => {
      const s = new Setting(containerEl).setName(nom);
      if (desc) s.setDesc(desc);
      return s;
    };
    const bascule = (cle, nom, desc) => ligne(nom, desc).addToggle((c) => c
      .setValue(SETTINGS[cle] !== false)
      .onChange(async (v) => { SETTINGS[cle] = v; await enregistrer(); }));

    titre(tr('set.general'));

    ligne(tr('set.language'), tr('set.languageDesc')).addDropdown((d) => d
      .addOptions({ fr: 'Français', en: 'English', auto: tr('set.langAuto') })
      .setValue(SETTINGS.language)
      .onChange(async (v) => {
        SETTINGS.language = v;
        await enregistrer();
        this.display();
      }));

    titre(tr('set.interface'));

    bascule('showHelp', tr('set.help'), tr('set.helpDesc'));
    bascule('showCoords', tr('set.coords'), tr('set.coordsDesc'));
    bascule('showHints', tr('set.hints'), tr('set.hintsDesc'));

    ligne(tr('set.panelWidth'), tr('set.panelWidthDesc')).addSlider((sl) => sl
      .setLimits(200, 400, 10)
      .setValue(SETTINGS.panelWidth)
      .setDynamicTooltip()
      .onChange(async (v) => { SETTINGS.panelWidth = v; await enregistrer(); }));

    titre(tr('set.drawing'));

    bascule('snapDefault', tr('set.snap'), tr('set.snapDesc'));

    ligne(tr('set.color'), tr('set.colorDesc')).addColorPicker((c) => c
      .setValue(SETTINGS.defaultColor)
      .onChange(async (v) => { SETTINGS.defaultColor = v; await enregistrer(); }));

    ligne(tr('set.width'), tr('set.widthDesc')).addDropdown((d) => d
      .addOptions({ 1: tr('width.1'), 2: tr('width.2'), 3: tr('width.3'), 5: tr('width.5') })
      .setValue(String(SETTINGS.defaultWidth))
      .onChange(async (v) => { SETTINGS.defaultWidth = parseInt(v, 10); await enregistrer(); }));

    titre(tr('set.newFiles'), tr('set.newFilesDesc'));

    ligne(tr('set.frame')).addDropdown((d) => d
      .addOptions({ standard: tr('set.frameStandard'), quadrant: tr('set.frameQuadrant') })
      .setValue(SETTINGS.newQuadrant ? 'quadrant' : 'standard')
      .onChange(async (v) => { SETTINGS.newQuadrant = v === 'quadrant'; await enregistrer(); }));

    bascule('newGrid', tr('set.newGrid'), tr('set.newGridDesc'));
    bascule('newAxes', tr('set.newAxes'), tr('set.newAxesDesc'));

    ligne(tr('set.newScale'), tr('set.newScaleDesc')).addSlider((sl) => sl
      .setLimits(10, 120, 5)
      .setValue(SETTINGS.newScale)
      .setDynamicTooltip()
      .onChange(async (v) => { SETTINGS.newScale = v; await enregistrer(); }));

    titre(tr('set.embed'));

    ligne(tr('set.embedHeight'), tr('set.embedHeightDesc')).addSlider((sl) => sl
      .setLimits(200, 700, 20)
      .setValue(SETTINGS.embedHeight)
      .setDynamicTooltip()
      .onChange(async (v) => { SETTINGS.embedHeight = v; await enregistrer(); }));

    bascule('embedOpenButton', tr('set.embedButton'), tr('set.embedButtonDesc'));
    bascule('plainLinkPreview', tr('set.plainLink'), tr('set.plainLinkDesc'));
  }
}

/* ================================================================== */
/*  Affichage en mode édition (Live Preview)                          */
/* ================================================================== */

/* Le rendu Markdown ne s'applique qu'au mode lecture. Pour que le lien
   s'affiche aussi pendant l'écriture — là où tout le monde travaille — il faut
   décorer le texte dans l'éditeur lui-même. Obsidian expose CodeMirror aux
   plugins, sans étape de compilation. */
function livePreviewExtension(plugin) {
  let cm, st;
  try {
    cm = require('@codemirror/view');
    st = require('@codemirror/state');
  } catch (e) { return null; }
  if (!cm || !st || !cm.Decoration || !cm.WidgetType || !cm.EditorView) return null;
  if (!st.StateField || !st.RangeSetBuilder) return null;

  const LIEN = /^!?\[\[([^\]|#^]+\.graph)(?:\|[^\]]*)?\]\]$/;

  class GraphiqueWidget extends cm.WidgetType {
    constructor(chemin, source) { super(); this.chemin = chemin; this.source = source; }
    eq(autre) { return autre.chemin === this.chemin; }
    toDOM() {
      const hote = document.createElement('div');
      hote.className = 'graphique-live-embed';
      const file = plugin.app.metadataCache.getFirstLinkpathDest(this.chemin, this.source || '');
      if (file instanceof TFile) renderPreview(plugin.app, file, hote, SETTINGS.embedHeight);
      else hote.textContent = tr('embed.notFound', this.chemin);
      return hote;
    }
    ignoreEvent() { return true; }   // le déplacement et le zoom restent à nous
  }

  const construire = (etat) => {
    const builder = new st.RangeSetBuilder();
    if (!SETTINGS.plainLinkPreview) return builder.finish();
    const curseur = etat.selection.main;
    const actif = plugin.app.workspace.getActiveFile();
    const source = actif ? actif.path : '';

    for (let i = 1; i <= etat.doc.lines; i++) {
      const ligne = etat.doc.line(i);
      const texte = ligne.text.trim();
      if (texte.length < 10 || texte.charCodeAt(0) !== 91) continue;   // gain : "[" seulement
      const m = LIEN.exec(texte);
      if (!m) continue;
      // la ligne redevient du texte quand le curseur y est, sinon elle ne
      // serait plus modifiable
      if (curseur.from <= ligne.to && curseur.to >= ligne.from) continue;
      builder.add(ligne.from, ligne.to, cm.Decoration.replace({
        widget: new GraphiqueWidget(m[1], source),
        block: true,
      }));
    }
    return builder.finish();
  };

  /* 🔴 Passer par un StateField et non un ViewPlugin : CodeMirror refuse les
     décorations de bloc venant d'un plugin de vue (« Block decorations may not
     be specified via plugins »), et l'exception casse tout l'éditeur — curseur
     qui saute, ⌘K qui ne répond plus. Erreur commise en 1.5.0. */
  return st.StateField.define({
    create: (etat) => construire(etat),
    update: (deco, tr) => ((tr.docChanged || tr.selection) ? construire(tr.state) : deco),
    provide: (f) => cm.EditorView.decorations.from(f),
  });
}

module.exports = class GraphiquesPlugin extends Plugin {
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new GraphiquesSettingTab(this.app, this));

    this.registerView(VIEW_TYPE, (leaf) => new GraphiqueView(leaf, this));
    this.registerExtensions([EXT], VIEW_TYPE);

    this.addRibbonIcon('line-chart', tr('cmd.create'), () => this.createGraph());

    this.addCommand({ id: 'create-graphique', name: tr('cmd.create'), callback: () => this.createGraph() });

    this.addCommand({
      id: 'insert-graphique',
      name: tr('cmd.insert'),
      editorCallback: (editor) => {
        new GraphPickerModal(this.app, (file) => {
          editor.replaceSelection('![[' + file.path + ']]\n');
        }).open();
      },
    });

    this.registerEvent(this.app.workspace.on('file-menu', (menu, file) => {
      if (file instanceof TFolder) {
        menu.addItem((item) => item
          .setTitle(tr('menu.newGraph')).setIcon('line-chart')
          .onClick(() => this.createGraph(file)));
      }
    }));

    // ![[mon-graphique.graph]] rendu directement dans la note — et compté comme un lien
    try {
      const reg = this.app.embedRegistry;
      if (reg && reg.registerExtension) {
        const plugin = this;
        reg.registerExtension(EXT, (ctx, file) => {
          const comp = new Component();
          comp.containerEl = ctx.containerEl;
          comp.loadFile = async () => {
            ctx.containerEl.empty();
            renderPreview(plugin.app, file, ctx.containerEl, SETTINGS.embedHeight);
          };
          comp.onload = () => comp.loadFile();
          return comp;
        });
        this.register(() => reg.unregisterExtension && reg.unregisterExtension(EXT));
        this.embedOk = true;
      }
    } catch (e) {
      this.embedOk = false;
    }

    // en mode édition (Live Preview)
    const extension = livePreviewExtension(this);
    if (extension) this.registerEditorExtension(extension);

    // en mode lecture — un lien simple vers un graphique, seul sur sa ligne,
    // vaut une insertion :
    // écrire le point d'exclamation n'est pas naturel et personne n'y pense.
    this.registerMarkdownPostProcessor((el, ctx) => {
      if (!SETTINGS.plainLinkPreview) return;
      const liens = Array.from(el.querySelectorAll('a.internal-link'));
      for (const a of liens) {
        const cible = a.getAttribute('data-href') || a.getAttribute('href') || '';
        if (!cible.toLowerCase().endsWith('.' + EXT)) continue;

        // uniquement si le lien est seul dans son paragraphe : au milieu d'une
        // phrase, un graphique de 380 pixels de haut n'aurait aucun sens
        const bloc = a.parentElement;
        if (!bloc || bloc.textContent.trim() !== a.textContent.trim()) continue;

        const file = this.app.metadataCache.getFirstLinkpathDest(cible, ctx.sourcePath);
        if (!(file instanceof TFile)) continue;

        bloc.empty();
        renderPreview(this.app, file, bloc, SETTINGS.embedHeight);
      }
    });

    // Solution de repli : ```graph  file: chemin.graph  ```
    this.registerMarkdownCodeBlockProcessor('graph', async (src, el, ctx) => {
      const m = /file\s*:\s*(.+)/.exec(src);
      const height = parseInt((/height\s*:\s*(\d+)/.exec(src) || [])[1], 10) || SETTINGS.embedHeight || 380;
      if (!m) { el.createDiv({ cls: 'graphique-embed-error', text: tr('embed.missingPath') }); return; }
      const path = m[1].trim().replace(/^\[\[|\]\]$/g, '');
      const file = this.app.vault.getFileByPath(path) || this.app.metadataCache.getFirstLinkpathDest(path, ctx.sourcePath);
      if (!(file instanceof TFile)) { el.createDiv({ cls: 'graphique-embed-error', text: tr('embed.notFound', path) }); return; }
      renderPreview(this.app, file, el, height);
    });
  }

  async loadSettings() {
    SETTINGS = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    LANG = resolveLang(SETTINGS.language);
    this.settings = SETTINGS;
  }

  async saveSettings() {
    LANG = resolveLang(SETTINGS.language);
    await this.saveData(SETTINGS);
    this.refreshViews();
  }

  /* Applique les réglages aux graphiques déjà ouverts. */
  refreshViews() {
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) {
      if (leaf.view && typeof leaf.view.rebuildUI === 'function') leaf.view.rebuildUI();
    }
  }

  async createGraph(folder) {
    let dir = '';
    if (folder instanceof TFolder) dir = folder.path;
    else {
      const active = this.app.workspace.getActiveFile();
      if (active && active.parent && active.parent.path !== '/') dir = active.parent.path;
    }
    const base = dir ? dir + '/' : '';
    let path = base + 'Graphique.' + EXT;
    let n = 1;
    while (this.app.vault.getAbstractFileByPath(path)) {
      n++;
      path = base + 'Graphique ' + n + '.' + EXT;
    }
    const modele = defaultModel();
    modele.view.sx = modele.view.sy = SETTINGS.newScale || 45;
    modele.style.quadrant = !!SETTINGS.newQuadrant;
    modele.style.grid = SETTINGS.newGrid !== false;
    modele.style.axes = SETTINGS.newAxes !== false;
    const file = await this.app.vault.create(path, JSON.stringify(modele, null, 1));
    await this.app.workspace.getLeaf(true).openFile(file);
    new Notice(tr('notice.created', file.basename));
  }
};
