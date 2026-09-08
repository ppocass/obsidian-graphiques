let out = [], ok = 0;
const near = (a, b, t) => Math.abs(a - b) < (t || 1e-6);

// intersection de deux droites
let p = lineIntersection({x1:0,y1:0,x2:1,y2:1}, {x1:0,y1:4,x2:1,y2:3});
if (p && near(p.x,2) && near(p.y,2)) ok++; else out.push('lineIntersection: ' + JSON.stringify(p));
if (lineIntersection({x1:0,y1:0,x2:1,y2:1},{x1:0,y1:1,x2:1,y2:2}) !== null) out.push('parallèles non détectées');
else ok++;
// offre / demande : 100-2x et 20+3x  ->  (16 ; 68)
p = lineIntersection({x1:0,y1:100,x2:10,y2:80}, {x1:0,y1:20,x2:10,y2:50});
if (p && near(p.x,16) && near(p.y,68)) ok++; else out.push('équilibre SES faux : ' + JSON.stringify(p));

// racines : x^2 - 4
let r = findRoots((x) => x*x - 4, -10, 10);
if (r.length === 2 && near(r[0],-2,1e-4) && near(r[1],2,1e-4)) ok++; else out.push('findRoots x²-4 : ' + r);
// intersection de deux courbes : x^2 et x+2  -> -1 et 2
r = findRoots((x) => x*x - (x+2), -10, 10);
if (r.length === 2 && near(r[0],-1,1e-4) && near(r[1],2,1e-4)) ok++; else out.push('findRoots x² vs x+2 : ' + r);
// sin(x) sur [1,10] : pi et 2pi
r = findRoots(Math.sin, 1, 10);   // pi, 2pi et 3pi sont dans [1,10]
if (r.length === 3 && near(r[0],Math.PI,1e-4) && near(r[2],3*Math.PI,1e-4)) ok++; else out.push('findRoots sin : ' + r);

// polygone
const carre = [[0,0],[4,0],[4,4],[0,4]];
if (pointInPolygon(2,2,carre) && !pointInPolygon(5,2,carre) && !pointInPolygon(2,-1,carre)) ok++;
else out.push('pointInPolygon cassé');

// migration d'un fichier version 1
const m = migrate({view:{cx:1,cy:2,scale:30}, functions:[{expr:'x'}], objects:[]});
if (m.view.sx === 30 && m.view.sy === 30 && m.view.cx === 1 && m.view.scale === undefined && m.style.lock === true) ok++;
else out.push('migrate v1 : ' + JSON.stringify(m.view));
const m2 = migrate(null);
if (m2.view.sx === 45 && m2.functions.length === 0) ok++; else out.push('migrate null cassé');

// échelles séparées : la transformation doit être exacte sur les deux axes
const model = {view:{cx:3,cy:-2,sx:12,sy:80}, style:{quadrant:true}};
const T = makeTransform(model, 900, 500);
if (near(T.wx(T.sx(7.5)),7.5) && near(T.wy(T.sy(-3.25)),-3.25)) ok++; else out.push('transform x/y séparés cassé');
if (near(T.sx(1)-T.sx(0), 12) && near(T.sy(0)-T.sy(1), 80)) ok++; else out.push('échelles non respectées');

// PDF : structure et table xref
const jpeg = new Uint8Array(700);
for (let i = 0; i < jpeg.length; i++) jpeg[i] = i % 256;
const pdf = buildPdf(jpeg, 640, 480);
const s = Array.from(pdf, (b) => String.fromCharCode(b)).join('');
if (s.slice(0,5) !== '%PDF-') out.push('en-tête PDF absent'); else ok++;
if (s.slice(-6) !== '%%EOF\n') out.push('fin de PDF absente'); else ok++;
const sx = /startxref\n(\d+)\n%%EOF/.exec(s);
if (!sx) out.push('startxref absent');
else {
  const at = parseInt(sx[1], 10);
  if (s.slice(at, at + 4) !== 'xref') out.push('startxref pointe à côté (' + s.slice(at, at+12) + ')');
  else {
    ok++;
    const table = s.slice(at);
    const rows = table.split('\n').slice(3, 8);   // 0:'xref' 1:'0 6' 2:entrée libre
    let good = 0;
    rows.forEach((row, i) => {
      const off = parseInt(row.slice(0, 10), 10);
      if (s.slice(off, off + (String(i+1).length + 6)) === (i+1) + ' 0 obj') good++;
      else out.push('objet ' + (i+1) + ' : décalage faux (' + JSON.stringify(s.slice(off, off+12)) + ')');
    });
    if (good === 5) ok++;
  }
}
// l'image binaire doit être intacte dans le flux
const start = s.indexOf('stream\n', s.indexOf('/DCTDecode')) + 7;
let intact = true;
for (let i = 0; i < jpeg.length; i++) if (pdf[start + i] !== jpeg[i]) { intact = false; break; }
if (intact) ok++; else out.push('les octets JPEG sont abîmés dans le PDF');

out.length ? ('ECHECS:\n' + out.join('\n')) : (ok + ' vérifications (intersections, zones, échelles, PDF) passées')
