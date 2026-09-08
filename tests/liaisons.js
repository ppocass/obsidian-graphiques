// Extrémités accrochées, tangentes, rotation.
let out = [], ok = 0;
const near = (a,b,t) => Math.abs(a-b) < (t||1e-6);

// --- accroche d'une extrémité à un point ---
let m = migrate({ objects: [
  { id:'P', t:'point', x:2, y:3 },
  { id:'S', t:'seg', x1:0, y1:0, x2:9, y2:9, bind:{ b:'P' } },
]});
syncLinks(m, -10, 10);
let S = m.objects.find(o=>o.id==='S');
if (near(S.x2,2) && near(S.y2,3)) ok++; else out.push('accroche : ' + S.x2 + ';' + S.y2);

// le point bouge, l'extrémité suit
m.objects.find(o=>o.id==='P').x = 5;
syncLinks(m, -10, 10);
if (near(S.x2,5)) ok++; else out.push('suivi : ' + S.x2);

// point supprimé : l'accroche disparaît, le segment reste
m.objects = m.objects.filter(o=>o.id!=='P');
syncLinks(m, -10, 10);
if (!S.bind && near(S.x2,5)) ok++; else out.push('accroche orpheline mal gérée');

// --- la projection suit un point d'intersection calculé (le cas SES) ---
m = migrate({
  functions: [{ id:'fD', expr:'100 - 2x' }, { id:'fO', expr:'20 + 3x' }],
  objects: [
    { id:'E', t:'point', x:0, y:0, link:{ a:'fD', b:'fO', k:0 } },
    { id:'proj', t:'seg', x1:0, y1:0, x2:0, y2:0, bind:{ b:'E' } },
  ],
});
syncLinks(m, 0, 60);
const E = m.objects.find(o=>o.id==='E'), proj = m.objects.find(o=>o.id==='proj');
if (near(E.x,16) && near(proj.x2,16) && near(proj.y2,68)) ok++;
else out.push('projection/équilibre : E=' + E.x + ' proj=' + proj.x2 + ';' + proj.y2);

// on change l'offre : équilibre et projection bougent ensemble
m.functions[1].expr = '20 + 1x';          // 100-2x = 20+x -> x = 26,666…
syncLinks(m, 0, 60);
if (near(E.x, 80/3, 1e-3) && near(proj.x2, E.x)) ok++;
else out.push('après changement : E=' + E.x + ' proj=' + proj.x2);

// --- tangente ---
m = migrate({
  functions: [{ id:'f', expr:'x^2' }],
  objects: [{ id:'T', t:'line', tangent:{ fn:'f', x:3 }, x1:0, y1:0, x2:1, y2:0 }],
});
syncLinks(m, -10, 10);
const T = m.objects.find(o=>o.id==='T');
const pente = (T.y2 - T.y1) / (T.x2 - T.x1);
if (near(pente, 6, 1e-4)) ok++; else out.push('pente de la tangente à x² en 3 : ' + pente);
// elle passe par le point de tangence (9 en x=3)
const b = T.y1 - pente * T.x1;
if (near(pente*3 + b, 9, 1e-4)) ok++; else out.push('la tangente ne touche pas la courbe : ' + (pente*3+b));

// tangente à une droite affine : pente identique partout
m = migrate({ functions:[{id:'g',expr:'2x+1'}], objects:[{id:'T2',t:'line',tangent:{fn:'g',x:-4},x1:0,y1:0,x2:1,y2:0}] });
syncLinks(m, -10, 10);
const T2 = m.objects.find(o=>o.id==='T2');
if (near((T2.y2-T2.y1)/(T2.x2-T2.x1), 2, 1e-4)) ok++; else out.push('tangente à une droite');

// fonction supprimée : la tangente se détache au lieu de planter
m.functions = [];
syncLinks(m, -10, 10);
if (!T2.tangent) ok++; else out.push('tangente orpheline');

// --- rotation ---
const carre = [[0,0],[2,0],[2,2],[0,2]];
let r = rotatePoints(carre, 90);
// un carré tourné de 90° reste le même carré (aux sommets près)
const memeJeu = (A,B) => A.every(p => B.some(q => near(p[0],q[0],1e-6) && near(p[1],q[1],1e-6)));
if (memeJeu(r, carre) && memeJeu(carre, r)) ok++; else out.push('rotation 90° du carré : ' + JSON.stringify(r));
// 360° revient au point de départ
r = rotatePoints(carre, 360);
if (memeJeu(r, carre)) ok++; else out.push('rotation 360° : ' + JSON.stringify(r));
// le centre ne bouge pas
r = rotatePoints(carre, 37);
const c1 = carre.reduce((a,p)=>[a[0]+p[0]/4,a[1]+p[1]/4],[0,0]);
const c2 = r.reduce((a,p)=>[a[0]+p[0]/4,a[1]+p[1]/4],[0,0]);
if (near(c1[0],c2[0],1e-6) && near(c1[1],c2[1],1e-6)) ok++; else out.push('le centre a bougé');

out.length ? ('ECHECS:\n' + out.join('\n')) : (ok + ' vérifications (accroches, tangentes, rotation) passées')
