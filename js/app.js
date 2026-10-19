/* Telaraña Mutante — motor de campaña y pantallas */
(function () {
  "use strict";

  const CLAVE = "telarana-mutante-v1";
  const MISIONES = ["Rescatar Civiles", "Derrotar Matones", "Eliminar Amenazas"];

  /* ---------- Estado ---------- */
  function estadoInicial() {
    return {
      v: 1, cap: 1, fase: "prep",
      jugadores: ["Jorge", "Esposa"],
      panico: 0, ajuste: 0, racha: 0, carnage: 0,
      flags: {}, disponibles: [],
      exposicion: {}, publicos: [], heridos: [],
      pendientes: [], recompensa: null,
      prep: null, partida: null, resultado: null,
      historia: []
    };
  }
  let E = cargar();
  function cargar() {
    try {
      const raw = localStorage.getItem(CLAVE);
      if (raw) return Object.assign(estadoInicial(), JSON.parse(raw));
    } catch (e) { /* almacenamiento bloqueado: se juega sin guardar */ }
    const s = estadoInicial();
    desbloquear(s, CAPITULOS[0].llegan);
    return s;
  }
  function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(E)); } catch (e) { /* sin guardado */ } }
  function desbloquear(s, ids) { (ids || []).forEach(id => { if (!s.disponibles.includes(id)) s.disponibles.push(id); }); }

  const cap = () => CAPITULOS.find(c => c.id === E.cap);
  const esc = t => String(t).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const $ = s => document.querySelector(s);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------- Reglas de campaña ---------- */
  function heroeFijo(c) {
    if (c.fijoAlterno && E.flags.magneto !== "aliado") return c.fijoAlterno;
    return c.fijo;
  }
  function nivelDe(c) {
    let n = c.nivel + E.ajuste;
    if (c.final && E.panico >= 3) n += 1;
    return clamp(n, 0, 3);
  }
  function estadoPanico(p) {
    if (p <= 1) return { nombre: "Calma", texto: "Sin efecto en la mesa." };
    if (p <= 3) return { nombre: "Tensión", texto: "Al preparar, coloca 1 Matón extra en el Lugar inicial del villano." };
    return { nombre: "Caos", texto: "Al preparar, coloca 1 Matón extra en el Lugar inicial del villano y el villano empieza Acelerado." };
  }
  function prepActual() {
    const c = cap();
    if (!E.prep || E.prep.cap !== c.id) {
      const fijo = heroeFijo(c);
      const equipo = [fijo];
      if (c.fijo2) equipo.push(c.fijo2);
      else {
        const rec = c.recomendados.find(h => E.disponibles.includes(h) && h !== fijo);
        equipo.push(rec || E.disponibles.find(h => h !== fijo));
      }
      E.prep = { cap: c.id, equipo, tercero: null, invertir: false };
    }
    return E.prep;
  }
  function equipoActual() {
    const p = prepActual();
    return p.tercero ? [p.equipo[0], p.equipo[1], p.tercero] : [p.equipo[0], p.equipo[1]];
  }
  function quienJuega(i) {
    const p = prepActual();
    if (i === 2) return "Tercer héroe";
    const j = p.invertir ? 1 - i : i;
    return E.jugadores[j];
  }

  function pasosPreparacion(c, equipo) {
    const v = VILLANOS[c.villano];
    const n = equipo.length;
    const L = i => LUGARES[c.anillo[i]].nombre;
    const pasos = [];
    pasos.push({ t: `Tablero de ${v.nombre}`, d: `Colócalo arriba de la guía de Misiones con ${v.vida[n]} fichas de Vida (${n} héroes).` });
    if (c.villano === "magneto") pasos.push({ t: "Misiones", d: "Coloca «Usar Cerebro» en lugar de «Rescatar Civiles», más «Derrotar Matones» y «Eliminar Amenazas»." });
    else pasos.push({ t: "Misiones", d: "Coloca las 3 cartas de Misión en la guía." });
    pasos.push({ t: "Lugares", d: `En sentido horario: ${c.anillo.map((x, i) => L(i)).join(" → ")}. Llena los espacios impresos en cada Lugar con sus Civiles y Matones.` });
    if (c.villano === "green-goblin") pasos.push({ t: "Amenazas", d: "No coloques Amenazas ni fichas en los Lugares: deja el mazo de Amenazas boca abajo y las fichas aparte (preparación especial del Duende)." });
    else pasos.push({ t: "Amenazas", d: "Baraja las 6 Amenazas y pon 1 boca arriba bajo cada Lugar, con su ficha de Amenaza al lado. Los Secuaces llevan sus fichas de Vida." });
    pasos.push({ t: "Villano", d: `${v.nombre} empieza en ${L(0)}. Baraja su Plan Maestro y déjalo junto a ese Lugar.` });
    pasos.push({ t: "Héroes", d: `Todos empiezan en ${L(3)}, el Lugar opuesto al villano. Cada jugador baraja su mazo y roba 3 cartas.` });
    if (c.villano === "mystique") pasos.push({ t: "Senador Kelly", d: `Coloca su ficha en ${L(3)}, con los Héroes.` });
    if (c.villano === "sabretooth") pasos.push({ t: "Cazado", d: `${HEROES[c.primero || equipo[0]].nombre} empieza la partida y recibe la ficha de Cazado.` });
    if (c.villano === "carnage") pasos.push({ t: "Medidor de engendros", d: `Coloca el indicador en la casilla ${clamp(E.carnage, 0, 3)}.` });
    if (["rhino", "venom", "carnage"].includes(c.villano)) pasos.push({ t: "Fichas de Crisis", d: "Tenlas a mano (vienen en la caja X-Men)." });
    if (c.identidad) pasos.push({ t: "Identidad Secreta", d: `Coloca 1 Periodista en ${L(0)}, ${L(2)} y ${L(4)}.` });
    const nv = nivelDe(c);
    pasos.push({ t: `Dificultad: ${NIVELES[nv].nombre}`, d: NIVELES[nv].regla });

    const extra = [];
    equipo.forEach(h => {
      if (c.identidad && (E.exposicion[h] || 0) > 0 && !E.publicos.includes(h)) extra.push(`${HEROES[h].nombre} empieza con ${E.exposicion[h]} ficha(s) de Exposición de capítulos anteriores.`);
      if (E.heridos.includes(h)) extra.push(`${HEROES[h].nombre} está herido: roba 2 cartas en vez de 3.`);
    });
    const ep = estadoPanico(E.panico);
    if (E.panico >= 2) extra.push(`Pánico (${ep.nombre}): ${ep.texto.replace("Al preparar, c", "C")}`);
    E.pendientes.forEach(p => extra.push(`${p.de}: ${p.texto}`));
    if (E.recompensa) { const r = RECOMPENSAS.find(x => x.id === E.recompensa); extra.push(`Recompensa «${r.nombre}»: ${r.texto.replace("del próximo capítulo ", "").replace(" el próximo capítulo", "")}`); }
    if (c.final && E.panico <= 1) extra.push("La ciudad confía en ustedes: cada Héroe empieza con 1 ficha Comodín.");
    if (c.final && E.panico >= 3) extra.push("Pánico alto: la dificultad del final sube un nivel (ya aplicado arriba).");
    if (extra.length) pasos.push({ t: "Consecuencias de la campaña", d: extra, lista: true });

    pasos.push({ t: "¡A jugar!", d: c.villano === "sabretooth" ? "La partida empieza con el turno del villano; después juega Wolverine." : "La partida empieza con el turno del villano. Luego acuerden qué héroe juega primero." });
    return pasos;
  }

  /* ---------- Componentes ---------- */
  function retrato(id, cls = "") {
    const h = HEROES[id];
    return `<img class="retrato ${cls}" src="assets/char/${id}.jpg" alt="${esc(h ? h.nombre : id)}" loading="lazy">`;
  }
  function iconos(h) {
    const i = h.icons;
    return `<div class="iconos" aria-label="Iconos del mazo">
      <span class="ic ic-m" title="Mover">${i.m}<small>MOV</small></span>
      <span class="ic ic-a" title="Atacar">${i.a}<small>ATQ</small></span>
      <span class="ic ic-h" title="Heroica">${i.h}<small>HER</small></span>
      <span class="ic ic-c" title="Comodín">${i.c}<small>COM</small></span></div>`;
  }
  function caption(texto, cls = "") { return `<p class="caption ${cls}">${texto}</p>`; }

  function anillo(c) {
    const v = VILLANOS[c.villano];
    const nodos = c.anillo.map((id, i) => {
      const ang = (-90 + i * 60) * Math.PI / 180;
      const x = 50 + 37 * Math.cos(ang), y = 50 + 37 * Math.sin(ang);
      const marcas = [];
      if (i === 0) marcas.push(`<span class="marca marca-v">Villano</span>`);
      if (i === 3) marcas.push(`<span class="marca marca-h">Héroes</span>`);
      if (c.identidad && (i === 0 || i === 2 || i === 4)) marcas.push(`<span class="marca marca-p" title="Periodista">Prensa</span>`);
      return `<div class="nodo" style="left:${x}%;top:${y}%">
        <img src="assets/loc/${id}.jpg" alt="" loading="lazy"><span class="nodo-n">${esc(LUGARES[id].nombre)}</span>${marcas.join("")}</div>`;
    }).join("");
    return `<div class="anillo" role="img" aria-label="Disposición de los Lugares en sentido horario">
      <div class="anillo-centro"><img src="assets/char/${c.villano}.jpg" alt="${esc(v.nombre)}"></div>
      <svg class="anillo-flecha" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="37" fill="none" stroke="currentColor" stroke-width=".6" stroke-dasharray="2 2"/></svg>
      ${nodos}</div>`;
  }

  /* ---------- Vista: Historia ---------- */
  function vistaHistoria() {
    if (E.fase === "fin") return vistaFin();
    if (E.fase === "resultado") return vistaResultado();
    const c = cap(), v = VILLANOS[c.villano], acto = ACTOS[c.acto];
    const prev = E.historia[E.historia.length - 1];
    const p = prepActual(), equipo = equipoActual();
    const fijo = heroeFijo(c);

    const anterior = prev ? `<div class="anteriormente">${caption(`<b>Anteriormente…</b> ${esc(prev.resumen)}`)}</div>` : "";
    const opciones = E.disponibles.filter(h => h !== fijo && h !== (c.fijo2 || ""));
    const recomendados = c.recomendados.filter(h => E.disponibles.includes(h));

    const tarjetaHeroe = (id, i, fijoBool) => {
      const h = HEROES[id];
      return `<article class="heroe-sel ${fijoBool ? "es-fijo" : ""}">
        ${retrato(id)}
        <div class="heroe-sel-txt">
          <span class="etq">${fijoBool ? "Héroe de la historia" : i === 2 ? "Tercer héroe (opcional)" : "Compañero"}</span>
          <h4>${esc(h.nombre)}</h4>
          <span class="jugador">${esc(quienJuega(i))}</span>
          ${iconos(h)}
          ${E.heridos.includes(id) ? `<span class="chip chip-mal">Herido</span>` : ""}
        </div></article>`;
    };

    const selector = (slot) => {
      const actual = slot === 1 ? p.equipo[1] : p.tercero;
      return `<div class="selector" role="radiogroup" aria-label="${slot === 1 ? "Elige compañero" : "Elige tercer héroe"}">
        ${slot === 2 ? `<button class="chip ${!p.tercero ? "on" : ""}" data-sel="2" data-id="">Sin tercer héroe</button>` : ""}
        ${opciones.filter(h => slot === 1 ? h !== p.tercero : h !== p.equipo[1]).map(h => `
          <button class="chip ${actual === h ? "on" : ""}" data-sel="${slot}" data-id="${h}" aria-pressed="${actual === h}">
            ${recomendados.includes(h) ? "★ " : ""}${esc(HEROES[h].nombre)}</button>`).join("")}
      </div>`;
    };

    const pasos = pasosPreparacion(c, equipo);
    return `
    <section class="portada" style="background-image:url('assets/villain/${c.villano}-art.jpg')">
      <div class="portada-num" aria-hidden="true">#${c.id}</div>
      <div class="portada-txt">
        <span class="acto">${acto.nombre} · ${acto.titulo}</span>
        <h2>${esc(c.titulo)}</h2>
        <span class="contra">contra <b>${esc(v.nombre)}</b> · ${"★".repeat(v.dificultad)}${"☆".repeat(5 - v.dificultad)}</span>
      </div>
    </section>
    ${anterior}
    <section class="bloque">
      <h3 class="titulo-sec">La historia</h3>
      <div class="captions">${c.prologo.map(t => caption(esc(t))).join("")}</div>
    </section>
    <section class="bloque">
      <h3 class="titulo-sec">El equipo</h3>
      <p class="nota">${esc(c.porQue)}</p>
      <div class="equipo">
        ${tarjetaHeroe(p.equipo[0], 0, true)}
        ${tarjetaHeroe(p.equipo[1], 1, !!c.fijo2)}
        ${p.tercero ? tarjetaHeroe(p.tercero, 2, false) : ""}
      </div>
      ${c.fijo2 ? "" : `<h4 class="sub">Compañero ${recomendados.length ? "<small>★ recomendados para este villano</small>" : ""}</h4>${selector(1)}`}
      <h4 class="sub">Tercer héroe ${c.tercero ? "<small>recomendado en el final</small>" : "<small>sube la vida del villano</small>"}</h4>
      ${selector(2)}
      <button class="btn-sec" id="btnInvertir">Intercambiar quién juega cada héroe</button>
    </section>
    <section class="bloque">
      <h3 class="titulo-sec">Preparación de la mesa</h3>
      ${anillo(c)}
      <ol class="pasos">${pasos.map(s => `<li><b>${esc(s.t)}</b>${s.lista ? `<ul>${s.d.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : `<span>${esc(s.d)}</span>`}</li>`).join("")}</ol>
    </section>
    <div class="cta"><button class="btn" id="btnEmpezar">Empezar la partida</button></div>`;
  }

  /* ---------- Vista: Mesa ---------- */
  function vistaMesa() {
    const P = E.partida;
    if (!P) return `<section class="vacio">
      <p class="sfx sfx-chico">¿Listos?</p>
      <p>Prepara el capítulo ${E.cap} en <b>Historia</b> y toca «Empezar la partida». Aquí vas a llevar la vida del villano, las Misiones y los eventos.</p>
      <button class="btn" data-ir="historia">Ir a Historia</button></section>`;
    const c = cap(), v = VILLANOS[c.villano];
    const misiones = c.villano === "magneto" ? ["Usar Cerebro", MISIONES[1], MISIONES[2]] : MISIONES;
    const hechas = P.misiones.filter(Boolean).length;
    const vulnerable = hechas >= 2;
    const umbralVenom = P.equipo.length === 2 ? 8 : 6;

    return `
    <section class="mesa-villano">
      <img src="assets/char/${c.villano}.jpg" alt="">
      <div class="mv-txt">
        <span class="etq">Capítulo ${c.id} · ${esc(c.titulo)}</span>
        <h2>${esc(v.nombre)}</h2>
        <span class="estado-v ${vulnerable ? "ok" : ""}">${vulnerable ? "Ya pueden dañarlo" : `Invulnerable hasta completar 2 Misiones (${hechas}/2)`}</span>
      </div>
      <div class="vida" aria-live="polite">
        <button class="redondo" data-vida="1" aria-label="Sumar vida">+</button>
        <div class="vida-num"><b>${P.vida}</b><small>/ ${P.vidaMax}</small></div>
        <button class="redondo rojo" data-vida="-1" aria-label="Quitar vida" ${vulnerable ? "" : "disabled"}>−</button>
      </div>
    </section>

    <section class="bloque">
      <h3 class="titulo-sec">Misiones</h3>
      <div class="misiones">${misiones.map((m, i) => `
        <button class="mision ${P.misiones[i] ? "hecha" : ""}" data-mision="${i}" aria-pressed="${P.misiones[i]}">
          <span class="check" aria-hidden="true">${P.misiones[i] ? "✔" : ""}</span>${esc(m)}</button>`).join("")}</div>
      <p class="nota">Al completar la 1ª Misión el villano queda <b>Bajo Presión</b>: juega Plan Maestro cada 2 cartas de héroe en vez de 3. Con la 2ª ya pueden dañarlo. Con la 3ª, cada héroe roba 1 carta.</p>
    </section>

    <section class="bloque">
      <h3 class="titulo-sec">Viñetas</h3>
      <div class="vinetas">
        ${["inicio", "presion", "segunda"].map(k => {
          const b = c.viñetas[k]; const abierta = k === "inicio" || (k === "presion" && hechas >= 1) || (k === "segunda" && hechas >= 2);
          return `<button class="vineta ${abierta ? "" : "cerrada"}" data-vineta="${k}" ${abierta ? "" : "disabled"}>
            <span class="vineta-k">${k === "inicio" ? "Inicio" : k === "presion" ? "1ª Misión" : "2ª Misión"}</span>
            <span>${abierta ? esc(b.titulo) : "Se revela al avanzar"}</span></button>`;
        }).join("")}
      </div>
    </section>

    ${c.villano === "carnage" ? `<section class="bloque">
      <h3 class="titulo-sec">Medidor de engendros</h3>
      <div class="medidor">${Array.from({ length: 11 }, (_, i) => `<button class="celda ${i <= P.medidor ? "llena" : ""} ${i === 10 ? "fatal" : ""}" data-medidor="${i}" aria-label="Medidor en ${i}">${i}</button>`).join("")}</div>
    </section>` : ""}

    <section class="bloque">
      <h3 class="titulo-sec">Héroes</h3>
      <div class="mesa-heroes">${P.equipo.map(h => `
        <article class="mh">
          ${retrato(h)}
          <div class="mh-txt"><h4>${esc(HEROES[h].nombre)}</h4>
          ${c.identidad && !E.publicos.includes(h) ? contador("exp", h, P.exp[h] || 0, "Exposición", 3) : ""}
          ${c.villano === "venom" ? contador("crisis", h, P.crisis[h] || 0, `Crisis (fuera a las ${umbralVenom})`, umbralVenom) : ""}
          <label class="ko"><input type="checkbox" id="ko-${h}" data-ko="${h}" ${P.ko[h] ? "checked" : ""}> Quedó fuera de combate</label>
          </div></article>`).join("")}</div>
    </section>

    <section class="bloque resolver">
      <h3 class="titulo-sec">¿Cómo terminó?</h3>
      ${P.confirmar ? `<div class="confirma">
          <p>${P.confirmar === "gano" ? "¿Confirmas que derrotaron a " + esc(v.nombre) + "?" : "¿Confirmas que el villano completó su plan?"}</p>
          <div class="fila"><button class="btn" id="btnConfirmar">Sí, ${P.confirmar === "gano" ? "ganamos" : "perdimos"}</button><button class="btn-sec" id="btnCancelar">Volver</button></div></div>`
        : `<div class="fila"><button class="btn verde" data-fin="gano">Ganamos</button><button class="btn rojo" data-fin="perdio">Perdimos</button></div>`}
    </section>`;
  }
  function contador(tipo, h, val, nombre, max) {
    return `<div class="cont"><span>${nombre}</span>
      <button class="mini" data-cont="${tipo}" data-h="${h}" data-d="-1" aria-label="Restar">−</button>
      <b class="${val >= max ? "alerta" : ""}">${val}</b>
      <button class="mini" data-cont="${tipo}" data-h="${h}" data-d="1" aria-label="Sumar">+</button></div>`;
  }

  /* ---------- Resultado ---------- */
  function vistaResultado() {
    const R = E.resultado, c = CAPITULOS.find(x => x.id === R.cap), out = R.gano ? c.victoria : c.derrota;
    const avisos = R.avisos || [];
    const decision = c.decision;
    const puedeSeguir = (!decision || R.decision) && (!R.gano || c.final || R.recompensa);
    return `
    <section class="resultado ${R.gano ? "gano" : "perdio"}">
      <p class="sfx">${R.gano ? "¡Victoria!" : "Derrota"}</p>
      <h2>${esc(out.titulo)}</h2>
    </section>
    <section class="bloque"><div class="captions">${out.texto.map(t => caption(esc(t))).join("")}</div></section>
    ${avisos.length ? `<section class="bloque"><h3 class="titulo-sec">Lo que cambia</h3><ul class="avisos">${avisos.map(a => `<li>${esc(a)}</li>`).join("")}</ul></section>` : ""}
    ${R.gano && !c.final ? `<section class="bloque"><h3 class="titulo-sec">Elijan su recompensa</h3>
      <div class="opciones">${RECOMPENSAS.map(r => `<button class="opcion ${R.recompensa === r.id ? "on" : ""}" data-recompensa="${r.id}" aria-pressed="${R.recompensa === r.id}"><b>${esc(r.nombre)}</b><span>${esc(r.texto)}</span></button>`).join("")}</div></section>` : ""}
    ${decision ? `<section class="bloque decision"><h3 class="titulo-sec">${esc(decision.titulo)}</h3>
      ${caption(esc(decision.texto))}
      <div class="opciones">${decision.opciones.map(o => `<button class="opcion ${R.decision === o.id ? "on" : ""}" data-decision="${o.id}" ${R.decision && R.decision !== o.id ? "disabled" : ""}><b>${esc(o.nombre)}</b><span>${esc(o.texto)}</span></button>`).join("")}</div>
      ${R.decision ? "" : `<p class="nota">La decisión es definitiva: piénsenla juntos.</p>`}</section>` : ""}
    <div class="cta"><button class="btn" id="btnSeguir" ${puedeSeguir ? "" : "disabled"}>${c.final ? "Ver el final" : `Continuar al capítulo ${c.id + 1}`}</button></div>`;
  }

  function vistaFin() {
    const ult = E.historia[E.historia.length - 1];
    const gano = ult && ult.gano;
    const c = CAPITULOS[CAPITULOS.length - 1];
    const lineas = lineasFinales(E, gano);
    const victorias = E.historia.filter(h => h.gano).length;
    return `
    <section class="resultado ${gano ? "gano" : "perdio"}">
      <p class="sfx">${gano ? "Fin" : "Continuará…"}</p>
      <h2>Telaraña Mutante</h2>
    </section>
    <section class="bloque"><div class="captions">${(gano ? c.victoria : c.derrota).texto.concat(lineas).map(t => caption(esc(t))).join("")}</div></section>
    <section class="bloque"><h3 class="titulo-sec">La campaña en números</h3>
      <div class="numeros"><div><b>${victorias}</b><span>victorias</span></div><div><b>${E.historia.length - victorias}</b><span>derrotas</span></div><div><b>${E.panico}</b><span>pánico final</span></div></div>
    </section>
    <div class="cta"><button class="btn-sec" data-ir="campana">Ver la bitácora</button></div>`;
  }

  /* ---------- Vista: Archivo ---------- */
  let pestanaArchivo = "heroes";
  function vistaArchivo() {
    const tabs = [["heroes", "Héroes"], ["villanos", "Villanos"], ["lugares", "Lugares"], ["reglas", "Reglas"]];
    let cuerpo = "";
    if (pestanaArchivo === "heroes") cuerpo = `<div class="grilla-h">${Object.keys(HEROES).map(id => {
      const h = HEROES[id], ok = E.disponibles.includes(id);
      return `<article class="ficha ${ok ? "" : "bloqueada"}">${retrato(id)}<div class="ficha-txt">
        <span class="etq">${h.caja}${h.antiheroe ? " · Antihéroe" : ""}${ok ? "" : " · Aún no aparece"}</span>
        <h4>${esc(h.nombre)} <small>${esc(h.alias)}</small></h4><p class="rol">${esc(h.rol)}</p>${iconos(h)}
        <ul class="esp">${h.especiales.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
        <p><b>Fuerte:</b> ${esc(h.fuerte)}</p><p><b>Débil:</b> ${esc(h.debil)}</p><p><b>Brilla contra:</b> ${esc(h.contra)}</p></div></article>`;
    }).join("")}</div>`;
    if (pestanaArchivo === "villanos") cuerpo = `<div class="grilla-v">${Object.keys(VILLANOS).map(id => {
      const v = VILLANOS[id];
      return `<article class="villano-f"><img class="tablero" src="assets/villain/${id}-board.jpg" alt="Tablero de ${esc(v.nombre)}" loading="lazy">
        <div class="ficha-txt"><span class="etq">Dificultad ${"★".repeat(v.dificultad)}${"☆".repeat(5 - v.dificultad)} · Vida 2/3/4 héroes: ${v.vida[2]}/${v.vida[3]}/${v.vida[4]}</span>
        <h4>${esc(v.nombre)} <small>${esc(v.alias)}</small></h4>
        <p><b>Reglas especiales:</b> ${esc(v.especial)}</p><p><b>BAM:</b> ${esc(v.bam)}</p><p><b>Exceso:</b> ${esc(v.exceso)}</p><p><b>Complot:</b> ${esc(v.complot)}</p>
        ${v.prep.map(x => `<p><b>Preparación:</b> ${esc(x.replace(/^Preparación especial[^:]*: /, ""))}</p>`).join("")}
        ${caption(esc(v.consejo), "caption-tip")}</div></article>`;
    }).join("")}</div>`;
    if (pestanaArchivo === "lugares") cuerpo = `<p class="nota">Los 14 Lugares que tienes: 6 de Enter the Spider-Verse y 8 de la caja X-Men.</p>
      <div class="grilla-l">${Object.keys(LUGARES).map(id => {
        const l = LUGARES[id];
        return `<article class="lugar"><img src="assets/loc/${id}.jpg" alt="Carta de ${esc(l.nombre)}" loading="lazy"><div><span class="etq">${l.caja}</span><h4>${esc(l.nombre)}</h4><p>${esc(l.efecto)}</p></div></article>`;
      }).join("")}</div>`;
    if (pestanaArchivo === "reglas") cuerpo = `<div class="reglas">
      <h4>Turno del villano</h4><p>Roba una carta de Plan Maestro y resuélvela de arriba abajo: mueve al villano en sentido horario, activa ¡BAM! (tablero y Amenazas), añade Matones y Civiles alrededor y aplica el efecto especial. Si no caben fichas, se activa su Exceso.</p>
      <h4>Turno del héroe</h4><p>Roba 1 carta, juega 1 carta en la Trama y usa sus iconos más los iconos de la carta de héroe anterior (no su texto especial). Al final, si tu Lugar no tiene Amenaza, puedes usar su efecto de Fin del Turno.</p>
      <h4>Ritmo</h4><p>El villano juega después de cada 3 cartas de héroe. Con la 1ª Misión completa queda <b>Bajo Presión</b> y juega cada 2 cartas.</p>
      <h4>Dañar al villano</h4><p>Solo después de completar 2 Misiones. Ningún efecto de esta campaña se salta esa regla.</p>
      <h4>Daño a los héroes</h4><p>Por cada daño, descarta 1 carta de tu mano al fondo de tu mazo. Sin cartas en la mano quedas fuera de combate: se activa el ¡BAM! del villano y en tu siguiente turno robas hasta 4.</p>
      <h4>Derrota</h4><p>Pierden si el villano cumple su Complot, si tiene que robar Plan Maestro y su mazo está vacío, o si un héroe empieza su turno sin cartas en mano ni mazo.</p>
      <h4>Frenado y Acelerado</h4><p>Frenado: el villano juega su siguiente carta 1 turno más tarde (ficha verde sobre su mazo). Acelerado: 1 turno antes (ficha naranja al final de la Trama). Si tiene las dos, se anulan.</p>
      <h4>Identidad Secreta</h4><p>Un héroe en un Lugar con Periodista que hace cualquier acción distinta de Mover recibe 1 Exposición (máximo 1 por turno). Con una acción Heroica puedes mover un Periodista a un Lugar adyacente (si sale de tu Lugar, te expones). Con 3 Exposiciones: 1 daño y tu próxima carta va boca abajo. En esta campaña la Exposición se arrastra entre capítulos.</p>
      <h4>Reglas propias de la campaña</h4><p><b>Herido:</b> si pierden, cada héroe que quedó fuera de combate roba solo 2 cartas la próxima vez que juegue. <b>Pánico:</b> sube con las derrotas y baja con algunas decisiones; con 2-3 añade 1 Matón al preparar, con 4-5 además el villano empieza Acelerado. <b>Dificultad adaptativa:</b> tras una derrota baja un nivel; tras 2 victorias seguidas sube uno.</p></div>`;
    return `<nav class="pestanas" role="tablist">${tabs.map(([k, n]) => `<button role="tab" aria-selected="${pestanaArchivo === k}" class="${pestanaArchivo === k ? "on" : ""}" data-archivo="${k}">${n}</button>`).join("")}</nav>${cuerpo}`;
  }

  /* ---------- Vista: Campaña ---------- */
  let confirmarReinicio = false;
  function vistaCampana() {
    const ep = estadoPanico(E.panico);
    const linea = CAPITULOS.map(c => {
      const h = E.historia.find(x => x.cap === c.id);
      const estado = h ? (h.gano ? "gano" : "perdio") : c.id === E.cap && E.fase !== "fin" ? "actual" : "futuro";
      return `<li class="issue ${estado}"><img src="assets/char/${c.villano}.jpg" alt=""><span class="issue-n">#${c.id}</span>
        <span class="issue-t">${esc(c.titulo)}</span>${h ? `<span class="sello">${h.gano ? "Victoria" : "Derrota"}</span>` : ""}</li>`;
    }).join("");
    const flags = [];
    if (E.flags.eddie) flags.push(E.flags.eddie === "aliado" ? "Eddie Brock quedó libre bajo palabra." : "Eddie Brock fue enviado a Ravencroft.");
    if (E.flags.kelly) flags.push(E.flags.kelly === "salvado" ? "El Senador Kelly sobrevivió y agradeció a un mutante." : "El Senador Kelly fue herido e impulsa el registro.");
    if (E.flags.magneto) flags.push(E.flags.magneto === "aliado" ? "Magneto es su aliado." : "Rechazaron a Magneto.");
    if (E.flags.osborn) flags.push(E.flags.osborn === "arrestado" ? "Osborn está preso." : "Osborn huyó sin poderes.");
    const exp = Object.entries(E.exposicion).filter(([, n]) => n > 0);
    return `
    <section class="bloque">
      <h3 class="titulo-sec">Pánico en Nueva York</h3>
      <div class="panico" role="meter" aria-valuemin="0" aria-valuemax="5" aria-valuenow="${E.panico}">
        ${[0, 1, 2, 3, 4, 5].map(i => `<span class="seg ${i <= E.panico ? "on" : ""} n${i}">${i}</span>`).join("")}</div>
      <p class="nota"><b>${ep.nombre}.</b> ${ep.texto}</p>
      <p class="nota">Ajuste de dificultad: ${E.ajuste > 0 ? "+1 (vienen ganando)" : E.ajuste < 0 ? "−1 (la alianza necesita aire)" : "ninguno"}. Medidor inicial de Carnage: ${clamp(E.carnage, 0, 3)}.</p>
    </section>
    <section class="bloque"><h3 class="titulo-sec">Los 10 números</h3><ol class="linea">${linea}</ol></section>
    <section class="bloque"><h3 class="titulo-sec">Lo que decidieron</h3>${flags.length ? `<ul class="avisos">${flags.map(f => `<li>${esc(f)}</li>`).join("")}</ul>` : `<p class="nota">Todavía nada: las decisiones llegan en los capítulos 3 y 7.</p>`}
      ${E.heridos.length ? `<p class="nota"><b>Heridos:</b> ${E.heridos.map(h => esc(HEROES[h].nombre)).join(", ")}.</p>` : ""}
      ${exp.length ? `<p class="nota"><b>Exposición acumulada:</b> ${exp.map(([h, n]) => `${esc(HEROES[h].nombre)} ${n}/3`).join(", ")}.</p>` : ""}
      ${E.publicos.length ? `<p class="nota"><b>Identidad pública:</b> ${E.publicos.map(h => esc(HEROES[h].nombre)).join(", ")}.</p>` : ""}
    </section>
    <section class="bloque"><h3 class="titulo-sec">Jugadores</h3>
      <div class="fila">
        <label class="campo">Jugador 1<input id="nombre0" value="${esc(E.jugadores[0])}" maxlength="20"></label>
        <label class="campo">Jugador 2<input id="nombre1" value="${esc(E.jugadores[1])}" maxlength="20"></label>
      </div>
    </section>
    <section class="bloque"><h3 class="titulo-sec">Respaldo</h3>
      <p class="nota">La campaña se guarda en este celular. Para pasarla a otro, exporta el archivo y luego impórtalo allá.</p>
      <div class="fila"><button class="btn-sec" id="btnExportar">Exportar campaña</button>
      <label class="btn-sec archivo-in">Importar campaña<input type="file" id="inImportar" accept="application/json"></label></div>
      <p class="nota" id="msgRespaldo" role="status"></p>
      ${confirmarReinicio ? `<div class="confirma"><p>Esto borra toda la campaña y vuelve al capítulo 1.</p><div class="fila"><button class="btn rojo" id="btnReinicioSi">Sí, empezar de cero</button><button class="btn-sec" id="btnReinicioNo">Cancelar</button></div></div>`
        : `<button class="btn-sec peligro" id="btnReiniciar">Empezar la campaña de cero</button>`}
    </section>`;
  }

  /* ---------- Acciones ---------- */
  function empezar() {
    const c = cap(), equipo = equipoActual();
    E.partida = {
      cap: c.id, equipo, vidaMax: VILLANOS[c.villano].vida[equipo.length], vida: VILLANOS[c.villano].vida[equipo.length],
      misiones: [false, false, false], exp: {}, crisis: {}, ko: {}, medidor: clamp(E.carnage, 0, 3), vistas: {}, confirmar: null
    };
    equipo.forEach(h => { if (c.identidad && !E.publicos.includes(h)) E.partida.exp[h] = E.exposicion[h] || 0; });
    E.heridos = E.heridos.filter(h => !equipo.includes(h));
    E.pendientes = []; E.recompensa = null;
    guardar(); ir("mesa");
    abrirVineta("inicio");
  }

  function terminar(gano) {
    const c = cap(), P = E.partida, out = gano ? c.victoria : c.derrota;
    const avisos = [];
    // Exposición acumulada
    if (c.identidad) Object.entries(P.exp).forEach(([h, n]) => {
      if (n >= 3) { E.publicos.push(h); E.exposicion[h] = 0; if (!E.heridos.includes(h)) E.heridos.push(h); avisos.push(`La identidad de ${HEROES[h].nombre} ya es pública. La prensa no lo deja en paz: la próxima vez que juegue estará herido.`); }
      else E.exposicion[h] = n;
    });
    if (!gano) P.equipo.forEach(h => { if (P.ko[h] && !E.heridos.includes(h)) { E.heridos.push(h); avisos.push(`${HEROES[h].nombre} quedó herido: robará 2 cartas la próxima vez que juegue.`); } });
    aplicarEfectos(out.efectos, avisos);
    (out.pendientes || []).forEach(t => { E.pendientes.push({ de: `Capítulo ${c.id}`, texto: t }); avisos.push(`En el próximo capítulo: ${t}`); });
    if (gano) { E.racha += 1; if (E.racha >= 2) { if (E.ajuste < 1) { E.ajuste += 1; avisos.push("Dos victorias seguidas: la dificultad sube un nivel."); } E.racha = 0; } }
    else { E.racha = 0; if (E.ajuste > -1) { E.ajuste -= 1; avisos.push("La alianza necesita aire: la dificultad baja un nivel."); } }
    E.historia.push({ cap: c.id, gano, equipo: P.equipo, resumen: out.resumen, fecha: new Date().toISOString() });
    E.resultado = { cap: c.id, gano, avisos, recompensa: null, decision: null };
    E.partida = null; E.fase = "resultado";
    guardar(); ir("historia");
  }

  function aplicarEfectos(lista, avisos) {
    (lista || []).forEach(ef => {
      if (ef.panico) { const antes = E.panico; E.panico = clamp(E.panico + ef.panico, 0, 5); if (E.panico !== antes) avisos.push(`El Pánico ${ef.panico > 0 ? "sube" : "baja"} a ${E.panico}.`); }
      if (ef.flag) E.flags[ef.flag] = ef.valor;
      if (ef.carnage) { E.carnage += ef.carnage; avisos.push(`El medidor de Carnage empezará en ${clamp(E.carnage, 0, 3)} en el final.`); }
      if (ef.unlock) { desbloquear(E, [ef.unlock]); avisos.push(`${HEROES[ef.unlock].nombre} se une al equipo.`); }
      if (ef.panicoSi && E.flags[ef.panicoSi.flag] === ef.panicoSi.valor) { E.panico = clamp(E.panico + ef.panicoSi.n, 0, 5); avisos.push(`El Pánico sube a ${E.panico}.`); }
    });
  }

  function decidir(id) {
    const R = E.resultado, c = CAPITULOS.find(x => x.id === R.cap);
    if (R.decision) return;
    const o = c.decision.opciones.find(x => x.id === id);
    R.decision = id;
    aplicarEfectos(o.efectos, R.avisos);
    (o.pendientes || []).forEach(t => E.pendientes.push({ de: `Decisión del capítulo ${c.id}`, texto: t }));
    E.historia[E.historia.length - 1].decision = o.nombre;
    guardar(); render();
  }

  function seguir() {
    const R = E.resultado, c = CAPITULOS.find(x => x.id === R.cap);
    if (R.recompensa) E.recompensa = R.recompensa;
    E.resultado = null; E.prep = null;
    if (c.final) { E.fase = "fin"; guardar(); render(); return; }
    E.cap = c.id + 1; E.fase = "prep";
    const sig = cap();
    desbloquear(E, sig.llegan);
    if (sig.final && E.flags.eddie === "ravencroft") desbloquear(E, ["venom-hero"]);
    guardar(); render(); window.scrollTo(0, 0);
  }

  /* ---------- Viñeta modal ---------- */
  function abrirVineta(k) {
    const c = cap(), b = c.viñetas[k];
    const etiqueta = { inicio: "Comienza la partida", presion: "¡Bajo Presión!", segunda: "¡Segunda Misión!" }[k];
    const regla = { inicio: "", presion: "El villano ahora juega Plan Maestro cada 2 cartas de héroe.", segunda: "Ya pueden dañar al villano." }[k];
    $("#modal").innerHTML = `<div class="modal-caja" role="dialog" aria-modal="true" aria-labelledby="mTitulo">
      <p class="sfx sfx-chico">${etiqueta}</p>
      <h3 id="mTitulo">${esc(b.titulo)}</h3>
      ${caption(esc(b.texto))}
      ${b.efecto ? `<p class="efecto"><b>En la mesa:</b> ${esc(b.efecto)}</p>` : ""}
      ${regla ? `<p class="nota">${regla}</p>` : ""}
      <button class="btn" id="cerrarModal">Seguir jugando</button></div>`;
    $("#modal").hidden = false;
    $("#cerrarModal").focus();
  }

  /* ---------- Navegación y render ---------- */
  let vista = E.partida ? "mesa" : "historia";
  function ir(v) { vista = v; render(); window.scrollTo(0, 0); }
  function render() {
    const vistas = { historia: vistaHistoria, mesa: vistaMesa, archivo: vistaArchivo, campana: vistaCampana };
    $("#vista").innerHTML = vistas[vista]();
    document.querySelectorAll(".nav button").forEach(b => b.setAttribute("aria-current", b.dataset.ir === vista ? "page" : "false"));
    $("#capActual").textContent = E.fase === "fin" ? "Campaña terminada" : `Capítulo ${E.cap} de 10`;
  }

  document.addEventListener("click", ev => {
    const t = ev.target.closest("button, [data-ir]");
    if (!t) return;
    const d = t.dataset;
    if (d.ir) return ir(d.ir);
    if (t.id === "cerrarModal") { $("#modal").hidden = true; return; }
    if (d.sel) {
      const p = prepActual();
      if (d.sel === "1") p.equipo[1] = d.id; else p.tercero = d.id || null;
      guardar(); return render();
    }
    if (t.id === "btnInvertir") { prepActual().invertir = !prepActual().invertir; guardar(); return render(); }
    if (t.id === "btnEmpezar") return empezar();
    const P = E.partida;
    if (d.vida && P) { P.vida = clamp(P.vida + Number(d.vida), 0, P.vidaMax); guardar(); return render(); }
    if (d.mision && P) {
      const i = Number(d.mision); const antes = P.misiones.filter(Boolean).length;
      P.misiones[i] = !P.misiones[i]; const ahora = P.misiones.filter(Boolean).length;
      guardar(); render();
      if (ahora > antes) {
        if (ahora === 1 && !P.vistas.presion) { P.vistas.presion = true; guardar(); abrirVineta("presion"); }
        else if (ahora === 2 && !P.vistas.segunda) { P.vistas.segunda = true; guardar(); abrirVineta("segunda"); }
        else if (ahora === 3) { $("#modal").innerHTML = `<div class="modal-caja" role="dialog" aria-modal="true"><p class="sfx sfx-chico">¡Tercera Misión!</p><p class="efecto">Cada héroe roba 1 carta de su mazo.</p><button class="btn" id="cerrarModal">Seguir jugando</button></div>`; $("#modal").hidden = false; }
      }
      return;
    }
    if (d.vineta) return abrirVineta(d.vineta);
    if (d.medidor && P) { P.medidor = Number(d.medidor); guardar(); return render(); }
    if (d.cont && P) { const k = d.cont === "exp" ? "exp" : "crisis"; P[k][d.h] = Math.max(0, (P[k][d.h] || 0) + Number(d.d)); if (k === "exp") P.exp[d.h] = Math.min(3, P.exp[d.h]); guardar(); return render(); }
    if (d.fin && P) { P.confirmar = d.fin; guardar(); return render(); }
    if (t.id === "btnCancelar" && P) { P.confirmar = null; guardar(); return render(); }
    if (t.id === "btnConfirmar" && P) return terminar(P.confirmar === "gano");
    if (d.recompensa && E.resultado) { E.resultado.recompensa = d.recompensa; guardar(); return render(); }
    if (d.decision) return decidir(d.decision);
    if (t.id === "btnSeguir") return seguir();
    if (d.archivo) { pestanaArchivo = d.archivo; return render(); }
    if (t.id === "btnReiniciar") { confirmarReinicio = true; return render(); }
    if (t.id === "btnReinicioNo") { confirmarReinicio = false; return render(); }
    if (t.id === "btnReinicioSi") { confirmarReinicio = false; E = estadoInicial(); desbloquear(E, CAPITULOS[0].llegan); guardar(); return ir("historia"); }
    if (t.id === "btnExportar") {
      const blob = new Blob([JSON.stringify(E, null, 2)], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `telarana-mutante-cap${E.cap}.json`; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      $("#msgRespaldo").textContent = "Archivo descargado.";
    }
  });

  document.addEventListener("change", ev => {
    const t = ev.target;
    if (t.dataset.ko && E.partida) { E.partida.ko[t.dataset.ko] = t.checked; guardar(); }
    if (t.id === "nombre0" || t.id === "nombre1") { E.jugadores[Number(t.id.slice(-1))] = t.value.trim() || (t.id === "nombre0" ? "Jugador 1" : "Jugador 2"); guardar(); }
    if (t.id === "inImportar" && t.files[0]) {
      const r = new FileReader();
      r.onload = () => {
        try {
          const s = JSON.parse(r.result);
          if (!s || typeof s.cap !== "number" || !Array.isArray(s.historia)) throw new Error();
          E = Object.assign(estadoInicial(), s); guardar(); ir("campana");
          $("#msgRespaldo").textContent = `Campaña importada: capítulo ${E.cap}.`;
        } catch (e) { $("#msgRespaldo").textContent = "Ese archivo no es una campaña de Telaraña Mutante. Elige el .json que exportaste."; }
      };
      r.readAsText(t.files[0]);
    }
  });

  document.addEventListener("keydown", ev => { if (ev.key === "Escape" && !$("#modal").hidden) $("#modal").hidden = true; });
  $("#modal").addEventListener("click", ev => { if (ev.target.id === "modal") $("#modal").hidden = true; });

  render();
  if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
})();
