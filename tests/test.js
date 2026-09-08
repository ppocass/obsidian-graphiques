const TESTS = [
  ['2x+1', 3, 7], ['y = 100 - 2x', 10, 80], ['f(x)=x^2', 3, 9],
  ['x^2+3x-4', 2, 6], ['-x^2', 2, -4], ['3(x+1)', 2, 9],
  ['sin(x)', 0, 0], ['sqrt(x)', 9, 3], ['2^x', 10, 1024],
  ['1/(x-1)', 3, 0.5], ['abs(-x)', 5, 5], ['exp(0)*x', 7, 7],
  ['pi', 0, Math.PI], ['max(x,3)', 1, 3], ['x^2^3', 2, 256],
  ['(x+1)(x-1)', 3, 8], ['0.5x', 4, 2], ['ln(e)', 0, 1],
];
let ok = 0, out = [];
for (const [expr, x, want] of TESTS) {
  try {
    const got = compile(expr)(x);
    if (Math.abs(got - want) < 1e-9) { ok++; } else out.push('FAUX  ' + expr + ' en x=' + x + ' -> ' + got + ' (attendu ' + want + ')');
  } catch (e) { out.push('ERREUR  ' + expr + ' : ' + e.message); }
}
for (const bad of ['2+*', 'x^', 'foo(x)', '(x+1', '2..3']) {
  try { compile(bad); out.push('AURAIT DU ECHOUER : ' + bad); } catch (e) { ok++; }
}
// transformation écran <-> monde
const model = {view:{cx:2,cy:-1,scale:37}, style:{quadrant:false}};
let T = makeTransform(model, 800, 600);
for (const x of [-5, 0, 3.25]) if (Math.abs(T.wx(T.sx(x)) - x) > 1e-9) out.push('transform aller-retour cassé en ' + x);
model.style.quadrant = true;
T = makeTransform(model, 800, 600);
for (const y of [-2, 0, 8]) if (Math.abs(T.wy(T.sy(y)) - y) > 1e-9) out.push('transform quadrant cassé en ' + y);
if (Math.abs(niceStep(45) - 2) > 1e-9) out.push('niceStep(45) = ' + niceStep(45) + ' au lieu de 2');
if (Math.abs(niceStep(400) - 0.2) > 1e-9) out.push('niceStep(400) = ' + niceStep(400) + ' au lieu de 0.2');
// distances
if (Math.abs(distToSegment(0,5, 0,0, 10,0) - 5) > 1e-9) out.push('distToSegment cassé');
if (Math.abs(distToLine(3,4, 0,0, 1,0) - 4) > 1e-9) out.push('distToLine cassé');
out.length ? ('ECHECS:\n' + out.join('\n')) : (ok + ' vérifications passées, aucune erreur');
