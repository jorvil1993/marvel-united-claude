/* Recorre todas las combinaciones de victorias, derrotas y decisiones de la campaña y avisa si algo se rompe.
   Uso: node herramientas/verificar-caminos.js js/data.js */
const fs = require('fs'); const vm = require('vm');
const src = fs.readFileSync(process.argv[2], 'utf8');
const ctx = {}; vm.createContext(ctx); vm.runInContext(src + ';this.C=CAPITULOS;this.D=DECISIONES;this.H=HEROES;this.V=VILLANOS;this.L=LUGARES;this.E=epilogoFinal;', ctx);
const { C, D, H, V, L } = ctx; const errores = [];
// estructura
for (const [id, c] of Object.entries(C)) {
  if (!V[c.villano]) errores.push(id + ' villano ' + c.villano);
  if (c.anillo.length !== 6 || new Set(c.anillo).size !== 6) errores.push(id + ' anillo');
  c.anillo.forEach(l => { if (!L[l]) errores.push(id + ' lugar ' + l); });
  Object.keys(c.notas || {}).forEach(l => { if (!c.anillo.includes(l)) errores.push(id + ' nota fuera de anillo ' + l); });
  (c.pistas?.lugares || []).forEach(l => { if (!c.anillo.includes(l)) errores.push(id + ' pista fuera ' + l); if (l === c.anillo[0] || l === c.anillo[3]) errores.push(id + ' pista en inicio ' + l); });
  if (c.heroes.length !== 3) errores.push(id + ' heroes');
  for (const r of ['victoria', 'derrota']) { const s = c[r].siguiente; if (s && !C[s] && !D[s]) errores.push(id + ' siguiente ' + s); }
}
const resolver = (h, f) => typeof h === 'string' ? h : (Object.entries(h.si).every(([k, v]) => f[k] === v) ? h.h : h.no);
// recorrer caminos
let caminos = 0; const cobertura = []; const reps = {};
function rec(nodo, f, camino, decs) {
  if (nodo === 'FIN') { caminos++; const hs = new Set(camino.flatMap(x => x.heroes)); cobertura.push(hs.size);
    const vs = camino.map(x => x.v); vs.forEach((v, i) => { if (i && vs[i - 1] === v) errores.push('repetido seguido ' + camino.map(x => x.id).join('>')); });
    const cnt = {}; vs.forEach(v => cnt[v] = (cnt[v] || 0) + 1); Object.entries(cnt).forEach(([v, n]) => { if (n > 2) reps[v + 'x' + n] = (reps[v + 'x' + n] || 0) + 1; });
    if (camino.length !== 10) errores.push('largo ' + camino.length);
    return; }
  if (D[nodo]) { const d = D[nodo]; for (const o of d.opciones) { const g = { ...f }; o.efectos.forEach(e => { if (e.flag) g[e.flag] = e.valor; });
      let sig = o.siguiente || d.siguiente || f.__trasDecision; rec(sig, g, camino, decs + 1); } return; }
  const c = C[nodo]; if (!c) { errores.push('nodo ' + nodo); return; }
  const heroes = c.heroes.map(h => resolver(h, f));
  heroes.forEach(h => { if (!H[h]) errores.push(nodo + ' heroe ' + h); });
  if (heroes.includes(c.villano + '-hero')) errores.push(nodo + ' antiheroe vs si mismo');
  if (new Set(heroes).size !== 3) errores.push(nodo + ' heroes repetidos');
  const paso = { id: nodo, v: c.villano, heroes };
  if (c.final) { rec('FIN', f, [...camino, paso], decs); return; }
  for (const r of ['victoria', 'derrota']) { const out = c[r]; const g = { ...f }; (out.efectos || []).forEach(e => { if (e.flag) g[e.flag] = e.valor; });
    g.__trasDecision = out.siguienteTrasDecision; rec(out.siguiente, g, [...camino, paso], decs); }
}
rec('I1', {}, [], 0);
console.log('caminos', caminos, 'errores', errores.length); console.log([...new Set(errores)].slice(0, 30).join('\n'));
const hist = {}; cobertura.forEach(n => hist[n] = (hist[n] || 0) + 1); console.log('heroes distintos por camino', JSON.stringify(hist)); console.log('villanos 3+ veces', JSON.stringify(reps));
