let out = [], ok = 0;
const near = (a,b,t) => Math.abs(a-b) < (t||1e-6);

// rectangle : quatre coins dans l'ordre
let f = shapeFrom('rect', 0, 0, 4, 2, 10, 10);
if (f.t === 'poly' && f.pts.length === 4 && near(f.pts[2][0],4) && near(f.pts[2][1],2)) ok++;
else out.push('rectangle : ' + JSON.stringify(f));

// carré : égalisé en pixels même si le glissé est plat
f = shapeFrom('square', 0, 0, 4, 1, 10, 10);
if (near(Math.abs(f.pts[1][0]-f.pts[0][0]), 4) && near(Math.abs(f.pts[2][1]-f.pts[1][1]), 4)) ok++;
else out.push('carré : ' + JSON.stringify(f.pts));

// carré avec deux échelles différentes : carré à l'écran, pas dans le repère
f = shapeFrom('square', 0, 0, 4, 4, 10, 2);
const largeurPx = Math.abs(f.pts[1][0]-f.pts[0][0]) * 10;
const hauteurPx = Math.abs(f.pts[2][1]-f.pts[1][1]) * 2;
if (near(largeurPx, hauteurPx)) ok++; else out.push('carré échelles : ' + largeurPx + ' vs ' + hauteurPx);

// cercle : rond à l'écran
f = shapeFrom('circle', 0, 0, 6, 2, 20, 5);
if (f.t === 'ellipse' && near(f.rx*20, f.ry*5)) ok++; else out.push('cercle : ' + JSON.stringify(f));

// ellipse libre : demi-axes = moitié du glissé
f = shapeFrom('ellipse', 0, 0, 6, 2, 10, 10);
if (near(f.rx,3) && near(f.ry,1) && near(f.cx,3) && near(f.cy,1)) ok++; else out.push('ellipse : ' + JSON.stringify(f));

// triangle isocèle : sommet au milieu
f = shapeFrom('tri', 0, 0, 4, 3, 10, 10);
if (f.pts.length === 3 && near(f.pts[2][0], 2) && near(f.pts[2][1], 3)) ok++; else out.push('triangle : ' + JSON.stringify(f.pts));

// triangle rectangle : angle droit en bas à gauche
f = shapeFrom('tri-rect', 0, 0, 4, 3, 10, 10);
const droit = near((f.pts[1][0]-f.pts[0][0])*(f.pts[2][0]-f.pts[0][0]) + (f.pts[1][1]-f.pts[0][1])*(f.pts[2][1]-f.pts[0][1]), 0);
if (f.pts.length === 3 && droit) ok++; else out.push('triangle rectangle : ' + JSON.stringify(f.pts));

// losange : quatre sommets sur les milieux des côtés
f = shapeFrom('diamond', 0, 0, 4, 2, 10, 10);
if (f.pts.length === 4 && near(f.pts[0][0],2) && near(f.pts[1][1],1)) ok++; else out.push('losange : ' + JSON.stringify(f.pts));

// hexagone : six sommets équidistants du centre, à l'écran
f = shapeFrom('hexa', 0, 0, 4, 4, 10, 4);
if (f.pts.length === 6) {
  const cx = (0+f.pts.reduce((a,p)=>a+p[0],0))/6, cy = f.pts.reduce((a,p)=>a+p[1],0)/6;
  const d = f.pts.map((p) => Math.hypot((p[0]-cx)*10, (p[1]-cy)*4));
  if (Math.max(...d) - Math.min(...d) < 1e-6) ok++; else out.push('hexagone irrégulier : ' + d.join(','));
} else out.push('hexagone : ' + f.pts.length + ' sommets');

// pentagone
f = shapeFrom('penta', -2, -2, 2, 2, 10, 10);
if (f.pts.length === 5) ok++; else out.push('pentagone : ' + JSON.stringify(f.pts));

// glissé vers la gauche/haut : la forme suit, elle ne s'inverse pas bêtement
f = shapeFrom('rect', 4, 3, 0, 0, 10, 10);
if (near(f.pts[0][0],4) && near(f.pts[2][0],0)) ok++; else out.push('glissé inversé : ' + JSON.stringify(f.pts));

out.length ? ('ECHECS:\n' + out.join('\n')) : (ok + ' vérifications (formes géométriques) passées')
