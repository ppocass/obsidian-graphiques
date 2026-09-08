let out = [], ok = 0;
const near = (a,b,t) => Math.abs(a-b) < (t||1e-6);

// --- points d'intersection vivants ---
const m = migrate({
  functions: [{ id:'F', expr:'x^2' }],
  objects: [
    { id:'A', t:'line', x1:0, y1:0,   x2:1, y2:1 },     // y = x
    { id:'B', t:'line', x1:0, y1:4,   x2:1, y2:3 },     // y = -x + 4
    { id:'P', t:'point', x:0, y:0, link:{a:'A', b:'B', k:0} },
    { id:'Q', t:'point', x:0, y:0, link:{a:'A', b:'F', k:1} },  // x^2 = x -> 0 et 1
  ],
});
const P = m.objects.find(o=>o.id==='P'), Q = m.objects.find(o=>o.id==='Q');
syncLinks(m, -10, 10);
if (near(P.x,2) && near(P.y,2)) ok++; else out.push('point lié droite/droite : ' + P.x + ';' + P.y);
if (near(Q.x,1) && near(Q.y,1)) ok++; else out.push('point lié droite/courbe : ' + Q.x + ';' + Q.y);

// on bouge la droite B : le point doit suivre tout seul
const B = m.objects.find(o=>o.id==='B');
B.y1 = 8; B.y2 = 7;                       // y = -x + 8  ->  intersection (4;4)
syncLinks(m, -10, 10);
if (near(P.x,4) && near(P.y,4)) ok++; else out.push('le point ne suit pas : ' + P.x + ';' + P.y);

// expression en cours de saisie : on ne casse pas le lien, on ne bouge pas
m.functions[0].expr = 'x^';
const before = [Q.x, Q.y];
syncLinks(m, -10, 10);
if (Q.link && Q.x === before[0]) ok++; else out.push('lien perdu pendant la saisie');
m.functions[0].expr = 'x^2';

// parent supprimé : le point devient libre, il ne disparaît pas
m.objects = m.objects.filter(o => o.id !== 'A');
syncLinks(m, -10, 10);
if (!P.link && near(P.x,4)) ok++; else out.push('parent supprimé mal géré');

// --- aimantation ---
const model = migrate({ objects: [
  { id:'S', t:'seg', x1:0, y1:0, x2:10, y2:0 },
  { id:'V', t:'point', x:3, y:4 },
], functions: [{ id:'C', expr:'x' }] });
const view = Object.create(GraphiqueView.prototype);
view.model = model;
view.snap = true;
const W = 800, H = 600;
const T = makeTransform(model, W, H);
const call = (wx, wy, excl) => GraphiqueView.prototype.magnet.call(view, T.sx(wx), T.sy(wy), T, excl);

let g = call(3.08, 4.06);                      // près du point (3;4)
if (g && near(g.x,3) && near(g.y,4) && g.kind === 'point') ok++; else out.push('aimant sur un point : ' + JSON.stringify(g));

g = call(6, 0.1);                              // près du segment y=0
if (g && near(g.y,0,1e-6) && g.kind === 'droite') ok++; else out.push('aimant sur une droite : ' + JSON.stringify(g));

g = call(0.02, 0.02);                          // près de l'extrémité (0;0)
if (g && g.kind === 'extrémité') ok++; else out.push('aimant sur une extrémité : ' + JSON.stringify(g));

g = call(4, 4.1);                              // près de la courbe y = x
if (g && near(g.y,4,0.2) && g.kind === 'courbe') ok++; else out.push('aimant sur une courbe : ' + JSON.stringify(g));

g = call(6, 3);                                // loin de tout
if (g === null) ok++; else out.push('aimant qui accroche dans le vide : ' + JSON.stringify(g));

g = call(3.05, 4.05, 'V');                     // le point exclu ne doit plus attirer
if (!g || g.kind !== 'point') ok++; else out.push('exclusion ignorée');

// hors segment : pas d'accroche au-delà de l'extrémité
g = call(14, 0.05);
if (!g || g.kind !== 'droite') ok++; else out.push('segment prolongé à tort');

out.length ? ('ECHECS:\n' + out.join('\n')) : (ok + ' vérifications (points vivants, aimant) passées')
