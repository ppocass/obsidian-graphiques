// Notations acceptées par l'analyseur — les françaises comprises.
let out = [], ok = 0;
const cas = [
  ['x²', 2, 4], ['x³', 2, 8], ['3x²-2x+1', 2, 9], ['-x²', 3, -9],
  ['0,5x', 4, 2], ['2,5', 0, 2.5], ['1,5×2', 0, 3],
  ['√x', 9, 3], ['√(x+7)', 2, 3], ['x÷2', 8, 4], ['sin x', 0, 0],
  ['max(1,5)', 0, 5],            // la virgule reste un séparateur dans une fonction
  ['e^x', 0, 1], ['exp(x)', 0, 1], ['2^x', 10, 1024], ['1/x', 4, 0.25],
  ['ln(x)', 1, 0], ['x^0.5', 9, 3], ['abs(-x)', 5, 5],
];
for (const [e, x, want] of cas) {
  try {
    const v = compile(e)(x);
    if (Math.abs(v - want) < 1e-9) ok++;
    else out.push('FAUX  ' + e + ' -> ' + v + ' (attendu ' + want + ')');
  } catch (err) { out.push('REFUS ' + e + ' : ' + err.message); }
}
out.length ? ('ECHECS:\n' + out.join('\n')) : (ok + ' vérifications (notations) passées')
