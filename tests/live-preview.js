// L'extension d'éditeur : garde-fous sur ce que CodeMirror accepte.
let out = [], ok = 0;
const src = SOURCE_MAIN;

// 🔴 CodeMirror refuse les décorations de bloc issues d'un ViewPlugin.
// Elles doivent venir d'un StateField, sinon l'éditeur entier lève une
// exception : curseur qui saute, ⌘K inopérant. Bug réel de la 1.5.0.
if (/ViewPlugin\.fromClass/.test(src)) out.push('décorations fournies par un ViewPlugin : interdit avec block: true');
else ok++;
if (/StateField\.define/.test(src)) ok++;
else out.push('aucun StateField : les décorations de bloc n\'ont pas de source valide');
if (/EditorView\.decorations\.from/.test(src)) ok++;
else out.push('le StateField ne fournit pas ses décorations à l\'éditeur');

// l'extension doit se taire proprement si CodeMirror n'est pas exposé
if (/catch \(e\) \{ return null; \}/.test(src)) ok++;
else out.push('aucun repli si @codemirror/view est indisponible');

// la reconnaissance des liens
const LIEN = /^!?\[\[([^\]|#^]+\.graph)(?:\|[^\]]*)?\]\]$/;
const doit = ['[[Graphique.graph]]', '![[Graphique.graph]]', '[[dossier/mon graphique.graph]]',
              '[[Graphique.graph|autre nom]]'];
const doitPas = ['[[Note.md]]', '[[Graphique.graph]] et du texte', 'texte [[Graphique.graph]]',
                 '[[Graphique.graph', 'Graphique.graph'];
for (const t of doit) { if (LIEN.test(t.trim())) ok++; else out.push('non reconnu : ' + t); }
for (const t of doitPas) { if (!LIEN.test(t.trim())) ok++; else out.push('reconnu à tort : ' + t); }

out.length ? ('ECHECS:\n' + out.join('\n')) : (ok + ' vérifications (extension d\'éditeur) passées')
