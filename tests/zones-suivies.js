// Zones accrochées à la géométrie : les sommets suivent ce sur quoi ils sont posés.
let out = [], ok = 0;
const near = (a,b,t) => Math.abs(a-b) < (t||1e-6);

// triangle entre deux droites et l'axe des abscisses
let m = migrate({
  objects: [
    { id:'D1', t:'line', x1:0, y1:0, x2:1, y2:1 },        // y = x
    { id:'D2', t:'line', x1:0, y1:6, x2:1, y2:5 },        // y = -x + 6
    { id:'Z', t:'poly', pts:[[0,0],[3,3],[6,0]],
      anchors:[ null, { i:['D1','D2'], k:0 }, null ] },
  ],
});
syncLinks(m, -20, 20);
let Z = m.objects.find(o=>o.id==='Z');
if (near(Z.pts[1][0],3) && near(Z.pts[1][1],3)) ok++; else out.push('sommet au croisement : ' + Z.pts[1]);

// on bouge la deuxième droite : le sommet suit
const D2 = m.objects.find(o=>o.id==='D2');
D2.y1 = 10; D2.y2 = 9;                                     // y = -x + 10 -> croisement (5;5)
syncLinks(m, -20, 20);
if (near(Z.pts[1][0],5) && near(Z.pts[1][1],5)) ok++; else out.push('après déplacement : ' + Z.pts[1]);
// les sommets non accrochés n'ont pas bougé
if (near(Z.pts[0][0],0) && near(Z.pts[2][0],6)) ok++; else out.push('un sommet libre a bougé');

// sommet posé sur une droite : il garde sa position relative
m = migrate({
  objects: [
    { id:'S', t:'seg', x1:0, y1:0, x2:10, y2:0 },
    { id:'Z2', t:'poly', pts:[[5,0],[8,4],[2,4]], anchors:[ { on:'S', t:0.5 }, null, null ] },
  ],
});
syncLinks(m, -20, 20);
let Z2 = m.objects.find(o=>o.id==='Z2');
if (near(Z2.pts[0][0],5) && near(Z2.pts[0][1],0)) ok++; else out.push('sommet sur segment : ' + Z2.pts[0]);
m.objects.find(o=>o.id==='S').y1 = 4;                      // on relève l'extrémité gauche
syncLinks(m, -20, 20);
if (near(Z2.pts[0][1],2)) ok++; else out.push('milieu du segment incliné : ' + Z2.pts[0]);

// sommet posé sur une courbe : il reste dessus
m = migrate({
  functions: [{ id:'f', expr:'x^2' }],
  objects: [{ id:'Z3', t:'poly', pts:[[2,4],[0,0],[3,0]], anchors:[ { fn:'f', x:2 }, null, null ] }],
});
syncLinks(m, -10, 10);
let Z3 = m.objects.find(o=>o.id==='Z3');
if (near(Z3.pts[0][1],4)) ok++; else out.push('sommet sur courbe : ' + Z3.pts[0]);
m.functions[0].expr = 'x^3';                               // 2³ = 8
syncLinks(m, -10, 10);
if (near(Z3.pts[0][1],8)) ok++; else out.push('après changement d\'équation : ' + Z3.pts[0]);

// sommet accroché à un point, lui-même intersection : la chaîne complète
m = migrate({
  functions: [{ id:'fa', expr:'100 - 2x' }, { id:'fb', expr:'20 + 3x' }],
  objects: [
    { id:'E', t:'point', x:0, y:0, link:{ a:'fa', b:'fb', k:0 } },
    { id:'Z4', t:'poly', pts:[[0,0],[0,0],[0,20]], anchors:[ { p:'E' }, null, null ] },
  ],
});
syncLinks(m, 0, 60);
const Z4 = m.objects.find(o=>o.id==='Z4');
if (near(Z4.pts[0][0],16) && near(Z4.pts[0][1],68)) ok++; else out.push('chaîne point/zone : ' + Z4.pts[0]);

// objet disparu : on ne plante pas
m.objects = m.objects.filter(o=>o.id!=='E');
syncLinks(m, 0, 60);
ok++;

out.length ? ('ECHECS:\n' + out.join('\n')) : (ok + ' vérifications (zones accrochées) passées')
