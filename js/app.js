/* Telaraña Mutante — motor de campaña y pantallas (v2)
   Flujo: el celular se usa al preparar la mesa y al terminar la partida. Nada se revela a mitad del juego. */
(function () {
  "use strict";

  const CLAVE = "telarana-mutante-v2";
  const MISIONES = ["Rescatar Civiles", "Derrotar Matones", "Eliminar Amenazas"];

  /* ---------- Estado ---------- */
  function estadoInicial() {
    return {
      v: 2, nodo: "I1", fase: "prep",
      jugadores: ["Jorge", "Carol", "José"],
      dificultad: "normal",
      panico: 0, carnage: 0, flags: {}, xp: {},
      heridos: [], exposicion: {}, publicos: [],
      pendientes: [], ayuda: false, frenado: false,
      asignacion: null, partida: null, resultado: null, decision: null,
      historia: []
    };
  }
  let E = cargar();
  function cargar() {
    try {
      const raw = localStorage.getItem(CLAVE);
      if (raw) return Object.assign(estadoInicial(), JSON.parse(raw));
    } catch (e) { /* almacenamiento bloqueado: se juega sin guardar */ }
    return estadoInicial();
  }
  function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(E)); } catch (e) { /* sin guardado */ } }

  const esc = t => String(t).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const $ = s => document.querySelector(s);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const cap = (id = E.nodo) => CAPITULOS[id];

  /* ---------- Condiciones de texto ---------- */
  function cumple(x) {
    if (typeof x === "string") return true;
    if (x.si) return Object.entries(x.si).every(([k, v]) => E.flags[k] === v);
    if (x.vio) return E.historia.some(h => CAPITULOS[h.nodo] && CAPITULOS[h.nodo].villano === x.vio);
    return true;
  }
  const texto = x => typeof x === "string" ? x : x.t;
  const lineas = arr => (arr || []).filter(cumple).map(texto);
  const resolverHeroe = h => typeof h === "string" ? h : (Object.entries(h.si).every(([k, v]) => E.flags[k] === v) ? h.h : h.no);
  const heroesDe = c => c.heroes.map(resolverHeroe);

  /* ---------- Reglas de campaña ---------- */
  const dificultad = () => DIFICULTADES.find(d => d.id === E.dificultad) || DIFICULTADES[1];
  function nivelDe(c) {
    let n = (c.nivel || 0) + dificultad().ajuste;
    if (c.final && E.panico >= 3) n += 1;
    return clamp(n, 0, 3);
  }
  function nivelHeroe(h) { const x = E.xp[h] || 0; return x >= 3 ? 3 : x >= 1 ? 2 : 1; }
  function estadoPanico(p) {
    if (p <= 1) return { nombre: "Calma", texto: "Sin efecto en la mesa." };
    if (p <= 3) return { nombre: "Tensión", texto: "Al preparar, se coloca 1 Matón extra en el Lugar inicial del villano." };
    return { nombre: "Caos", texto: "Al preparar, se coloca 1 Matón extra en el Lugar inicial del villano y el villano empieza Acelerado." };
  }
  function asignacion() {
    const c = cap();
    if (!E.asignacion || E.asignacion.nodo !== E.nodo) {
      const hs = heroesDe(c), k = E.historia.length;
      const mapa = {};
      hs.forEach((h, i) => { mapa[h] = (k + i) % 3; });
      E.asignacion = { nodo: E.nodo, mapa };
    }
    return E.asignacion.mapa;
  }
  const equipoJugando = () => heroesDe(cap()).filter(h => asignacion()[h] !== -1);

  function pasosPreparacion(c, equipo) {
    const v = VILLANOS[c.villano], n = equipo.length, L = i => LUGARES[c.anillo[i]].nombre;
    const pasos = [];
    pasos.push({ t: `Tablero de ${v.nombre}`, d: `Colócalo arriba de la guía de Misiones con ${v.vida[n]} fichas de Vida (${n} héroes).` });
    pasos.push({ t: "Misiones", d: c.villano === "magneto" ? "Coloca «Usar Cerebro» en lugar de «Rescatar Civiles», más «Derrotar Matones» y «Eliminar Amenazas»." : "Coloca las 3 cartas de Misión en la guía." });
    pasos.push({ t: "Lugares", d: `En sentido horario: ${c.anillo.map((x, i) => L(i)).join(" → ")}. Llena los espacios impresos en cada Lugar con sus Civiles y Matones.` });
    pasos.push({ t: "Amenazas", d: c.villano === "green-goblin" ? "No coloques Amenazas ni fichas en los Lugares: deja su mazo boca abajo y las fichas aparte (preparación especial del Duende)." : "Baraja las 6 Amenazas y pon 1 boca arriba bajo cada Lugar, con su ficha de Amenaza al lado. Los Secuaces llevan sus fichas de Vida." });
    pasos.push({ t: "Villano", d: `${v.nombre} empieza en ${L(0)}. Baraja su Plan Maestro y déjalo junto a ese Lugar.` });
    const herido = equipo.filter(h => E.heridos.includes(h));
    pasos.push({ t: "Héroes", d: `Todos empiezan en ${L(3)}, el Lugar opuesto al villano. Cada jugador baraja su mazo y roba 3 cartas${herido.length ? ` (${herido.map(h => HEROES[h].nombre).join(" y ")} roba${herido.length > 1 ? "n" : ""} 2: está${herido.length > 1 ? "n" : ""} herido${herido.length > 1 ? "s" : ""})` : ""}.` });
    if (c.villano === "mystique") pasos.push({ t: "Senador Kelly", d: `Coloca su ficha en ${L(3)}, con los Héroes.` });
    if (c.villano === "sabretooth") pasos.push({ t: "Cazado", d: `${HEROES[c.primero].nombre} empieza la partida y recibe la ficha de Cazado.` });
    if (c.villano === "carnage") pasos.push({ t: "Medidor de engendros", d: `Coloca el indicador en la casilla ${E.flags.sonico === "usar" ? 0 : clamp(E.carnage, 0, 3)}.` });
    if (["rhino", "venom", "carnage"].includes(c.villano)) pasos.push({ t: "Fichas de Crisis", d: "Tenlas a mano (vienen en la caja X-Men)." });
    if (c.identidad) {
      const exp = equipo.filter(h => (E.exposicion[h] || 0) > 0 && !E.publicos.includes(h));
      pasos.push({ t: "Identidad Secreta", d: `Coloca 1 Periodista en ${L(0)}, ${L(2)} y ${L(4)}.${exp.length ? " Exposición que arrastran: " + exp.map(h => `${HEROES[h].nombre} ${E.exposicion[h]}`).join(", ") + "." : ""}` });
    }
    const ev = lineas(c.evento.efectos);
    pasos.push({ t: `Carta de Evento: ${c.evento.titulo}`, d: ev, lista: true, carta: "evento" });
    pasos.push({ t: `Carta de Reto: ${c.pistas.titulo}`, d: [
      "Toma 2 fichas de Exposición (las del celular, de la caja Spider-Verse).",
      `Pon una boca abajo (mostrando la carcasa negra) sobre la carta de ${LUGARES[c.pistas.lugares[0]].nombre} y la otra sobre la de ${LUGARES[c.pistas.lugares[1]].nombre}, al costado, sin tapar los espacios de Civiles y Matones.`,
      "Durante la partida, un héroe que esté en ese Lugar puede gastar 1 acción Heroica (la estrella amarilla) para recoger ese objetivo y dejarlo junto a su mazo. Esa acción no cuenta para ninguna Misión.",
      "Al terminar, anoten en Partida cuántos recogieron. Si recogen los dos, cumplen el reto y el villano del próximo capítulo empieza Frenado."
    ].concat(c.identidad ? ["Hoy también se usa el Desafío Identidad Secreta: los objetivos del reto van boca abajo y la Exposición de cada héroe, boca arriba junto a su mazo. Así no se confunden."] : []), lista: true, carta: "pistas" });
    const nv = nivelDe(c);
    pasos.push({ t: `Desafío: ${NIVELES[nv].nombre}`, d: NIVELES[nv].regla });

    const fichas = [];
    equipo.forEach(h => {
      const nh = nivelHeroe(h), m = HEROES[h].mejora;
      if (nh >= 2) fichas.push(`${HEROES[h].nombre} (${m.nombre}): 1 ficha ${m.ficha}${nh >= 3 ? " y 1 Comodín" : ""}.`);
    });
    if (E.ayuda) fichas.push("La alianza se reagrupa tras la derrota: cada héroe, 1 ficha Comodín.");
    if (dificultad().id === "facil") fichas.push("Dificultad Fácil: cada héroe, 1 ficha Comodín.");
    E.pendientes.forEach(p => fichas.push(`${p.de}: ${p.texto}`));
    if (c.final && E.panico <= 1) fichas.push("La ciudad confía en ustedes: cada héroe, 1 ficha Comodín.");
    if (fichas.length) pasos.push({ t: "Fichas iniciales", d: fichas, lista: true });

    const ritmo = [];
    if (E.frenado) ritmo.push("Cumplieron el reto del capítulo anterior: el villano empieza Frenado (ficha verde sobre su mazo).");
    if (dificultad().id === "facil") ritmo.push("Dificultad Fácil: el villano empieza Frenado.");
    if (E.panico >= 2) ritmo.push(`Pánico (${estadoPanico(E.panico).nombre}): coloca 1 Matón extra en ${L(0)}.`);
    if (E.panico >= 4) ritmo.push("Pánico (Caos): el villano empieza Acelerado (ficha naranja al final de la Trama). Si también está Frenado, se anulan.");
    if (c.final && E.panico >= 3) ritmo.push("Pánico alto: el Desafío del final ya subió un nivel.");
    if (ritmo.length) pasos.push({ t: "Estado de la ciudad", d: ritmo, lista: true });

    pasos.push({ t: "¡A jugar!", d: c.primero ? `La partida empieza con el turno del villano. Después juega ${HEROES[c.primero].nombre}.` : "La partida empieza con el turno del villano. Después acuerden qué héroe juega primero." });
    return pasos;
  }

  /* ---------- Componentes ---------- */
  const retrato = (id, cls = "") => `<img class="retrato ${cls}" src="assets/char/${id}.jpg" alt="${esc(HEROES[id] ? HEROES[id].nombre : (VILLANOS[id] || {}).nombre || id)}" loading="lazy">`;
  function iconos(h) {
    const i = h.icons;
    const uno = (k, img, nombre) => `<span class="ic" title="${nombre}: ${i[k]} en el mazo"><img src="assets/icons/${img}.png" alt=""><b>${i[k]}</b><small>${nombre}</small></span>`;
    return `<div class="iconos" aria-label="Acciones en sus 12 cartas">${uno("m", "mover", "Mover")}${uno("a", "atacar", "Atacar")}${uno("h", "heroica", "Heroica")}${uno("c", "comodin", "Comodín")}</div>`;
  }
  const caption = (t, cls = "") => `<p class="caption ${cls}">${t}</p>`;
  const estrellas = n => "★".repeat(n) + "☆".repeat(5 - n);

  function anillo(c) {
    const v = VILLANOS[c.villano];
    const nodos = c.anillo.map((id, i) => {
      const ang = (-90 + i * 60) * Math.PI / 180, x = 50 + 37 * Math.cos(ang), y = 50 + 37 * Math.sin(ang);
      const m = [];
      if (i === 0) m.push(`<span class="marca marca-v">Villano</span>`);
      if (i === 3) m.push(`<span class="marca marca-h">Héroes</span>`);
      if (c.pistas.lugares.includes(id)) m.push(`<span class="marca marca-p">Reto</span>`);
      return `<div class="nodo" style="left:${x}%;top:${y}%"><img src="assets/loc/${id}.jpg" alt="" loading="lazy"><span class="nodo-n">${esc(LUGARES[id].nombre)}</span>${m.join("")}</div>`;
    }).join("");
    const leyenda = c.anillo.map((id, i) => `<li><b>${esc(LUGARES[id].nombre)}</b>${i === 0 ? ' <span class="chip-mini v">Villano</span>' : ""}${i === 3 ? ' <span class="chip-mini h">Héroes</span>' : ""}${c.pistas.lugares.includes(id) ? ' <span class="chip-mini p">Reto</span>' : ""}<span>${esc((c.notas || {})[id] || "")}</span></li>`).join("");
    return `<div class="anillo" role="img" aria-label="Lugares en sentido horario">
      <div class="anillo-centro"><img src="assets/char/${c.villano}.jpg" alt="${esc(v.nombre)}"></div>
      <svg class="anillo-flecha" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="37" fill="none" stroke="currentColor" stroke-width=".6" stroke-dasharray="2 2"/></svg>${nodos}</div>
      <ol class="leyenda">${leyenda}</ol>`;
  }

  function anteriormente() {
    const prev = E.historia[E.historia.length - 1];
    if (!prev) return "";
    let t = `<b>Anteriormente…</b> ${esc(prev.resumen)}`;
    if (prev.decision) t += ` Decidieron: ${esc(prev.decision)}.`;
    return `<div class="anteriormente">${caption(t)}</div>`;
  }

  function portada(c) {
    const v = VILLANOS[c.villano], acto = ACTOS[c.acto];
    return `<section class="portada poster" style="background-image:url('assets/villain/${c.villano}-art.jpg')">
      <img class="poster-img" src="assets/covers/${E.nodo}.jpg" alt="" onerror="this.remove()">
      <div class="portada-num" aria-hidden="true">#${E.historia.filter(h => h.nodo !== "F").length + 1 > 10 ? 10 : E.historia.filter(h => h.nodo !== "F").length + 1}</div>
      <div class="portada-txt"><span class="acto">${acto.nombre} · ${acto.titulo}</span><h2>${esc(c.titulo)}</h2>
      <span class="contra">contra <b>${esc(v.nombre)}</b> · ${estrellas(v.dificultad)}</span></div></section>`;
  }

  /* ---------- Vista: Historia ---------- */
  function vistaHistoria() {
    if (E.fase === "fin") return vistaFin();
    if (E.fase === "resultado") return vistaResultado();
    if (E.fase === "decision") return vistaDecision();
    if (E.fase === "juego") return `<section class="vacio"><p class="sfx sfx-chico">¡En juego!</p><p>La partida contra ${esc(VILLANOS[cap().villano].nombre)} está en curso. Cuando termine, anota el resultado en <b>Partida</b>.</p><button class="btn" data-ir="partida">Ir a Partida</button></section>`;
    const c = cap(), mapa = asignacion(), hs = heroesDe(c), equipo = equipoJugando();
    const tarjeta = h => {
      const H = HEROES[h], nh = nivelHeroe(h);
      return `<article class="heroe-sel ${mapa[h] === -1 ? "fuera" : ""}">${retrato(h)}
        <div class="heroe-sel-txt"><span class="etq">${esc(H.rol)}${nh > 1 ? ` · Nivel ${nh}` : ""}</span><h4>${esc(H.nombre)}</h4>${iconos(H)}
        ${E.heridos.includes(h) ? `<span class="chip chip-mal">Herido</span>` : ""}
        <div class="asignar" role="radiogroup" aria-label="Quién juega con ${esc(H.nombre)}">
          ${E.jugadores.map((j, i) => `<button class="chip ${mapa[h] === i ? "on" : ""}" data-asignar="${h}" data-j="${i}" aria-pressed="${mapa[h] === i}">${esc(j)}</button>`).join("")}
          <button class="chip ${mapa[h] === -1 ? "on" : ""}" data-asignar="${h}" data-j="-1" aria-pressed="${mapa[h] === -1}">No juega</button>
        </div></div></article>`;
    };
    const pasos = pasosPreparacion(c, equipo);
    return `${portada(c)}${anteriormente()}
    <section class="bloque"><h3 class="titulo-sec">La historia</h3>
      <div class="captions">${lineas(c.prologo).map(t => caption(esc(t))).join("")}</div>
      <p class="inspiracion"><b>Inspiración:</b> ${esc(c.inspiracion)}</p></section>
    <section class="bloque"><h3 class="titulo-sec">El equipo</h3>
      <p class="nota">Los tres héroes de este capítulo los elige la historia. Ustedes deciden quién juega con cada uno. Si hoy juegan solo dos, marquen «No juega» en uno.</p>
      <div class="equipo">${hs.map(tarjeta).join("")}</div></section>
    <section class="bloque"><h3 class="titulo-sec">Cartas del capítulo</h3>
      <div class="cartas">
        <article class="carta carta-evento"><span class="carta-tipo">Carta de Evento</span><h4>${esc(c.evento.titulo)}</h4><p>${esc(c.evento.texto)}</p><ul>${lineas(c.evento.efectos).map(x => `<li>${esc(x)}</li>`).join("")}</ul></article>
        <article class="carta carta-pistas"><span class="carta-tipo">Carta de Reto</span><h4>${esc(c.pistas.titulo)}</h4><p>${esc(c.pistas.texto)}</p>
          <ol class="carta-pasos">
            <li><b>Preparar:</b> pon 1 ficha de Exposición (el celular) boca abajo sobre ${esc(LUGARES[c.pistas.lugares[0]].nombre)} y otra sobre ${esc(LUGARES[c.pistas.lugares[1]].nombre)}.</li>
            <li><b>Jugar:</b> un héroe en ese Lugar gasta 1 acción Heroica <img class="ic-linea" src="assets/icons/heroica.png" alt="Heroica"> y recoge ese objetivo. No cuenta para las Misiones.</li>
            <li><b>Premio:</b> si recogen los dos, el villano del próximo capítulo empieza Frenado.</li>
          </ol></article>
      </div></section>
    <section class="bloque"><h3 class="titulo-sec">Preparación de la mesa</h3>${anillo(c)}
      <ol class="pasos">${pasos.map(s => `<li class="${s.carta ? "paso-" + s.carta : ""}"><b>${esc(s.t)}</b>${s.lista ? `<ul>${s.d.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : `<span>${esc(s.d)}</span>`}</li>`).join("")}</ol></section>
    <div class="cta"><button class="btn" id="btnEmpezar">Mesa lista: empezar la partida</button></div>`;
  }

  /* ---------- Vista: Partida ---------- */
  function vistaPartida() {
    const P = E.partida;
    if (!P) return `<section class="vacio"><p class="sfx sfx-chico">¿Listos?</p>
      <p>Prepara el capítulo en <b>Historia</b> y toca «Mesa lista». Aquí vas a anotar el resultado cuando termine la partida.</p>
      <button class="btn" data-ir="historia">Ir a Historia</button></section>`;
    const c = cap(P.nodo), v = VILLANOS[c.villano];
    const recordatorio = [
      `${v.nombre} tiene ${v.vida[P.equipo.length]} de vida. No se le puede dañar hasta completar 2 Misiones.`,
      "Con la 1ª Misión el villano queda Bajo Presión: juega Plan Maestro cada 2 cartas de héroe en vez de 3.",
      "Con la 3ª Misión, cada héroe roba 1 carta.",
      `Carta de Reto «${c.pistas.titulo}»: objetivos en ${LUGARES[c.pistas.lugares[0]].nombre} y ${LUGARES[c.pistas.lugares[1]].nombre}; 1 acción Heroica para recoger cada uno.`
    ];
    return `
    <section class="mesa-villano"><img src="assets/char/${c.villano}.jpg" alt="">
      <div class="mv-txt"><span class="etq">${esc(c.titulo)}</span><h2>${esc(v.nombre)}</h2><span class="estado-v">${v.complot === "No tiene." ? "Sin complot maligno: pierden si se acaba su Plan Maestro o un héroe se queda sin cartas." : "Complot: " + esc(v.complot)}</span></div></section>
    <section class="bloque"><h3 class="titulo-sec">Recordatorio</h3><ul class="avisos">${recordatorio.map(x => `<li>${esc(x)}</li>`).join("")}</ul></section>
    <section class="bloque"><h3 class="titulo-sec">Al terminar</h3>
      <p class="nota">Completen esto cuando la partida termine.</p>
      <div class="mesa-heroes">${P.equipo.map(h => `<article class="mh">${retrato(h)}<div class="mh-txt"><h4>${esc(HEROES[h].nombre)}</h4>
        ${c.identidad && !E.publicos.includes(h) ? `<div class="cont"><span>Exposición al final</span><button class="mini" data-exp="${h}" data-d="-1" aria-label="Restar">−</button><b class="${(P.exp[h] || 0) >= 3 ? "alerta" : ""}">${P.exp[h] || 0}</b><button class="mini" data-exp="${h}" data-d="1" aria-label="Sumar">+</button></div>` : ""}
        <label class="ko"><input type="checkbox" id="ko-${h}" data-ko="${h}" ${P.ko[h] ? "checked" : ""}> Quedó fuera de combate</label></div></article>`).join("")}</div>
      <h4 class="sub">Carta de Reto: objetivos recogidos</h4>
      <div class="selector">
        <button class="chip ${P.pistas === 2 ? "on" : ""}" data-pistas="2">Los dos</button>
        <button class="chip ${P.pistas === 1 ? "on" : ""}" data-pistas="1">Solo uno</button>
        <button class="chip ${P.pistas === 0 ? "on" : ""}" data-pistas="0">Ninguno</button>
      </div></section>
    <section class="bloque resolver"><h3 class="titulo-sec">¿Cómo terminó?</h3>
      ${P.confirmar ? `<div class="confirma"><p>${P.confirmar === "gano" ? `¿Confirman que derrotaron a ${esc(v.nombre)}?` : "¿Confirman que el villano completó su plan?"}</p>
        <div class="fila"><button class="btn" id="btnConfirmar">Sí, ${P.confirmar === "gano" ? "ganamos" : "perdimos"}</button><button class="btn-sec" id="btnCancelar">Volver</button></div></div>`
      : `<div class="fila"><button class="btn verde" data-fin="gano">Ganamos</button><button class="btn rojo" data-fin="perdio">Perdimos</button></div>`}
      <button class="btn-sec" id="btnAbandonar">Volver a preparar la mesa</button></section>`;
  }

  /* ---------- Resultado, decisión y final ---------- */
  function vistaResultado() {
    const R = E.resultado, c = cap(R.nodo), out = R.gano ? c.victoria : c.derrota;
    return `<section class="resultado ${R.gano ? "gano" : "perdio"}"><p class="sfx">${R.gano ? "¡Victoria!" : c.final ? "¡Otra vez!" : "Derrota"}</p><h2>${esc(out.titulo)}</h2></section>
    <section class="bloque"><div class="captions">${out.texto.map(t => caption(esc(t))).join("")}</div></section>
    ${R.avisos.length ? `<section class="bloque"><h3 class="titulo-sec">Lo que cambia</h3><ul class="avisos">${R.avisos.map(a => `<li>${esc(a)}</li>`).join("")}</ul></section>` : ""}
    <div class="cta"><button class="btn" id="btnSeguir">${R.gano && c.final ? "Ver el final" : c.final ? "Volver a intentarlo" : "Continuar la historia"}</button></div>`;
  }

  function vistaDecision() {
    const d = DECISIONES[E.decision.id], ult = E.historia[E.historia.length - 1];
    const nota = ult && d.notas ? d.notas[`${ult.nodo}:${ult.gano ? "gano" : "perdio"}`] : null;
    return `<section class="resultado decision-top"><p class="sfx sfx-chico">Decisión</p><h2>${esc(d.titulo)}</h2></section>
    <section class="bloque">${nota ? caption(esc(nota)) : ""}${caption(esc(d.texto))}
      <div class="opciones">${d.opciones.map(o => `<button class="opcion ${E.decision.elegida === o.id ? "on" : ""}" data-decision="${o.id}" aria-pressed="${E.decision.elegida === o.id}"><b>${esc(o.nombre)}</b><span>${esc(o.texto)}</span></button>`).join("")}</div>
      <p class="nota">La decisión es definitiva: piénsenla juntos.</p></section>
    <div class="cta"><button class="btn" id="btnDecidir" ${E.decision.elegida ? "" : "disabled"}>Confirmar la decisión</button></div>`;
  }

  function vistaFin() {
    const ep = epilogoFinal(E), c = cap("F");
    const victorias = E.historia.filter(h => h.gano).length, derrotas = E.historia.filter(h => !h.gano).length;
    const extra = E.flags.pistasFinal ? ["Ningún alumno se quedó atrás: los rescataron a todos."] : [];
    return `<section class="resultado gano"><p class="sfx">Fin</p><h2>${esc(ep.titulo)}</h2></section>
    <section class="bloque"><div class="captions">${c.victoria.texto.concat(extra, ep.lineas).map(t => caption(esc(t))).join("")}</div></section>
    <section class="bloque"><h3 class="titulo-sec">La campaña en números</h3>
      <div class="numeros"><div><b>${victorias}</b><span>victorias</span></div><div><b>${derrotas}</b><span>derrotas</span></div><div><b>${E.panico}</b><span>pánico final</span></div></div></section>
    <div class="cta"><button class="btn-sec" data-ir="mapa">Ver el mapa de la campaña</button></div>`;
  }

  /* ---------- Vista: Mapa ---------- */
  function vistaMapa() {
    const filas = [1, 2, 3, 4].map(a => {
      const jugados = E.historia.map((h, i) => ({ h, i })).filter(x => CAPITULOS[x.h.nodo].acto === a);
      const actual = (E.fase === "prep" || E.fase === "juego") && cap().acto === a;
      const alcanzado = jugados.length || actual;
      const tarjetas = jugados.map(({ h }) => {
        const c = CAPITULOS[h.nodo];
        return `<li class="hito ${h.gano ? "gano" : "perdio"}"><div class="hito-arte"><img src="assets/covers/${h.nodo}.jpg" onerror="this.onerror=null;this.src='assets/char/${c.villano}.jpg'" alt="${esc(VILLANOS[c.villano].nombre)}"><span class="sello">${h.gano ? "Victoria" : "Derrota"}</span></div>
          <div class="hito-txt"><b>${esc(c.titulo)}</b><span>contra ${esc(VILLANOS[c.villano].nombre)}</span>
          <div class="mini-equipo">${h.equipo.map(x => `<img src="assets/char/${x}.jpg" alt="${esc(HEROES[x].nombre)}" title="${esc(HEROES[x].nombre)}">`).join("")}</div>
          ${h.decision ? `<span class="decidido">Decidieron: ${esc(h.decision)}</span>` : ""}</div></li>`;
      }).join("");
      const enCurso = actual ? `<li class="hito actual"><div class="hito-arte"><img src="assets/char/${cap().villano}.jpg" alt=""><span class="sello">${E.fase === "juego" ? "Jugando" : "Ahora"}</span></div>
        <div class="hito-txt"><b>${esc(cap().titulo)}</b><span>contra ${esc(VILLANOS[cap().villano].nombre)}</span></div></li>` : "";
      const futuro = (!alcanzado || (actual && cap().paso < (a === 4 ? 1 : 3))) && E.fase !== "fin" ? `<li class="hito misterio"><div class="hito-arte"><span>?</span></div><div class="hito-txt"><b>Por descubrir</b><span>Se revela al jugar</span></div></li>` : "";
      return `<section class="acto-mapa ${alcanzado ? "" : "bloqueado"}"><h3 class="titulo-sec">${ACTOS[a].nombre} · ${alcanzado ? ACTOS[a].titulo : "???"}</h3><ol class="hitos">${tarjetas}${enCurso}${futuro}</ol></section>`;
    }).join("");
    return `<p class="nota">El camino que recorrieron. Lo que todavía no jugaron queda oculto.</p>${filas}`;
  }

  /* ---------- Vista: Archivo ---------- */
  let pestana = "heroes";
  function vistaArchivo() {
    const tabs = [["heroes", "Héroes"], ["villanos", "Villanos"], ["lugares", "Lugares"], ["reglas", "Reglas"]];
    const conocidos = new Set(E.historia.flatMap(h => h.equipo).concat(E.fase !== "fin" && cap() ? heroesDe(cap()) : []));
    let cuerpo = "";
    if (pestana === "heroes") cuerpo = `<div class="grilla-h">${Object.keys(HEROES).map(id => {
      const h = HEROES[id], ok = conocidos.has(id), nh = nivelHeroe(id);
      return `<article class="ficha ${ok ? "" : "bloqueada"}">${retrato(id)}<div class="ficha-txt">
        <span class="etq">${h.caja}${h.antiheroe ? " · Antihéroe" : ""} · ${ok ? `Nivel ${nh} (${E.xp[id] || 0} partidas)` : "Aún no aparece"}</span>
        <h4>${esc(h.nombre)} <small>${esc(h.alias)}</small></h4><p class="rol">${esc(h.rol)}</p>${iconos(h)}
        <ul class="esp">${h.especiales.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
        <p><b>Fuerte:</b> ${esc(h.fuerte)}</p><p><b>Débil:</b> ${esc(h.debil)}</p><p><b>Brilla contra:</b> ${esc(h.contra)}</p>
        <p class="mejora"><b>Mejora «${esc(h.mejora.nombre)}»:</b> desde su segunda partida empieza con 1 ficha ${esc(h.mejora.ficha)}; desde la cuarta, también con 1 Comodín.</p></div></article>`;
    }).join("")}</div>`;
    if (pestana === "villanos") cuerpo = `<div class="grilla-v">${Object.keys(VILLANOS).map(id => {
      const v = VILLANOS[id];
      return `<article class="villano-f"><img class="tablero" src="assets/villain/${id}-board.jpg" alt="Tablero de ${esc(v.nombre)}" loading="lazy">
        <div class="ficha-txt"><span class="etq">Dificultad ${estrellas(v.dificultad)} · Vida con 2/3/4 héroes: ${v.vida[2]}/${v.vida[3]}/${v.vida[4]}</span>
        <h4>${esc(v.nombre)} <small>${esc(v.alias)}</small></h4>
        <p><b>Reglas especiales:</b> ${esc(v.especial)}</p><p><b>BAM:</b> ${esc(v.bam)}</p><p><b>Exceso:</b> ${esc(v.exceso)}</p><p><b>Complot:</b> ${esc(v.complot)}</p>
        ${v.prep.map(x => `<p><b>Preparación:</b> ${esc(x)}</p>`).join("")}${caption(esc(v.consejo), "caption-tip")}</div></article>`;
    }).join("")}</div>`;
    if (pestana === "lugares") cuerpo = `<p class="nota">Los 14 Lugares que tienes: 6 de Enter the Spider-Verse y 8 de la caja X-Men.</p>
      <div class="grilla-l">${Object.keys(LUGARES).map(id => `<article class="lugar"><img src="assets/loc/${id}.jpg" alt="Carta de ${esc(LUGARES[id].nombre)}" loading="lazy"><div><span class="etq">${LUGARES[id].caja}</span><h4>${esc(LUGARES[id].nombre)}</h4><p>${esc(LUGARES[id].efecto)}</p></div></article>`).join("")}</div>`;
    if (pestana === "reglas") cuerpo = `<div class="reglas">
      <h4>Cómo se juega la campaña</h4><p>Usen el celular dos veces por capítulo: al preparar la mesa y al terminar. Todo lo que pasa en la partida ya está en la preparación: la Carta de Evento cambia el armado y la Carta de Reto pone celulares boca abajo sobre la mesa como objetivos.</p>
      <h4>Qué ficha es cada cosa</h4>
      <ul class="leyenda-fichas">
        <li><img src="assets/icons/mover.png" alt=""><span><b>Mover</b> (flecha verde): vas a un Lugar vecino.</span></li>
        <li><img src="assets/icons/atacar.png" alt=""><span><b>Atacar</b> (puño rojo): 1 daño a un Matón, a un Secuaz o al villano (este último, solo con 2 Misiones completas).</span></li>
        <li><img src="assets/icons/heroica.png" alt=""><span><b>Heroica</b> (estrella amarilla): rescatas 1 Civil de tu Lugar o pones 1 ficha en la Amenaza de tu Lugar. En esta campaña, también recoge los objetivos de la Carta de Reto.</span></li>
        <li><img src="assets/icons/comodin.png" alt=""><span><b>Comodín</b> (cuadros de colores): vale como cualquiera de las tres anteriores.</span></li>
        <li><img src="assets/icons/civil.png" alt=""><span><b>Civil</b> (cara blanca): persona a rescatar.</span></li>
        <li><img src="assets/icons/maton.png" alt=""><span><b>Matón</b> (cara roja con antifaz): enemigo de 1 golpe.</span></li>
        <li><img src="assets/icons/exposicion.png" alt=""><span><b>Exposición</b> (celular, caja Spider-Verse), boca arriba: cuenta para el Desafío Identidad Secreta.</span></li>
        <li><img src="assets/icons/pista.png" alt=""><span><b>Objetivo del reto</b>: la misma ficha de Exposición, pero boca abajo (carcasa negra). Solo en esta campaña.</span></li>
        <li><img src="assets/icons/periodista.png" alt=""><span><b>Periodista</b> (credencial amarilla): solo con Identidad Secreta.</span></li>
      </ul>
      <p>Las fichas de acción (Mover, Atacar, Heroica, Comodín) que te da la campaña al empezar se guardan junto a tu mazo y se gastan cuando quieras en tu turno.</p>
      <h4>Carta de Reto</h4><p>Cada capítulo trae un reto con premio: pone 2 fichas de Exposición boca abajo en dos Lugares como objetivos. Un héroe en ese Lugar puede gastar 1 acción Heroica para recoger un objetivo. Si recogen los dos, el villano del próximo capítulo empieza Frenado. Ojo: esas acciones Heroicas no van a las Misiones.</p>
      <h4>La historia se ramifica</h4><p>Ganar o perder lleva a capítulos distintos, con otros villanos y otros lugares. Cada acto tiene un capítulo para cada combinación de resultados. El final hay que ganarlo: si pierden, lo vuelven a jugar con ayuda.</p>
      <h4>Decisiones</h4><p>Cuatro veces en la campaña tendrán que elegir. Las decisiones cambian aliados, cómo empieza el Acto III y cómo termina todo.</p>
      <h4>Mejoras de los héroes</h4><p>Cada héroe gana experiencia al jugar. Desde su segunda partida empieza con 1 ficha de acción propia; desde la cuarta, también con 1 Comodín.</p>
      <h4>Herido y ayuda</h4><p>Si pierden, cada héroe que quedó fuera de combate roba solo 2 cartas la próxima vez que juegue. Pero la alianza se reagrupa: en el capítulo siguiente cada héroe empieza con 1 Comodín.</p>
      <h4>Pánico en Nueva York</h4><p>Sube con las derrotas y con algunas decisiones. Con 2-3 se añade 1 Matón al preparar; con 4-5 además el villano empieza Acelerado. Afecta a la dificultad y al epílogo del final.</p>
      <h4>Turno del villano</h4><p>Roba una carta de Plan Maestro y resuélvela de arriba abajo: mueve al villano en sentido horario, activa ¡BAM! (tablero y Amenazas), añade Matones y Civiles alrededor y aplica el efecto especial. Si no caben fichas, se activa su Exceso.</p>
      <h4>Turno del héroe</h4><p>Roba 1 carta, juega 1 carta en la Trama y usa sus iconos más los de la carta de héroe anterior (no su texto especial). Al final, si tu Lugar no tiene Amenaza, puedes usar su efecto de Fin del Turno.</p>
      <h4>Dañar al villano</h4><p>Solo después de completar 2 Misiones. Ningún efecto de esta campaña se salta esa regla.</p>
      <h4>Frenado y Acelerado</h4><p>Frenado: el villano juega su siguiente carta 1 turno más tarde (ficha verde sobre su mazo). Acelerado: 1 turno antes (ficha naranja al final de la Trama). Si tiene las dos, se anulan.</p>
      <h4>Identidad Secreta</h4><p>Un héroe en un Lugar con Periodista que hace cualquier acción distinta de Mover recibe 1 Exposición (máximo 1 por turno). Con una acción Heroica puedes mover un Periodista a un Lugar adyacente. Con 3 Exposiciones: 1 daño y tu próxima carta va boca abajo. En esta campaña la Exposición se arrastra entre capítulos, y una identidad revelada deja al héroe herido para su siguiente partida.</p></div>`;
    return `<nav class="pestanas" role="tablist">${tabs.map(([k, n]) => `<button role="tab" aria-selected="${pestana === k}" class="${pestana === k ? "on" : ""}" data-archivo="${k}">${n}</button>`).join("")}</nav>${cuerpo}`;
  }

  /* ---------- Vista: Campaña ---------- */
  let confirmarReinicio = false;
  function vistaCampana() {
    const ep = estadoPanico(E.panico);
    const dec = [];
    if (E.flags.eddie) dec.push(E.flags.eddie === "confianza" ? "Confiaron en Eddie Brock." : "Mandaron a Eddie Brock a Ravencroft.");
    if (E.flags.evidencia) dec.push(E.flags.evidencia === "publica" ? "Le dieron a Jameson la prueba contra Osborn." : "Guardaron en secreto la prueba contra Osborn.");
    if (E.flags.magneto) dec.push(E.flags.magneto === "aliado" ? "Aceptaron a Magneto como aliado." : "Rechazaron a Magneto.");
    if (E.flags.sonico) dec.push(E.flags.sonico === "usar" ? "Decidieron usar el arma sónica." : "Decidieron no usar el arma sónica.");
    const exp = Object.entries(E.exposicion).filter(([, n]) => n > 0);
    return `
    <section class="bloque"><h3 class="titulo-sec">Dificultad</h3>
      <div class="opciones">${DIFICULTADES.map(d => `<button class="opcion ${E.dificultad === d.id ? "on" : ""}" data-dificultad="${d.id}" aria-pressed="${E.dificultad === d.id}"><b>${d.nombre}</b><span>${esc(d.texto)}</span></button>`).join("")}</div>
      <p class="nota">Pueden cambiarla en cualquier momento; se aplica al preparar el próximo capítulo.</p></section>
    <section class="bloque"><h3 class="titulo-sec">Pánico en Nueva York</h3>
      <div class="panico" role="meter" aria-valuemin="0" aria-valuemax="5" aria-valuenow="${E.panico}">${[0, 1, 2, 3, 4, 5].map(i => `<span class="seg ${i <= E.panico ? "on" : ""} n${i}">${i}</span>`).join("")}</div>
      <p class="nota"><b>${ep.nombre}.</b> ${ep.texto} Medidor inicial de Carnage en el final: ${clamp(E.carnage, 0, 3)}.</p></section>
    <section class="bloque"><h3 class="titulo-sec">Lo que decidieron</h3>${dec.length ? `<ul class="avisos">${dec.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : `<p class="nota">Todavía nada: las decisiones llegan al final de cada acto y antes del final.</p>`}
      ${E.heridos.length ? `<p class="nota"><b>Heridos:</b> ${E.heridos.map(h => esc(HEROES[h].nombre)).join(", ")}.</p>` : ""}
      ${exp.length ? `<p class="nota"><b>Exposición acumulada:</b> ${exp.map(([h, n]) => `${esc(HEROES[h].nombre)} ${n}/3`).join(", ")}.</p>` : ""}
      ${E.publicos.length ? `<p class="nota"><b>Identidad pública:</b> ${E.publicos.map(h => esc(HEROES[h].nombre)).join(", ")}.</p>` : ""}</section>
    <section class="bloque"><h3 class="titulo-sec">Jugadores</h3>
      <div class="fila">${E.jugadores.map((j, i) => `<label class="campo">Jugador ${i + 1}<input id="nombre${i}" value="${esc(j)}" maxlength="20"></label>`).join("")}</div></section>
    <section class="bloque"><h3 class="titulo-sec">Respaldo</h3>
      <p class="nota">La campaña se guarda en este celular. Para pasarla a otro, exporta el archivo y luego impórtalo allá.</p>
      <div class="fila"><button class="btn-sec" id="btnExportar">Exportar campaña</button><label class="btn-sec archivo-in">Importar campaña<input type="file" id="inImportar" accept="application/json"></label></div>
      <p class="nota" id="msgRespaldo" role="status"></p>
      ${confirmarReinicio ? `<div class="confirma"><p>Esto borra toda la campaña y vuelve al primer capítulo.</p><div class="fila"><button class="btn rojo" id="btnReinicioSi">Sí, empezar de cero</button><button class="btn-sec" id="btnReinicioNo">Cancelar</button></div></div>`
        : `<button class="btn-sec peligro" id="btnReiniciar">Empezar la campaña de cero</button>`}</section>`;
  }

  /* ---------- Acciones ---------- */
  function empezar() {
    const c = cap(), equipo = equipoJugando();
    E.partida = { nodo: E.nodo, equipo, exp: {}, ko: {}, pistas: null, confirmar: null, consumidos: { ayuda: E.ayuda, frenado: E.frenado, pendientes: E.pendientes.slice() } };
    if (c.identidad) equipo.forEach(h => { if (!E.publicos.includes(h)) E.partida.exp[h] = E.exposicion[h] || 0; });
    E.heridos = E.heridos.filter(h => !equipo.includes(h));
    E.ayuda = false; E.frenado = false; E.pendientes = [];
    E.fase = "juego"; guardar(); ir("partida");
  }
  function abandonar() {
    const P = E.partida;
    if (P) { E.ayuda = P.consumidos.ayuda; E.frenado = P.consumidos.frenado; E.pendientes = P.consumidos.pendientes; }
    E.partida = null; E.fase = "prep"; guardar(); ir("historia");
  }

  function aplicarEfectos(lista, avisos) {
    (lista || []).forEach(ef => {
      if (ef.panico) { const a = E.panico; E.panico = clamp(E.panico + ef.panico, 0, 5); if (E.panico !== a) avisos.push(`El Pánico en Nueva York ${ef.panico > 0 ? "sube" : "baja"} a ${E.panico}.`); }
      if (ef.flag) E.flags[ef.flag] = ef.valor;
      if (ef.carnage) { E.carnage += ef.carnage; avisos.push(`Carnage se hace más fuerte: su medidor empezará en ${clamp(E.carnage, 0, 3)} en el final.`); }
      if (ef.panicoSi && E.flags[ef.panicoSi.flag] === ef.panicoSi.valor) { E.panico = clamp(E.panico + ef.panicoSi.n, 0, 5); avisos.push(`El Pánico en Nueva York sube a ${E.panico}.`); }
    });
  }

  function terminar(gano) {
    const c = cap(), P = E.partida, out = gano ? c.victoria : c.derrota, avisos = [];
    P.equipo.forEach(h => {
      const antes = nivelHeroe(h); E.xp[h] = (E.xp[h] || 0) + 1; const ahora = nivelHeroe(h);
      if (ahora > antes) avisos.push(ahora === 2 ? `${HEROES[h].nombre} es Veterano: desde ahora empieza con 1 ficha ${HEROES[h].mejora.ficha} («${HEROES[h].mejora.nombre}»).` : `${HEROES[h].nombre} llega al nivel 3: además empieza con 1 Comodín.`);
    });
    if (c.identidad) Object.entries(P.exp).forEach(([h, n]) => {
      if (n >= 3) { if (!E.publicos.includes(h)) E.publicos.push(h); E.exposicion[h] = 0; if (!E.heridos.includes(h)) E.heridos.push(h); avisos.push(`La identidad de ${HEROES[h].nombre} ya es pública. La prensa no lo deja en paz: la próxima vez que juegue estará herido.`); }
      else E.exposicion[h] = n;
    });
    if (!gano) {
      P.equipo.forEach(h => { if (P.ko[h] && !E.heridos.includes(h)) { E.heridos.push(h); avisos.push(`${HEROES[h].nombre} quedó herido: robará 2 cartas la próxima vez que juegue.`); } });
      E.ayuda = true; avisos.push("La alianza se reagrupa: en el próximo capítulo cada héroe empieza con 1 Comodín.");
    }
    if (P.pistas === 2) {
      if (c.final) E.flags.pistasFinal = true;
      else { E.frenado = true; avisos.push(`Cumplieron el reto «${c.pistas.titulo}»: el próximo villano empieza Frenado.`); }
    }
    aplicarEfectos(out.efectos, avisos);
    E.historia.push({ nodo: E.nodo, gano, equipo: P.equipo, resumen: out.resumen, fecha: new Date().toISOString() });
    E.resultado = { nodo: E.nodo, gano, avisos, siguiente: out.siguiente, trasDecision: out.siguienteTrasDecision || null };
    E.partida = null; E.fase = "resultado"; guardar(); ir("historia");
  }

  function irA(destino, trasDecision) {
    E.resultado = null; E.asignacion = null;
    if (DECISIONES[destino]) { E.decision = { id: destino, elegida: null, trasDecision: trasDecision || null }; E.fase = "decision"; }
    else { E.nodo = destino; E.fase = "prep"; }
    guardar(); render(); window.scrollTo(0, 0);
  }
  function seguir() {
    const R = E.resultado, c = cap(R.nodo);
    if (c.final) {
      if (R.gano) { E.resultado = null; E.fase = "fin"; guardar(); render(); window.scrollTo(0, 0); return; }
      return irA("F");
    }
    irA(R.siguiente, R.trasDecision);
  }
  function decidir() {
    const d = DECISIONES[E.decision.id], o = d.opciones.find(x => x.id === E.decision.elegida);
    const avisos = [];
    aplicarEfectos(o.efectos, avisos);
    (o.pendientes || []).forEach(t => E.pendientes.push({ de: "La decisión", texto: t }));
    const ult = E.historia[E.historia.length - 1]; if (ult) ult.decision = o.nombre;
    const destino = o.siguiente || d.siguiente || E.decision.trasDecision;
    E.decision = null; irA(destino);
  }

  /* ---------- Navegación ---------- */
  const VISTAS = ["historia", "partida", "mapa", "archivo", "campana"];
  const pedida = location.hash.slice(1);
  let vista = VISTAS.includes(pedida) ? pedida : E.fase === "juego" ? "partida" : "historia";
  function ir(v) { vista = v; render(); window.scrollTo(0, 0); }
  function render() {
    const vistas = { historia: vistaHistoria, partida: vistaPartida, mapa: vistaMapa, archivo: vistaArchivo, campana: vistaCampana };
    $("#vista").innerHTML = vistas[vista]();
    document.querySelectorAll(".nav button").forEach(b => b.setAttribute("aria-current", b.dataset.ir === vista ? "page" : "false"));
    const jugadas = E.historia.filter(h => h.nodo !== "F").length;
    $("#capActual").textContent = E.fase === "fin" ? "Campaña terminada" : `Capítulo ${Math.min(jugadas + 1, 10)} de 10`;
  }

  document.addEventListener("click", ev => {
    const t = ev.target.closest("button, [data-ir]");
    if (!t) return;
    const d = t.dataset;
    if (d.ir) return ir(d.ir);
    if (d.asignar) {
      const mapa = asignacion(), h = d.asignar, j = Number(d.j);
      if (j === -1) { if (Object.values(mapa).filter(x => x !== -1).length <= 2 && mapa[h] !== -1) return; mapa[h] = -1; }
      else { const otro = Object.keys(mapa).find(k => k !== h && mapa[k] === j); if (otro) mapa[otro] = mapa[h]; mapa[h] = j; }
      guardar(); return render();
    }
    if (t.id === "btnEmpezar") return empezar();
    const P = E.partida;
    if (d.exp && P) { P.exp[d.exp] = clamp((P.exp[d.exp] || 0) + Number(d.d), 0, 3); guardar(); return render(); }
    if (d.pistas && P) { P.pistas = Number(d.pistas); guardar(); return render(); }
    if (d.fin && P) { P.confirmar = d.fin; guardar(); return render(); }
    if (t.id === "btnCancelar" && P) { P.confirmar = null; guardar(); return render(); }
    if (t.id === "btnConfirmar" && P) return terminar(P.confirmar === "gano");
    if (t.id === "btnAbandonar") return abandonar();
    if (t.id === "btnSeguir") return seguir();
    if (d.decision && E.decision) { E.decision.elegida = d.decision; guardar(); return render(); }
    if (t.id === "btnDecidir" && E.decision && E.decision.elegida) return decidir();
    if (d.archivo) { pestana = d.archivo; return render(); }
    if (d.dificultad) { E.dificultad = d.dificultad; guardar(); return render(); }
    if (t.id === "btnReiniciar") { confirmarReinicio = true; return render(); }
    if (t.id === "btnReinicioNo") { confirmarReinicio = false; return render(); }
    if (t.id === "btnReinicioSi") { confirmarReinicio = false; const j = E.jugadores; E = estadoInicial(); E.jugadores = j; guardar(); return ir("historia"); }
    if (t.id === "btnExportar") {
      const blob = new Blob([JSON.stringify(E, null, 2)], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `telarana-mutante-${E.nodo}.json`; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      $("#msgRespaldo").textContent = "Archivo descargado.";
    }
  });

  document.addEventListener("change", ev => {
    const t = ev.target;
    if (t.dataset.ko && E.partida) { E.partida.ko[t.dataset.ko] = t.checked; guardar(); }
    const m = t.id && t.id.match(/^nombre(\d)$/);
    if (m) { E.jugadores[Number(m[1])] = t.value.trim() || `Jugador ${Number(m[1]) + 1}`; guardar(); }
    if (t.id === "inImportar" && t.files[0]) {
      const r = new FileReader();
      r.onload = () => {
        try {
          const s = JSON.parse(r.result);
          if (!s || s.v !== 2 || !CAPITULOS[s.nodo] || !Array.isArray(s.historia)) throw new Error();
          E = Object.assign(estadoInicial(), s); guardar(); ir("campana");
          $("#msgRespaldo").textContent = "Campaña importada.";
        } catch (e) { $("#msgRespaldo").textContent = "Ese archivo no es una campaña de Telaraña Mutante. Elige el .json que exportaste."; }
      };
      r.readAsText(t.files[0]);
    }
  });

  render();
  if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
})();
