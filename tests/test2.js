let out = [], ok = 0;
const eq = (o, want) => { const g = lineEquation(o); if (g === want) ok++; else out.push('lineEquation -> "' + g + '" au lieu de "' + want + '"'); };
eq({x1:0,y1:1,x2:1,y2:3}, 'y = 2x + 1');
eq({x1:0,y1:0,x2:1,y2:1}, 'y = x');
eq({x1:0,y1:5,x2:2,y2:5}, 'y = 5');
eq({x1:3,y1:0,x2:3,y2:9}, 'x = 3');
eq({x1:0,y1:-2,x2:1,y2:-3}, 'y = −x − 2');
eq({x1:0,y1:100,x2:10,y2:80}, 'y = -2x + 100');
if (slopeOf({x1:0,y1:0,x2:2,y2:1}) !== 0.5) out.push('slopeOf cassé');
if (slopeOf({x1:1,y1:0,x2:1,y2:5}) !== null) out.push('slopeOf vertical cassé');
// contrainte 45°/horizontale
let [cx, cy] = constrain(0, 0, 5, 0.2); if (Math.abs(cy) > 1e-9) out.push('constrain horizontal cassé'); else ok++;
[cx, cy] = constrain(0, 0, 3, 3.1); if (Math.abs(cx - cy) > 1e-9) out.push('constrain 45° cassé'); else ok++;
[cx, cy] = constrain(0, 0, 0.1, -4); if (Math.abs(cx) > 1e-9) out.push('constrain vertical cassé'); else ok++;
// l'équation imposée doit recoller au tracé
const f = compile('y = -2x + 100');
const o = {x1: 0, y1: 0, x2: 20, y2: 0};
o.y1 = f(o.x1); o.y2 = f(o.x2);
if (lineEquation(o) !== 'y = -2x + 100') out.push('aller-retour équation cassé : ' + lineEquation(o)); else ok++;
out.length ? ('ECHECS:\n' + out.join('\n')) : (ok + ' vérifications supplémentaires passées');
