// Garde-fou : ne jamais masquer une méthode que TextFileView utilise en interne.
//
// TextFileView capture `this.save.bind(this)` dans une minuterie AU MOMENT DE LA
// CONSTRUCTION. Une méthode `save()` définie dans la sous-classe la remplace :
// la minuterie appelle alors la nôtre et plus rien n'est jamais écrit sur le
// disque. Bug réel du 08/09/2026, invisible à l'usage jusqu'à la réouverture
// d'un fichier. Même piège pour les autres méthodes ci-dessous.
let out = [], ok = 0;

const interdites = ['save', 'requestSave', 'onLoadFile', 'onUnloadFile', 'setData', 'onModify'];
const proto = GraphiqueView.prototype;
for (const nom of interdites) {
  if (Object.prototype.hasOwnProperty.call(proto, nom)) {
    out.push('la vue redéfinit « ' + nom +' », ce qui casse la sauvegarde d\'Obsidian');
  } else ok++;
}

// Celles-ci, au contraire, DOIVENT être fournies : c'est le contrat de TextFileView.
for (const nom of ['getViewData', 'setViewData', 'clear', 'getViewType', 'getDisplayText']) {
  if (typeof proto[nom] === 'function') ok++;
  else out.push('méthode obligatoire manquante : ' + nom);
}

// getViewData doit rendre le modèle courant, relisible par setViewData.
const vue = Object.create(proto);
vue.model = migrate({ objects: [{ id: 'p', t: 'point', x: 3, y: 4 }] });
const texte = proto.getViewData.call(vue);
const relu = migrate(JSON.parse(texte));
if (relu.objects.length === 1 && relu.objects[0].x === 3) ok++;
else out.push('aller-retour getViewData/JSON cassé');

out.length ? ('ECHECS:\n' + out.join('\n')) : (ok + ' vérifications (contrat TextFileView) passées')
