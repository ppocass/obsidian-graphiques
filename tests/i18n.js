// Traductions : rien ne doit manquer d'une langue à l'autre, et toute clé
// employée dans le code doit exister.
let out = [], ok = 0;

const clesFr = Object.keys(STRINGS.fr).sort();
const clesEn = Object.keys(STRINGS.en).sort();

const manqueEn = clesFr.filter((k) => !(k in STRINGS.en));
const manqueFr = clesEn.filter((k) => !(k in STRINGS.fr));
if (!manqueEn.length) ok++; else out.push('absentes de l\'anglais : ' + manqueEn.join(', '));
if (!manqueFr.length) ok++; else out.push('absentes du français : ' + manqueFr.join(', '));

const inconnues = CLES_UTILISEES.filter((k) => !(k in STRINGS.fr));
if (!inconnues.length) ok++; else out.push('clés employées mais non traduites : ' + inconnues.join(', '));

// les substitutions %s doivent être en même nombre dans les deux langues
const decalage = clesFr.filter((k) => k in STRINGS.en &&
  (STRINGS.fr[k].split('%s').length !== STRINGS.en[k].split('%s').length));
if (!decalage.length) ok++; else out.push('nombre de %s différent : ' + decalage.join(', '));

// aucune chaîne vide
const vides = clesFr.filter((k) => !STRINGS.fr[k] || !STRINGS.en[k]);
if (!vides.length) ok++; else out.push('traductions vides : ' + vides.join(', '));

// la substitution fonctionne
if (tr('sel.slope', '2') === 'Coefficient directeur a = 2') ok++; else out.push('substitution %s cassée : ' + tr('sel.slope', '2'));

// les lignes d'aide existent dans les deux langues et sont aussi nombreuses
if (HELP_LINES.fr.length === HELP_LINES.en.length && HELP_LINES.fr.length > 0) ok++;
else out.push('lignes d\'aide dépareillées');

// choix de la langue
if (resolveLang('en') === 'en' && resolveLang('fr') === 'fr' && ['fr','en'].includes(resolveLang('auto'))) ok++;
else out.push('resolveLang cassé');

// tous les réglages ont une valeur par défaut typée
const attendus = ['language','showHelp','showCoords','showHints','panelWidth','snapDefault',
                  'defaultColor','defaultWidth','newQuadrant','newGrid','newAxes','newScale',
                  'embedHeight','embedOpenButton'];
const absents = attendus.filter((k) => !(k in DEFAULT_SETTINGS));
if (!absents.length) ok++; else out.push('réglages sans valeur par défaut : ' + absents.join(', '));

// familles construites par concaténation dans le code
const familles = {
  'tool.': ['select','point','seg','line','arrow','poly','inter','text'],
  'shape.': ['rect','square','circle','ellipse','tri','tri-rect','diamond','penta','hexa'],
  'width.': ['1','2','3','5'],
  'obj.': ['poly','ellipse'],
};
let trous = [];
for (const prefixe in familles) {
  for (const suffixe of familles[prefixe]) {
    const k = prefixe + suffixe;
    if (!(k in STRINGS.fr) || !(k in STRINGS.en)) trous.push(k);
  }
}
if (!trous.length) ok++; else out.push('clés de famille manquantes : ' + trous.join(', '));

out.length ? ('ECHECS:\n' + out.join('\n')) : (ok + ' vérifications (traductions et réglages) passées')
