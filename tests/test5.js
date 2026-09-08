let out = [], ok = 0;
const near = (a,b,t) => Math.abs(a-b) < (t||1e-6);

// fusion en profondeur : une clé manquante doit reprendre la valeur par défaut
let m = migrate({ view: { cx: 1, sx: 10 } });
if (m.view.sy === 45 && m.view.cy === 0 && m.view.sx === 10 && m.view.cx === 1) ok++;
else out.push('view incomplet mal fusionné : ' + JSON.stringify(m.view));
if (m.style.grid === true && m.style.lock === true && m.style.xlabel === 'x') ok++;
else out.push('style incomplet mal fusionné : ' + JSON.stringify(m.style));

m = migrate({ style: { quadrant: true } });
if (m.style.quadrant === true && m.style.axes === true && m.view.sx === 45) ok++;
else out.push('style partiel : ' + JSON.stringify(m.style));

// un fichier v1 complet reste correct
m = migrate({ view: { cx: 2, cy: 3, scale: 12 }, style: { grid: false, xlabel: 'Quantité' } });
if (m.view.sx === 12 && m.view.sy === 12 && m.view.scale === undefined
    && m.style.grid === false && m.style.axes === true && m.style.xlabel === 'Quantité') ok++;
else out.push('migration v1 : ' + JSON.stringify(m.view) + JSON.stringify(m.style));

// deux appels ne doivent pas se contaminer (defaultModel partagé par erreur)
const a = migrate({ view: { sx: 7 } });
const b = migrate({});
if (b.view.sx === 45 && a.view.sx === 7) ok++; else out.push('les modèles se contaminent : ' + b.view.sx);

// intersectionsOf : les trois cas
const L = (x1,y1,x2,y2) => ({ kind:'line', o:{ x1,y1,x2,y2 } });
const F = (f) => ({ kind:'fn', f });
let r = intersectionsOf(L(0,0,1,1), L(0,4,1,3), -10, 10);
if (r.length === 1 && near(r[0].x,2) && near(r[0].y,2)) ok++; else out.push('droite/droite : ' + JSON.stringify(r));

r = intersectionsOf(F((x)=>x*x), F((x)=>x+2), -10, 10);
if (r.length === 2 && near(r[0].x,-1,1e-4) && near(r[1].x,2,1e-4)) ok++; else out.push('courbe/courbe : ' + JSON.stringify(r));

r = intersectionsOf(L(3,0,3,5), F((x)=>2*x+1), -10, 10);      // verticale x=3 contre y=2x+1
if (r.length === 1 && near(r[0].x,3) && near(r[0].y,7)) ok++; else out.push('verticale/courbe : ' + JSON.stringify(r));

r = intersectionsOf(F((x)=>2*x+1), L(3,0,3,5), -10, 10);      // et dans l'autre sens
if (r.length === 1 && near(r[0].x,3) && near(r[0].y,7)) ok++; else out.push('courbe/verticale : ' + JSON.stringify(r));

r = intersectionsOf(L(0,0,1,1), L(0,1,1,2), -10, 10);          // parallèles
if (r.length === 0) ok++; else out.push('parallèles : ' + JSON.stringify(r));

// le point lié passe bien par la même fonction que l'outil
const mm = migrate({ objects: [
  { id:'A', t:'line', x1:0, y1:0, x2:1, y2:1 },
  { id:'B', t:'line', x1:3, y1:0, x2:3, y2:9 },
  { id:'P', t:'point', x:0, y:0, link:{ a:'A', b:'B', k:0 } },
]});
syncLinks(mm, -10, 10);
const P = mm.objects.find(o=>o.id==='P');
if (near(P.x,3) && near(P.y,3)) ok++; else out.push('verticale + oblique liées : ' + P.x + ';' + P.y);

out.length ? ('ECHECS:\n' + out.join('\n')) : (ok + ' vérifications (fusion des fichiers, intersections unifiées) passées')
