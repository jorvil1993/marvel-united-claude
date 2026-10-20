/* Telaraña Mutante — datos de campaña (versión Claude, v2)
   Solo usa material que Jorge tiene: caja física X-Men + caja impresa Enter the Spider-Verse.
   Todo efecto respeta el reglamento oficial: nada daña al villano antes de completar 2 Misiones.
   La historia es un árbol: cada combinación de victorias y derrotas dentro de un acto lleva a un capítulo distinto. */

const LUGARES = {
  "queens":           { nombre: "Queens", caja: "Spider-Verse", espacios: 5, civiles: 2, matones: 0, efecto: "Si tienes 1 o 2 cartas en tu mano, puedes robar una carta." },
  "oscorp-tower":     { nombre: "Oscorp Tower", caja: "Spider-Verse", espacios: 4, civiles: 1, matones: 1, efecto: "Puedes obtener una ficha de Movimiento." },
  "brooklyn-bridge":  { nombre: "Brooklyn Bridge", caja: "Spider-Verse", espacios: 4, civiles: 1, matones: 1, efecto: "Puedes añadir un Civil a cualquier Lugar. Entonces, rescata a un Civil de este Lugar." },
  "midtown-high":     { nombre: "Midtown High School", caja: "Spider-Verse", espacios: 4, civiles: 1, matones: 1, efecto: "Puedes obtener una ficha Heroica." },
  "daily-bugle":      { nombre: "Daily Bugle", caja: "Spider-Verse", espacios: 4, civiles: 2, matones: 0, efecto: "Descubre la carta superior del mazo de Plan Maestro. Puedes colocarla en la parte inferior del mazo." },
  "osborn-labs":      { nombre: "Osborn Laboratories", caja: "Spider-Verse", espacios: 3, civiles: 0, matones: 1, efecto: "Puedes obtener una ficha de Ataque." },
  "hangar-bay":       { nombre: "Hangar Bay", caja: "X-Men", espacios: 4, civiles: 1, matones: 1, efecto: "Puedes coger una ficha de Movimiento, Heroica o de Ataque." },
  "weapon-x":         { nombre: "Weapon X Facility", caja: "X-Men", espacios: 4, civiles: 0, matones: 2, efecto: "Puedes descartar una carta de tu mano al final de tu mazo para obtener 2 fichas de Ataque." },
  "xavier-institute": { nombre: "Xavier Institute", caja: "X-Men", espacios: 5, civiles: 2, matones: 1, efecto: "Puedes robar cartas hasta que tengas 3 en tu mano." },
  "muir-island":      { nombre: "Muir Island", caja: "X-Men", espacios: 3, civiles: 1, matones: 0, efecto: "Otro Héroe en este Lugar o en uno adyacente puede robar 1 carta." },
  "x-jet":            { nombre: "X-Jet", caja: "X-Men", espacios: 3, civiles: 1, matones: 0, efecto: "Puedes moverte a cualquier otro Lugar." },
  "genosha":          { nombre: "Genosha", caja: "X-Men", espacios: 5, civiles: 2, matones: 1, efecto: "Puedes rescatar a un Civil de este Lugar." },
  "asteroid-m":       { nombre: "Asteroid M", caja: "X-Men", espacios: 4, civiles: 1, matones: 1, efecto: "Puedes infligir un punto de daño a un Matón o a un Secuaz en cualquier Lugar." },
  "sentinel-station": { nombre: "Sentinel Space Station", caja: "X-Men", espacios: 3, civiles: 0, matones: 1, efecto: "Puedes descartar una carta de tu mano al final de tu mazo para intercambiar una carta de tu mano con una de tus cartas boca arriba en la Trama." }
};

/* Iconos contados en las 12 cartas reales de cada mazo: m mover, a atacar, h heroica, c comodín.
   mejora: la ficha con la que empieza cada partida desde su segunda aparición (Veterano). */
const HEROES = {
  "spider-man":      { nombre: "Spider-Man", alias: "Peter Parker", caja: "Spider-Verse", icons: { m: 7, a: 4, h: 4, c: 3 },
    rol: "Motor de misiones", mejora: { nombre: "Lanzarredes recargados", ficha: "Movimiento" },
    especiales: ["Balanceo: recibe 2 fichas de Movimiento.", "Gran poder: 3 ataques contra Matones; por cada uno derrotado, 1 ficha Heroica.", "Gran responsabilidad: rescata hasta 3 Civiles; por cada uno, 1 ficha de Ataque."],
    fuerte: "Vacía lugares de Civiles y Matones de un solo golpe y convierte eso en fichas para después.",
    debil: "Poco daño directo al villano.", contra: "Carnage, Magneto, Green Goblin" },
  "miles-morales":   { nombre: "Miles Morales", alias: "Spider-Man de Brooklyn", caja: "Spider-Verse", icons: { m: 2, a: 6, h: 5, c: 4 },
    rol: "Defensa y golpe preciso", mejora: { nombre: "Camuflaje total", ficha: "Movimiento" },
    especiales: ["Invisibilidad: no puede sufrir daño hasta su siguiente turno.", "Ataque venenoso: 2 ataques contra un solo objetivo.", "Telaraña: si está con el villano, retrasa su siguiente turno una carta."],
    fuerte: "Aguanta castigo y frena al villano cuando se le pone al lado.",
    debil: "Solo 2 movimientos en todo el mazo: necesita que lo lleven.", contra: "Venom, Rhino, Sabretooth" },
  "ghost-spider":    { nombre: "Ghost-Spider", alias: "Gwen Stacy", caja: "Spider-Verse", icons: { m: 5, a: 3, h: 6, c: 3 },
    rol: "Control de amenazas", mejora: { nombre: "Ritmo de batería", ficha: "Ataque" },
    especiales: ["Bailarina: no puede sufrir daño hasta su siguiente turno.", "Tejedora de telarañas: intercambia dos cartas de Amenaza en juego.", "Lucha acrobática: derrota a todos los Matones de su Lugar."],
    fuerte: "Mueve Amenazas peligrosas a donde no molestan y limpia Matones en masa.",
    debil: "Casi no daña al villano.", contra: "Green Goblin, Magneto, Mystique" },
  "spider-ham":      { nombre: "Spider-Ham", alias: "Peter Porker", caja: "Spider-Verse", icons: { m: 4, a: 7, h: 2, c: 3 },
    rol: "Golpeador que frena", mejora: { nombre: "Martillo de dibujo animado", ficha: "Heroica" },
    especiales: ["Dibu-esencia: no pueden forzarlo a descartar su última carta.", "Dibu-telaraña: si acaba con el villano, anula su siguiente movimiento.", "Dibu-arma: un ataque en cualquier Lugar."],
    fuerte: "Le anula el movimiento al villano: desactiva a quienes castigan moviéndose.",
    debil: "Solo 2 acciones Heroicas: malo para Civiles y Amenazas.", contra: "Juggernaut, Rhino" },
  "spider-man-2099": { nombre: "Spider-Man 2099", alias: "Miguel O'Hara", caja: "Spider-Verse", icons: { m: 6, a: 5, h: 4, c: 3 },
    rol: "Todoterreno", mejora: { nombre: "Lyla en línea", ficha: "Heroica" },
    especiales: ["Garras: 2 ataques a un enemigo; el daño no se puede reducir.", "Sentidos aumentados: no puede sufrir daño hasta su siguiente turno.", "Asistencia de Lyla: una acción Heroica en cualquier Lugar."],
    fuerte: "Equilibrado y con acción Heroica a distancia.",
    debil: "No destaca en nada.", contra: "Green Goblin, Venom" },
  "spider-woman":    { nombre: "Spider-Woman", alias: "Jessica Drew", caja: "Spider-Verse", icons: { m: 6, a: 7, h: 3, c: 3 },
    rol: "Ritmo y daño", mejora: { nombre: "Entrenamiento de S.H.I.E.L.D.", ficha: "Heroica" },
    especiales: ["Súper resistencia: no puede sufrir daño hasta su siguiente turno.", "Picotazo venenoso (x2): 2 ataques, o retrasa el siguiente turno del villano una carta."],
    fuerte: "Puede frenar al villano dos veces por partida y pega fuerte.",
    debil: "Pocas acciones Heroicas.", contra: "Juggernaut, Venom, Rhino" },
  "black-cat":       { nombre: "Black Cat", alias: "Felicia Hardy", caja: "Spider-Verse", icons: { m: 4, a: 5, h: 3, c: 3 },
    rol: "Manipula el Plan Maestro", mejora: { nombre: "Ganzúas de la casa Hardy", ficha: "Heroica" },
    especiales: ["Instintos felinos (x2): recibe 2 fichas a tu elección.", "Garras felinas y Suerte felina (x4): cuando se juegue la siguiente carta de Plan Maestro, puedes mandarla al fondo y robar otra."],
    fuerte: "Cuatro veces por partida esquiva la peor carta del villano.",
    debil: "Pocos iconos en sus cartas.", contra: "Rhino, Mystique, Carnage" },
  "venom-hero":      { nombre: "Venom", alias: "Eddie Brock", caja: "Spider-Verse", antiheroe: true, icons: { m: 5, a: 8, h: 2, c: 3 },
    rol: "Bestia protectora", mejora: { nombre: "Protector letal", ficha: "Heroica" },
    especiales: ["Mejora simbionte: fichas de Movimiento y Ataque.", "Regeneración: roba hasta tener 3 cartas.", "Seguimiento: muévete a cualquier Lugar y ataca allí."],
    fuerte: "Mucho daño y se recupera solo.",
    debil: "Solo 2 acciones Heroicas.", contra: "Carnage, Rhino" },
  "wolverine":       { nombre: "Wolverine", alias: "Logan", caja: "X-Men", icons: { m: 4, a: 5, h: 4, c: 4 },
    rol: "El que más daño hace", mejora: { nombre: "Olfato de cazador", ficha: "Movimiento" },
    especiales: ["Garras de adamantium (x3): 2 ataques cada una.", "Factor de curación: mientras está en la Trama, si tienes menos de 3 cartas al final del turno del villano, robas 1."],
    fuerte: "Hasta 11 ataques por mazo y aguanta mucho.",
    debil: "Poco control del tablero.", contra: "Sabretooth, Juggernaut, Rhino" },
  "cyclops":         { nombre: "Cyclops", alias: "Scott Summers", caja: "X-Men", icons: { m: 3, a: 7, h: 6, c: 3 },
    rol: "Líder", mejora: { nombre: "Plan de batalla", ficha: "Movimiento" },
    especiales: ["Rayos ópticos: ataca en los dos Lugares adyacentes.", "Liderazgo: entrega una ficha Comodín a otro Héroe."],
    fuerte: "Limpia lugares vecinos y le da recursos a su pareja.",
    debil: "Se mueve poco.", contra: "Mystique, Magneto" },
  "storm":           { nombre: "Storm", alias: "Ororo Munroe", caja: "X-Men", icons: { m: 7, a: 4, h: 3, c: 3 },
    rol: "Movilidad total", mejora: { nombre: "Ojo del huracán", ficha: "Heroica" },
    especiales: ["Atmoquinesis (x2): 2 ataques en cualquier Lugar.", "Diosa del clima (x2): recoloca a todos los Héroes que quieras."],
    fuerte: "Pone a todo el equipo donde hace falta y pega a distancia.",
    debil: "Pocas acciones Heroicas.", contra: "Juggernaut, Carnage" },
  "jean-grey":       { nombre: "Jean Grey", alias: "Marvel Girl", caja: "X-Men", icons: { m: 5, a: 3, h: 5, c: 5 },
    rol: "El mejor apoyo", mejora: { nombre: "Chispa del Fénix", ficha: "Ataque" },
    especiales: ["Gran telequinesis (x2): reparte una acción Heroica y un ataque entre tu Lugar y los adyacentes.", "Telepatía (x2): intercambia la carta anterior de la Trama por cualquier otra carta de Héroe de la Trama."],
    fuerte: "Telepatía deja reutilizar la mejor carta jugada: multiplica a su pareja.",
    debil: "Poco daño propio.", contra: "Magneto, Sabretooth, Green Goblin" },
  "beast":           { nombre: "Beast", alias: "Hank McCoy", caja: "X-Men", icons: { m: 6, a: 4, h: 7, c: 3 },
    rol: "Motor de acciones Heroicas", mejora: { nombre: "Laboratorio de campo", ficha: "Ataque" },
    especiales: ["Inteligencia genial (x2): ese turno trata las acciones Heroicas como Comodín.", "Factor de regeneración (x2): roba hasta tener 3 cartas."],
    fuerte: "La mayor cantidad de acciones Heroicas del juego y nunca se queda sin cartas.",
    debil: "Daño medio-bajo.", contra: "Magneto, Green Goblin, Carnage" },
  "magneto-hero":    { nombre: "Magneto", alias: "Erik Lehnsherr", caja: "X-Men", antiheroe: true, icons: { m: 3, a: 6, h: 1, c: 4 },
    rol: "Artillería", mejora: { nombre: "Campo magnético", ficha: "Heroica" },
    especiales: ["Magnetoquinesis (x2): 3 ataques repartidos entre tu Lugar y los adyacentes.", "Inteligencia privilegiada y prodigiosa: convierte iconos en Comodín."],
    fuerte: "El mayor daño en área del juego.",
    debil: "1 acción Heroica y 2 cartas sin iconos que dejan a su pareja sin nada que compartir.", contra: "Rhino, Juggernaut" },
  "mystique-hero":   { nombre: "Mystique", alias: "Raven Darkhölme", caja: "X-Men", antiheroe: true, icons: { m: 5, a: 7, h: 2, c: 3 },
    rol: "Saboteadora", mejora: { nombre: "Mil caras", ficha: "Heroica" },
    especiales: ["Metamorfa (x2): en el siguiente turno del villano, desvía el daño que te hagan a un Matón o Secuaz de tu Lugar.", "Maestra del espionaje (x2): la siguiente carta de Plan Maestro no puede añadir fichas a tu Lugar o a uno adyacente."],
    fuerte: "Evita Excesos y esquiva golpes.",
    debil: "Pocas acciones Heroicas.", contra: "Green Goblin, Carnage" }
};

/* Valores leídos de los tableros reales */
const VILLANOS = {
  "rhino": { nombre: "Rhino", alias: "Aleksei Sytsevich", vida: { 2: 5, 3: 8, 4: 11 }, dificultad: 2,
    especial: "Cuando un Héroe queda fuera de combate, Rhino no activa su BAM: ese Héroe coge 1 ficha de Crisis. Un Héroe con Crisis juega su próxima carta boca abajo y luego descarta sus Crisis.",
    bam: "1 daño a cada Héroe en su Lugar por cada Lugar en que entró este turno. Luego mueve a los Héroes dañados 1 Lugar en sentido horario.",
    exceso: "Roba otra carta de Plan Maestro y colócala boca abajo en la Trama.", complot: "No tiene.", prep: [],
    consejo: "No se queden juntos en su camino: cada Lugar que recorre suma daño. Spider-Ham anula su movimiento y Black Cat esquiva sus cargas." },
  "green-goblin": { nombre: "Green Goblin", alias: "Norman Osborn", vida: { 2: 5, 3: 7, 4: 10 }, dificultad: 4,
    especial: "Cuando se elimina una Amenaza, vuelve a su mazo y se añade una ficha de Amenaza a la Misión. No se le puede dañar si hay algún Civil en su Lugar; si estás con él, puedes usar 2 acciones Heroicas para rescatar a uno de esos Civiles.",
    bam: "1 daño a cada Héroe en su Lugar. Roba una Amenaza y colócala en el siguiente Lugar sin Amenaza (sentido horario).",
    exceso: "Roba una Amenaza y colócala en el siguiente Lugar sin Amenaza.",
    complot: "Pierden si todos los Lugares tienen una carta de Amenaza.",
    prep: ["No coloques cartas de Amenaza ni fichas en los Lugares: deja las Amenazas en un mazo boca abajo y las fichas aparte (reverso de su tablero)."],
    consejo: "La carrera es contra las Amenazas: elimínenlas en cuanto aparezcan. Ghost-Spider puede intercambiarlas y 2099 hace acciones Heroicas a distancia." },
  "venom": { nombre: "Venom", alias: "Eddie Brock", vida: { 2: 5, 3: 8, 4: 11 }, dificultad: 3,
    especial: "Cuando un Héroe queda fuera de combate, Venom no activa su BAM: juega otra carta de Plan Maestro.",
    bam: "1 daño a cada Héroe en su Lugar (2 si tienen alguna Crisis). Después, cada Héroe recibe 1 ficha de Crisis.",
    exceso: "1 Héroe recibe 1 ficha de Crisis.",
    complot: "Un Héroe queda fuera de juego al acumular 8 Crisis con 2 Héroes (6 con 3). Pierden si todos quedan fuera de juego.", prep: [],
    consejo: "Las Crisis no se van: cuenten cada una. Los héroes invulnerables (Miles, Ghost-Spider, 2099, Spider-Woman) se comen sus BAM sin daño." },
  "carnage": { nombre: "Carnage", alias: "Cletus Kasady", vida: { 2: 5, 3: 8, 4: 11 }, dificultad: 4,
    especial: "Cuando un Héroe queda fuera de combate, el medidor de engendros sube 1.",
    bam: "1 daño a cada Héroe en su Lugar. Después coloca 1 ficha de Crisis sobre cada Civil de ese Lugar.",
    exceso: "Descarta todos los Civiles con Crisis del Lugar con más Civiles; el medidor sube 1 por cada uno.",
    complot: "Medidor de engendros: si llega a 10, pierden.",
    prep: ["Coloca el indicador del villano en la casilla del medidor de engendros que indique la campaña."],
    consejo: "Rescaten Civiles cerca de Carnage antes de que les ponga Crisis. Spider-Man rescata 3 de golpe; Beast y Jean sostienen el ritmo." },
  "sabretooth": { nombre: "Sabretooth", alias: "Victor Creed", vida: { 2: 5, 3: 7, 4: 10 }, dificultad: 3,
    especial: "Cuando el Héroe Cazado queda fuera de combate (antes del BAM), el siguiente Héroe en sentido horario recibe la ficha de Cazado. Si cae otro Héroe, roba otra carta de Plan Maestro boca abajo.",
    bam: "2 daños a un Héroe en su Lugar; si el Cazado está ahí, lo recibe él.",
    exceso: "1 daño al Héroe Cazado.",
    complot: "Pierden si el Héroe que empezó la partida vuelve a recibir la ficha de Cazado. Con 2 jugadores, a la segunda vez.",
    prep: ["Asigna la ficha de Cazado al Héroe que empieza la partida (reverso de su tablero)."],
    consejo: "Nadie puede caer dos veces. El Cazado debe jugar invulnerable o lejos; su pareja limpia el tablero." },
  "juggernaut": { nombre: "Juggernaut", alias: "Cain Marko", vida: { 2: 8, 3: 8, 4: 8 }, dificultad: 4,
    especial: "Cuando un Héroe queda fuera de combate, no activa su BAM: roba otra carta de Plan Maestro y la pone boca abajo en la Trama.",
    bam: "1 daño a cada Héroe en los Lugares de los que salió, a los que entró o por los que pasó este turno.",
    exceso: "1 daño a cada Héroe en su Lugar y roba otra carta de Plan Maestro boca abajo.", complot: "No tiene.", prep: [],
    consejo: "Con 2 jugadores tiene 8 de vida, más que nadie: guarden ataques para el final. Spider-Ham le anula el movimiento y con eso su BAM." },
  "mystique": { nombre: "Mystique", alias: "Raven Darkhölme", vida: { 2: 4, 3: 6, 4: 9 }, dificultad: 4,
    especial: "Senador Kelly: le afecta todo lo que afecta a los Héroes y lo pueden llevar consigo al moverse. Los Héroes en su Lugar pueden recibir el daño que iba para él. Cuando un Héroe queda fuera de combate, mueve a Kelly 1 Lugar antihorario y roba otra carta de Plan Maestro boca abajo.",
    bam: "2 daños a un Héroe en su Lugar.",
    exceso: "Mueve a Kelly 1 Lugar antihorario y roba otra carta de Plan Maestro boca abajo.",
    complot: "Pierden si el Senador Kelly recibe 1 punto de daño.",
    prep: ["Coloca la ficha del Senador Kelly en el Lugar donde empiezan los Héroes (reverso de su tablero)."],
    consejo: "Todo gira en torno a Kelly: llévenlo lejos de ella y ataquen solo cuando esté a salvo. Tiene poca vida (4 con 2 héroes)." },
  "magneto": { nombre: "Magneto", alias: "Erik Lehnsherr", vida: { 2: 5, 3: 7, 4: 10 }, dificultad: 5,
    especial: "Al inicio de cada turno del villano, añade 1 Civil al Lugar opuesto al de Magneto.",
    bam: "Añade 1 Matón a su Lugar y 1 daño a cada Héroe allí. Cada Héroe en ese Lugar y en los adyacentes descarta 1 ficha de acción.",
    exceso: "Convierte en Matones a todos los Civiles de ese Lugar y de los adyacentes.",
    complot: "Pierden si en algún momento no hay Civiles en ningún Lugar.",
    prep: ["Sustituye la Misión «Rescatar Civiles» por «Usar Cerebro»: un Héroe gasta una acción Heroica y una de Movimiento en el mismo turno para avanzarla; 3 pares la completan (reverso de su tablero)."],
    consejo: "El villano más exigente: hacen falta muchas acciones Heroicas para Cerebro y Amenazas, y no se pueden rescatar todos los Civiles. Beast y Jean son clave." }
};

const NIVELES = [
  { nombre: "Normal", regla: "Sin cartas quitadas." },
  { nombre: "Moderado", regla: "Cada jugador quita de su mazo la carta con 1 Comodín." },
  { nombre: "Difícil", regla: "Cada jugador quita de su mazo la carta con 2 Comodines." },
  { nombre: "Heroico", regla: "Cada jugador quita las cartas con 1 y con 2 Comodines." }
];

const DIFICULTADES = [
  { id: "facil", nombre: "Fácil", texto: "Cada héroe empieza con 1 ficha Comodín y el villano empieza Frenado.", ajuste: 0 },
  { id: "normal", nombre: "Normal", texto: "La campaña tal como está pensada. Recomendada.", ajuste: 0 },
  { id: "desafiante", nombre: "Desafiante", texto: "Cada capítulo sube un nivel de Desafío (Moderado en vez de Normal).", ajuste: 1 },
  { id: "experto", nombre: "Experto", texto: "Cada capítulo sube dos niveles de Desafío.", ajuste: 2 }
];

const ACTOS = {
  1: { nombre: "Acto I", titulo: "La muestra" },
  2: { nombre: "Acto II", titulo: "Mutantes en la mira" },
  3: { nombre: "Acto III", titulo: "Máxima Matanza" },
  4: { nombre: "Final", titulo: "Unidos" }
};

/* ============================================================
   CAPÍTULOS
   anillo: 6 Lugares en sentido horario. Posición 0 = villano; posición 3 = héroes (el opuesto, como dice el reglamento).
   notas: por qué cada Lugar importa en esta escena.
   heroes: 3 héroes fijos por la historia. Un objeto {si, h, no} cambia según una decisión.
   Textos condicionales: {si:{flag:valor}, t:"..."}, {vio:"villano", t:"..."}.
   ============================================================ */
const CAPITULOS = {

/* ======================= ACTO I · LA MUESTRA ======================= */
"I1": {
  acto: 1, paso: 1, titulo: "Golpe en Oscorp", villano: "rhino",
  inspiracion: "Rhino debutó en The Amazing Spider-Man #41 (1966). En Spider-Man: la serie animada (1994), el simbionte llega a la Tierra pegado al transbordador de John Jameson.",
  anillo: ["oscorp-tower", "osborn-labs", "brooklyn-bridge", "queens", "midtown-high", "daily-bugle"],
  notas: {
    "oscorp-tower": "La bóveda donde Oscorp guarda la Muestra 7. Rhino entró por el sótano.",
    "osborn-labs": "El laboratorio privado de Osborn, al lado. Ahí debía llegar el contenedor.",
    "brooklyn-bridge": "La ruta de escape: un camión sin placas espera a Rhino del otro lado.",
    "queens": "La casa de la tía May. Peter, Miles y Felicia salen desde aquí.",
    "midtown-high": "La escuela de Peter, en el camino. Hay gente saliendo de un partido nocturno.",
    "daily-bugle": "Jameson ya mandó fotógrafos: quiere a Spider-Man en primera plana."
  },
  heroes: ["spider-man", "miles-morales", "black-cat"],
  prologo: [
    "Hace tres semanas, el transbordador del astronauta John Jameson volvió a la Tierra con algo pegado al casco: una masa negra que se movía sola. Oscorp ganó el contrato para estudiarla. En sus bóvedas la llaman la Muestra 7.",
    "Esta noche, en Queens, la tía May le sirve a Miles un segundo plato de lasaña cuando alguien golpea la ventana del cuarto de Peter. Es Felicia Hardy, Black Cat, y viene furiosa: le pagaron por robar la Muestra 7 y alguien llegó primero. «Rhino está atravesando las paredes de Oscorp como si fueran de papel», dice. «Yo no trabajo gratis, pero hoy hago una excepción.»",
    "Peter, Miles y Felicia salen por la ventana antes de que la tía May termine de preguntar adónde van. Alguien le pagó a Rhino el triple por sacar un solo contenedor, y Felicia quiere saber quién."
  ],
  evento: { titulo: "Puerta derribada", texto: "Rhino lleva diez minutos adentro cuando ustedes llegan.", efectos: ["Coloca 1 Matón extra en Oscorp Tower (cabe: Oscorp tiene 2 espacios libres al empezar)."] },
  pistas: { titulo: "El comprador", texto: "Felicia quiere saber quién contrató a Rhino. Hay rastros del comprador en el laboratorio de Osborn y en el camión del puente.", lugares: ["osborn-labs", "brooklyn-bridge"] , premio: "Ya saben quién pagó el robo y cómo piensa: en el próximo capítulo, miren las 3 primeras cartas del Plan Maestro y ordénenlas como quieran." },
  victoria: {
    titulo: "Contenedor recuperado",
    texto: [
      "Rhino queda incrustado en el piso del vestíbulo, con una telaraña en cada cuerno. Peter abre el contenedor recuperado y se le hiela la sangre: está medio vacío. La mitad de la Muestra 7 se escurrió por una grieta del piso mientras peleaban, y nadie la vio salir.",
      "Felicia revisa el teléfono de Rhino. El último mensaje dice «Entrega en Osborn Labs». Esa misma noche, en el estacionamiento del Daily Bugle, un fotógrafo despedido llamado Eddie Brock siente algo frío que le trepa por la pierna."
    ],
    resumen: "Rhino cayó, pero media Muestra 7 escapó por las cloacas y encontró a Eddie Brock.",
    siguiente: "I2A"
  },
  derrota: {
    titulo: "Rhino se escapa",
    texto: [
      "Rhino atraviesa la pared este, sube a un camión sin placas y desaparece por el Puente de Brooklyn con el contenedor completo.",
      "Felicia alcanzó a ver la cara del comprador en la cabina: el asistente personal de Norman Osborn. Y el asistente también la vio a ella. Esa misma noche, alguien con garras empieza a preguntar por Black Cat en los bares de Manhattan."
    ],
    resumen: "Rhino escapó con la Muestra 7 y el comprador vio la cara de Black Cat.",
    siguiente: "I2B"
  }
},

"I2A": {
  acto: 1, paso: 2, titulo: "Primera plana", villano: "venom", identidad: true,
  inspiracion: "Venom nació en The Amazing Spider-Man #300 (1988). En Spider-Man 3 (2007), Eddie Brock es el fotógrafo del Bugle al que Peter deja en evidencia.",
  anillo: ["daily-bugle", "midtown-high", "queens", "oscorp-tower", "brooklyn-bridge", "osborn-labs"],
  notas: {
    "daily-bugle": "Venom tomó la redacción con todos adentro.",
    "oscorp-tower": "Los héroes revisaban la bóveda vacía cuando sonó la alarma.",
    "midtown-high": "El auditorio tiene el equipo de sonido más potente de la zona.",
    "queens": "Unos vecinos de la tía May ensayan con su banda de garaje: amplificadores enormes.",
    "brooklyn-bridge": "Los helicópteros de la policía cortaron el tráfico.",
    "osborn-labs": "Osborn mira las noticias desde su ventana. No parece sorprendido."
  },
  heroes: ["spider-man", "spider-woman", "black-cat"],
  prologo: [
    "Eddie Brock era el mejor fotógrafo del Daily Bugle hasta que Peter Parker demostró que sus fotos de Spider-Man eran falsas. Jameson lo despidió frente a toda la redacción. Eddie nunca lo olvidó.",
    "Ahora Eddie ya no está solo. La mitad de la Muestra 7 lo encontró en el estacionamiento y se le metió bajo la piel. Juntos se llaman Venom, y esta mañana tomaron el Daily Bugle con todos adentro. Quieren que Jameson imprima en primera plana quién es Spider-Man.",
    "Jessica Drew, Spider-Woman, agente de S.H.I.E.L.D., rastrea la muestra desde que bajó del espacio. Encuentra a Peter y a Felicia revisando la bóveda vacía de Oscorp. «Esa cosa ya eligió a alguien», les dice. «Y por lo que veo, te conoce, Parker.»"
  ],
  evento: { titulo: "Edición extra", texto: "Jameson manda a todos sus reporteros a cubrir el secuestro de su propio periódico.", efectos: ["Desafío Identidad Secreta: la prensa vigila. Se ponen 3 Periodistas en la mesa y cada héroe que actúe cerca de ellos acumula Exposición; con 3, su identidad se revela (lo explica el paso «Desafío Identidad Secreta» de la preparación).", "Hay rehenes en la redacción: coloca 1 Civil extra en Daily Bugle."] },
  pistas: { titulo: "La debilidad", texto: "Jessica sospecha que el simbionte odia el ruido. Necesitan dos fuentes de sonido potentes: el auditorio de Midtown y los amplificadores de la banda de Queens.", lugares: ["midtown-high", "queens"] , premio: "Tienen el equipo de sonido listo para usarlo de nuevo: en el próximo capítulo, cada héroe empieza con 1 ficha de Ataque." },
  victoria: {
    titulo: "Eddie despierta",
    texto: [
      "Los altavoces chillan a todo volumen y el simbionte se encoge como si lo quemaran. Debajo aparece Eddie Brock, agotado, con los ojos rojos. «No quería lastimar a nadie», dice. «Solo quería que alguien me escuchara.»",
      "El simbionte no se va: se queda pegado a Eddie, temblando. Pero ahora Eddie habla. Dice que el simbionte «recuerda» a su otra mitad: está en el sótano de Osborn Laboratories, conectada a una máquina enorme que zumba día y noche."
    ],
    resumen: "Vencieron a Venom; Eddie recuperó el control y les habló de una máquina en Osborn Laboratories.",
    siguiente: "I3AA"
  },
  derrota: {
    titulo: "Venom escapa",
    texto: [
      "Venom salta desde el techo del Bugle con la mitad de las cámaras del edificio encima. Su cara de dientes sale en todas las pantallas de Times Square.",
      "Lo pierden en las cloacas. Pero no son los únicos buscándolo: Jessica intercepta una radio de Oscorp. Osborn contrató a un cazador para atrapar a Venom vivo. Necesita al simbionte para algo."
    ],
    resumen: "Venom escapó a las cloacas y Osborn contrató a un cazador para atraparlo vivo.",
    siguiente: "I3AB"
  }
},

"I2B": {
  acto: 1, paso: 2, titulo: "Cazada", villano: "sabretooth", primero: "black-cat",
  inspiracion: "Victor Creed debutó como asesino a sueldo en Iron Fist #14 (1977), en las calles de Nueva York, mucho antes de enfrentarse a los X-Men.",
  anillo: ["oscorp-tower", "daily-bugle", "midtown-high", "queens", "brooklyn-bridge", "osborn-labs"],
  notas: {
    "oscorp-tower": "Creed sale de la oficina de su cliente.",
    "queens": "Felicia se esconde en el cuarto de huéspedes de la tía May.",
    "brooklyn-bridge": "El camión de Rhino pasó por aquí: el rastro del contenedor.",
    "osborn-labs": "El destino final del contenedor robado.",
    "midtown-high": "Creed corta camino por la escuela.",
    "daily-bugle": "La policía usa la azotea como puesto de vigilancia."
  },
  heroes: ["black-cat", "spider-man", "spider-woman"],
  prologo: [
    "El asistente de Osborn no quiere testigos. Contrató al único cazador que nunca suelta una presa: Victor Creed, Sabretooth.",
    "Felicia lleva dos días escondida en el cuarto de huéspedes de la tía May, que cree que es una compañera de la universidad de Peter. Esta noche, May baja a regar las plantas y encuentra marcas de garras en la puerta del jardín.",
    "Jessica Drew llega a Queens con malas noticias: Rhino entregó el contenedor y Creed salió de Oscorp Tower hace una hora. Por la radio de la policía se oye una voz ronca que se ríe: «Huele a gato.»"
  ],
  evento: { titulo: "La presa", texto: "Creed ya sabe dónde duerme Felicia.", efectos: ["Black Cat empieza la partida y recibe la ficha de Cazado.", "La tía May está en casa: coloca 1 Civil extra en Queens."] },
  pistas: { titulo: "El rastro del contenedor", texto: "Si siguen el camión de Rhino, sabrán dónde terminó la Muestra 7. Quedan huellas en el puente y en el laboratorio de Osborn.", lugares: ["brooklyn-bridge", "osborn-labs"] , premio: "Saben adónde fue la muestra y llegan antes: el villano del próximo capítulo empieza Frenado (ficha verde sobre su mazo)." },
  victoria: {
    titulo: "Gato salvaje",
    texto: [
      "Felicia esquiva el último zarpazo y Creed cae desde el techo de Midtown High sobre un camión de basura. Peter lo deja envuelto en telaraña para la policía.",
      "Ahora Felicia puede hablar: el contenedor está en el sótano de Osborn Laboratories, conectado a una máquina enorme que zumba día y noche. «No sé qué es», dice. «Pero hasta Rhino le tenía miedo.»"
    ],
    resumen: "Salvaron a Black Cat de Sabretooth y ella les dijo dónde está la Muestra 7.",
    siguiente: "I3BA"
  },
  derrota: {
    titulo: "Marcas de garras",
    texto: [
      "Sabretooth hiere a Felicia antes de desaparecer entre los techos. Ella sobrevive, pero pasará semanas recuperándose en Queens.",
      "En el bolsillo de Creed quedó un pase de seguridad de Osborn Laboratories. A medianoche, todas las luces de Manhattan parpadean al mismo tiempo: algo enorme se encendió en el sótano de Osborn."
    ],
    resumen: "Sabretooth hirió a Black Cat y algo enorme se encendió en Osborn Laboratories.",
    siguiente: "I3BB"
  }
},

"I3AA": {
  acto: 1, paso: 3, titulo: "El colisionador", villano: "juggernaut",
  inspiracion: "The Amazing Spider-Man #229-230 (1982), «Nada puede detener al Juggernaut»: Spider-Man lo atrapa en cemento fresco. El colisionador viene de la película Spider-Man: un nuevo universo (2018).",
  anillo: ["osborn-labs", "oscorp-tower", "midtown-high", "daily-bugle", "queens", "brooklyn-bridge"],
  notas: {
    "osborn-labs": "El colisionador, en el sótano. Juggernaut cuida la puerta.",
    "daily-bugle": "Los héroes salen desde aquí, justo después de vencer a Venom.",
    "oscorp-tower": "La subestación que alimenta el colisionador.",
    "brooklyn-bridge": "Los cables de alta tensión cruzan el río por el puente.",
    "midtown-high": "Frente a la escuela hay una obra en construcción con una mezcladora de cemento.",
    "queens": "Las grietas del cielo se ven desde el jardín de la tía May."
  },
  heroes: ["miles-morales", "ghost-spider", "spider-ham"],
  prologo: [
    "Norman Osborn sabe que su fórmula del Duende le está comiendo la cabeza. Leyó los informes de la NASA: la masa del transbordador sana cualquier cuerpo que toca. Si lograra domarla, sería fuerte y estaría cuerdo. Pero el simbionte no obedece a nadie.",
    "Por eso construyó el colisionador: una máquina que abre ventanas a otros universos. Osborn busca uno donde alguien ya haya domado al simbionte, para copiar cómo lo hizo. La otra mitad de la Muestra 7 es su batería. Y para que nadie lo apague, contrató a Cain Marko, el Juggernaut.",
    "Peter quedó molido después de pelear con Venom, así que Miles va al frente. Cuando llegan, el colisionador ya está encendido: el cielo sobre Osborn Laboratories se abre en grietas de colores. De una cae una chica con capucha blanca. Detrás de ella aterriza, de cabeza, un cerdo con antifaz."
  ],
  evento: { titulo: "Grietas en el cielo", texto: "Gwen Stacy (Ghost-Spider) y Peter Porker (Spider-Ham) se unen desde el principio. Por las grietas también cruzan matones de otros mundos.", efectos: ["Coloca 1 Matón extra en Osborn Laboratories."] },
  pistas: { titulo: "Cortar la corriente", texto: "El colisionador se alimenta de la subestación de Oscorp y de los cables del puente. Si cortan los dos, se apaga.", lugares: ["oscorp-tower", "brooklyn-bridge"] , premio: "La red eléctrica de Osborn quedó a su favor: en el próximo capítulo, cada héroe roba 4 cartas al empezar en vez de 3.", premioRobo: 1 },
  victoria: {
    titulo: "La grieta se cierra",
    texto: [
      "Miles atrae a Juggernaut hasta la obra frente a Midtown y Spider-Ham le vuelca encima una mezcladora entera de cemento fresco. Cuando Cain logra moverse, el cemento ya se secó.",
      "Gwen arranca el núcleo del colisionador y las grietas se cierran. Justo antes de la última, cae un tercer visitante con un traje negro y rojo del año 2099. Miguel O'Hara mira la máquina destruida y respira: «Llegué a tiempo. En mi época, lo que salió de esta máquina destruyó media ciudad.»"
    ],
    resumen: "Apagaron el colisionador; llegaron Ghost-Spider, Spider-Ham y Spider-Man 2099.",
    siguiente: "D1"
  },
  derrota: {
    titulo: "Nada lo detiene",
    texto: [
      "Juggernaut arrastra a los héroes a través de tres paredes y el colisionador sigue encendido toda la noche. Las grietas se abren sobre Manhattan y los noticieros muestran criaturas imposibles cruzando la calle.",
      "Al amanecer, Miguel O'Hara, Spider-Man 2099, cae por la última grieta antes de que se cierre sola. Mira la ciudad y aprieta los puños: «Osborn ya vio lo que buscaba. Ya sabe cómo domar al simbionte.»"
    ],
    resumen: "Juggernaut protegió el colisionador; Osborn vio lo que buscaba y llegó Spider-Man 2099.",
    efectos: [{ panico: 1 }],
    siguiente: "D1"
  }
},

"I3AB": {
  acto: 1, paso: 3, titulo: "El cazador de simbiontes", villano: "sabretooth", primero: "spider-woman",
  inspiracion: "La debilidad del simbionte al sonido y al fuego viene de sus primeras historias en los cómics de Spider-Man de los años 80.",
  anillo: ["brooklyn-bridge", "osborn-labs", "oscorp-tower", "daily-bugle", "midtown-high", "queens"],
  notas: {
    "brooklyn-bridge": "Venom se esconde en las cloacas bajo el puente. Creed ya está ahí.",
    "daily-bugle": "Los héroes salen desde el Bugle, donde Venom los venció.",
    "osborn-labs": "El camión de Oscorp espera con una jaula de acero sónico.",
    "oscorp-tower": "Gotas negras en la escalera de emergencia: el rastro de Venom.",
    "midtown-high": "Una alcantarilla de la escuela conecta con los túneles.",
    "queens": "Más rastro negro en un callejón de Queens."
  },
  heroes: ["spider-woman", "ghost-spider", "spider-man-2099"],
  prologo: [
    "Venom se esconde en las cloacas bajo el Puente de Brooklyn. Está herido y asustado: el simbionte no entiende por qué la ciudad entera lo odia.",
    "Osborn necesita a ese simbionte vivo. Su colisionador, una máquina que abre ventanas a otros universos, solo funcionó unos segundos con media muestra, pero bastó: en las cloacas aparecieron dos desconocidos. Gwen Stacy, Ghost-Spider, viene de un mundo donde la araña la picó a ella. Miguel O'Hara, Spider-Man 2099, viene del futuro con una advertencia: «Si Osborn junta las dos mitades, mi Nueva York nunca va a existir.»",
    "Jessica Drew guía a los recién llegados por los túneles. No son los únicos cazando: Osborn contrató a Sabretooth, y Creed ya olió a Jessica."
  ],
  evento: { titulo: "Olor a presa", texto: "Creed decide que la agente de S.H.I.E.L.D. es más divertida que el simbionte.", efectos: ["Spider-Woman empieza la partida y recibe la ficha de Cazado."] },
  pistas: { titulo: "El rastro de Venom", texto: "Venom dejó gotas negras en su huida. Si las siguen antes que Creed, llegan primero a él.", lugares: ["oscorp-tower", "queens"] , premio: "Venom les debe una: en el próximo capítulo, un héroe que ustedes elijan empieza con 2 fichas Comodín." },
  victoria: {
    titulo: "El cazador cae al río",
    texto: [
      "Creed cae al río desde el Puente de Brooklyn y no vuelve a salir, por ahora. En las cloacas, Gwen encuentra a Venom acurrucado y le habla despacio, como a un animal herido. El simbionte se retira de la cara de Eddie Brock.",
      "«Gracias», dice Eddie. «Osborn tiene la otra mitad en su laboratorio. El simbionte la escucha llamar.» Esa noche, un cerdo con antifaz cae por una alcantarilla de Queens preguntando por la salida."
    ],
    resumen: "Vencieron a Sabretooth, rescataron a Eddie Brock y llegaron los visitantes del Spider-Verse.",
    siguiente: "D1"
  },
  derrota: {
    titulo: "Venom atrapado",
    texto: [
      "Sabretooth arrastra a Venom en una red de acero sónico hasta un camión de Oscorp. Jessica alcanza a ver el logo antes de que arranque.",
      "Esa noche, Osborn junta las dos mitades de la Muestra 7 en su colisionador. Las grietas se abren sobre Manhattan y por una cae Spider-Ham, mareado. Eddie Brock, ya sin su simbionte, aparece en la puerta de Jessica, temblando: «Me lo quitaron. Ayúdenme a recuperarlo.»"
    ],
    resumen: "Sabretooth capturó al simbionte de Venom para Osborn; Eddie Brock pidió ayuda.",
    efectos: [{ panico: 1 }],
    siguiente: "D1"
  }
},

"I3BA": {
  acto: 1, paso: 3, titulo: "Nace Venom", villano: "venom", identidad: true,
  inspiracion: "El nacimiento de Venom en The Amazing Spider-Man #300 (1988) y la película Spider-Man 3 (2007), con Eddie Brock como fotógrafo resentido.",
  anillo: ["osborn-labs", "daily-bugle", "queens", "oscorp-tower", "brooklyn-bridge", "midtown-high"],
  notas: {
    "osborn-labs": "El colisionador se sobrecargó: Venom nace en el sótano.",
    "oscorp-tower": "Los héroes entran por el túnel de servicio que conecta las dos torres.",
    "daily-bugle": "Eddie escondió una copia de sus fotos en su casillero del Bugle.",
    "brooklyn-bridge": "La otra copia está en la cámara que Eddie perdió en el puente.",
    "queens": "Jameson manda reporteros a la casa de los Parker buscando una entrevista.",
    "midtown-high": "Las grietas iluminan la escuela como si fuera de día."
  },
  heroes: ["black-cat", "spider-man", "ghost-spider"],
  prologo: [
    "Gracias a Felicia, ahora saben dónde está la Muestra 7: conectada a una máquina enorme en el sótano de Osborn Laboratories. Peter la reconoce por unos planos que vio en la universidad: un colisionador, capaz de abrir ventanas a otros universos.",
    "Osborn busca un universo donde alguien ya haya domado al simbionte, para copiar el método. Su fórmula del Duende le está comiendo la cabeza, y la masa del espacio sana todo lo que toca.",
    "Peter y Felicia entran por el túnel de servicio de Oscorp Tower. No saben que alguien más se coló esa noche: Eddie Brock, un fotógrafo despedido del Bugle que busca la foto que le devuelva su trabajo. Cuando el colisionador se sobrecarga, la Muestra 7 sale disparada directo hacia Eddie."
  ],
  evento: { titulo: "Del otro lado", texto: "Una grieta se abre en medio del laboratorio y Gwen Stacy, Ghost-Spider, cae al lado de Peter. Se une desde el principio. Jameson ya mandó reporteros.", efectos: ["Desafío Identidad Secreta: la prensa vigila. Se ponen 3 Periodistas en la mesa y cada héroe que actúe cerca de ellos acumula Exposición; con 3, su identidad se revela (lo explica el paso «Desafío Identidad Secreta» de la preparación)."] },
  pistas: { titulo: "Las fotos de Eddie", texto: "Eddie fotografió el colisionador y el logo de Osborn. Si recuperan sus fotos, tendrán pruebas.", lugares: ["daily-bugle", "brooklyn-bridge"] , premio: "Las fotos de Eddie prueban todo y la gente confía en ustedes: en el próximo capítulo, rescaten 1 Civil de cualquier Lugar antes de empezar (cuenta para la Misión)." },
  victoria: {
    titulo: "Simbionte acorralado",
    texto: [
      "El fuego de un transformador hace chillar al simbionte. Eddie cae de rodillas, consciente, con la masa negra temblando sobre los hombros. «No la puedo soltar», jadea. «Y ella no me quiere soltar a mí.»",
      "Detrás de ellos, el colisionador se apaga con un último destello. Por la grieta que se cierra caen dos visitantes más: Spider-Ham y Spider-Man 2099."
    ],
    resumen: "Venom nació en el laboratorio de Osborn; lo contuvieron y llegaron Spider-Ham y Spider-Man 2099.",
    siguiente: "D1"
  },
  derrota: {
    titulo: "Venom suelto",
    texto: [
      "Venom destroza el laboratorio y salta a la calle con media Manhattan mirando. El colisionador queda abierto toda la noche.",
      "Al amanecer, Spider-Ham y Spider-Man 2099 aparecen en el techo de Oscorp. Miguel mira las noticias: «Ya empezó. En mi época, a esto lo llamaban el Año del Simbionte.»"
    ],
    resumen: "Venom escapó del laboratorio de Osborn y el colisionador quedó abierto.",
    efectos: [{ panico: 1 }],
    siguiente: "D1"
  }
},

"I3BB": {
  acto: 1, paso: 3, titulo: "Cemento fresco", villano: "juggernaut",
  inspiracion: "The Amazing Spider-Man #229-230 (1982), «Nada puede detener al Juggernaut». El colisionador viene de Spider-Man: un nuevo universo (2018).",
  anillo: ["osborn-labs", "oscorp-tower", "midtown-high", "queens", "daily-bugle", "brooklyn-bridge"],
  notas: {
    "osborn-labs": "El colisionador lleva toda la noche encendido. Juggernaut cuida la puerta.",
    "queens": "Peter cuida a Felicia en la casa de la tía May. Los héroes salen desde aquí.",
    "oscorp-tower": "La subestación que alimenta la máquina.",
    "brooklyn-bridge": "Los cables de alta tensión cruzan por el puente.",
    "midtown-high": "Una obra en construcción frente a la escuela: hay una mezcladora llena.",
    "daily-bugle": "Eddie Brock, fotógrafo del Bugle, va camino al laboratorio a buscar su exclusiva."
  },
  heroes: ["spider-man-2099", "spider-ham", "miles-morales"],
  prologo: [
    "El colisionador de Osborn lleva toda la noche encendido con la Muestra 7 completa. Es una máquina que abre ventanas a otros universos: Osborn busca uno donde alguien ya haya domado al simbionte, para copiar el método. Su fórmula del Duende le está comiendo la cabeza y la masa del espacio sana todo lo que toca.",
    "Las grietas sobre Manhattan dejan pasar más que luz. Por una cayó Miguel O'Hara, Spider-Man 2099, con una advertencia: en su futuro, esta noche es el principio del desastre. Por otra cayó Peter Porker, Spider-Ham, que todavía no entiende dónde está.",
    "Peter se queda en Queens cuidando a Felicia, y Miles guía a los recién llegados. Osborn sabía que vendrían: contrató a Cain Marko, el Juggernaut, para que nadie toque la máquina."
  ],
  evento: { titulo: "Ciudad agrietada", texto: "Miguel O'Hara y Spider-Ham ya están aquí y pelean desde el principio. Las grietas dejan pasar matones de otros mundos.", efectos: ["Coloca 1 Matón extra en Osborn Laboratories."] },
  pistas: { titulo: "Cortar la corriente", texto: "El colisionador se alimenta de la subestación de Oscorp y de los cables del puente. Si cortan los dos, se apaga.", lugares: ["oscorp-tower", "brooklyn-bridge"] , premio: "Sin colisionador, Osborn pierde tiempo: el villano del próximo capítulo empieza Frenado (ficha verde sobre su mazo)." },
  victoria: {
    titulo: "Atrapado hasta el cuello",
    texto: [
      "Miles atrae a Cain hasta la obra frente a Midtown y Spider-Ham le vuelca encima una mezcladora entera de cemento fresco. Juggernaut queda atrapado hasta el cuello, rugiendo.",
      "Miguel arranca el núcleo y el colisionador se apaga. Entre los cables, la Muestra 7 se retuerce y salta sobre el único humano que sacaba fotos desde la puerta: Eddie Brock, del Daily Bugle. Venom nace frente a ellos y huye por la ventana."
    ],
    resumen: "Apagaron el colisionador, pero la Muestra 7 se unió a Eddie Brock: nació Venom.",
    siguiente: "D1"
  },
  derrota: {
    titulo: "La noche más larga",
    texto: [
      "Juggernaut los saca del laboratorio a golpes y Osborn termina su experimento sin interrupciones.",
      "Cuando las grietas se cierran solas al amanecer, el laboratorio está vacío. Osborn ya copió el método que buscaba. La Muestra 7 escapó en el caos y se unió a un fotógrafo del Bugle, Eddie Brock. La ciudad tiene un monstruo nuevo, y Osborn tiene un plan."
    ],
    resumen: "Osborn completó su experimento y la Muestra 7 se unió a Eddie Brock.",
    efectos: [{ panico: 1 }],
    siguiente: "D1"
  }
},

/* ======================= ACTO II · MUTANTES EN LA MIRA ======================= */
"II1": {
  acto: 2, paso: 1, titulo: "La audiencia", villano: "mystique",
  inspiracion: "Uncanny X-Men #141-142 (1981), «Días del futuro pasado»: la Hermandad de Mystique intenta asesinar al Senador Robert Kelly.",
  anillo: ["daily-bugle", "oscorp-tower", "osborn-labs", "midtown-high", "queens", "brooklyn-bridge"],
  notas: {
    "midtown-high": "El auditorio donde Kelly da su discurso. Los héroes y Kelly empiezan aquí.",
    "daily-bugle": "Mystique entró con una credencial de prensa del Bugle.",
    "oscorp-tower": "El francotirador que contrató Mystique dispara desde un piso de Oscorp.",
    "brooklyn-bridge": "La caravana de Kelly debe salir por el puente.",
    "osborn-labs": "Osborn sigue el discurso en vivo desde su laboratorio.",
    "queens": "Ruta alternativa de evacuación."
  },
  heroes: ["cyclops", "jean-grey", "spider-man-2099"],
  llegan: ["cyclops", "jean-grey"],
  prologo: [
    "Grietas en el cielo, un monstruo de dientes en primera plana, criaturas de otros mundos en la calle. Nueva York tiene miedo, y el Senador Robert Kelly sabe aprovecharlo. Esta tarde da un discurso en el auditorio de Midtown High: quiere registrar a todos los mutantes y a todos los «fenómenos con máscara».",
    "El Profesor Xavier recibe una advertencia telepática: alguien va a matar a Kelly frente a las cámaras para que la culpa caiga sobre los mutantes. Charles está en Muir Island con Moira MacTaggert y no llega a tiempo. Manda a Scott Summers y a Jean Grey.",
    "Miguel O'Hara se ofrece a acompañarlos: en sus libros de historia, este discurso termina mal. Scott sabe lo que significa la misión: proteger al hombre que quiere encerrarlos. Lo hará igual. Entre los periodistas, una mujer de traje gris sonríe demasiado.",
    { si: { eddie: "confianza" }, t: "Eddie Brock se ofreció a venir. Scott le pidió que esperara afuera: un simbionte en un acto contra mutantes no ayuda a nadie." },
    { si: { eddie: "ravencroft" }, t: "Kelly abre su discurso con una foto de Eddie Brock entrando a Ravencroft: «Esto es lo que pasa cuando dejamos sueltos a los fenómenos.»" }
  ],
  evento: { titulo: "Cualquier cara", texto: "Mystique puede ser cualquiera del público.", efectos: ["Coloca 1 Civil extra en Midtown High."] },
  pistas: { titulo: "El francotirador", texto: "Mystique no trabaja sola: un francotirador espera en Oscorp y un auto de escape en el puente. Si los neutralizan, encuentran quién pagó.", lugares: ["oscorp-tower", "brooklyn-bridge"] , premio: "El teléfono del francotirador tiene el plan del enemigo: en el próximo capítulo, miren las 3 primeras cartas del Plan Maestro y ordénenlas como quieran." },
  victoria: {
    titulo: "Kelly sigue vivo",
    texto: [
      "Mystique escapa por una ventana con la forma de una paloma, pero Kelly sigue vivo. Frente a las cámaras, el senador dice algo que nadie esperaba: «Hoy un mutante me salvó la vida.»",
      "En el piso del auditorio queda el teléfono de Mystique. El último mensaje es una transferencia de dinero firmada con una sola letra: O. Hay un archivo adjunto: «Arma X, protocolo de unión»."
    ],
    resumen: "Salvaron al Senador Kelly; el teléfono de Mystique la conecta con Osborn y con Arma X.",
    efectos: [{ panico: -1 }, { flag: "kelly", valor: "salvado" }],
    siguiente: "D2", siguienteTrasDecision: "II2A"
  },
  derrota: {
    titulo: "Kelly herido",
    texto: [
      "Kelly sale en camilla. Sobrevivirá, pero desde el hospital firma la orden que soñaba: registro obligatorio para todo mutante en Nueva York. Oscorp gana el contrato para «estudiar» a los detenidos.",
      "En el piso del auditorio queda el teléfono de Mystique. El último mensaje es una transferencia firmada con una letra: O. Y una orden: «Siguiente paso: Cerebro.»"
    ],
    resumen: "Kelly quedó herido e impulsa el registro de mutantes; Osborn va por Cerebro.",
    efectos: [{ panico: 1 }, { flag: "kelly", valor: "herido" }],
    siguiente: "D2", siguienteTrasDecision: "II2B"
  }
},

"II2A": {
  acto: 2, paso: 2, titulo: "Arma X", villano: "sabretooth", primero: "wolverine",
  inspiracion: "Weapon X, de Barry Windsor-Smith (Marvel Comics Presents #72-84, 1991): el origen del esqueleto de adamantium de Logan.",
  anillo: ["weapon-x", "osborn-labs", "muir-island", "x-jet", "hangar-bay", "xavier-institute"],
  notas: {
    "weapon-x": "La instalación abandonada en Canadá. Creed cuida los archivos.",
    "x-jet": "Los héroes aterrizan aquí.",
    "osborn-labs": "El destino de los archivos: un camión los espera.",
    "hangar-bay": "Una avioneta de Oscorp carga cajas de archivos.",
    "muir-island": "Charles sigue la misión por radio desde Muir Island.",
    "xavier-institute": "Hank espera los papeles en el laboratorio de la escuela."
  },
  heroes: ["wolverine", "storm", "spider-woman"],
  llegan: ["wolverine", "storm"],
  prologo: [
    "El archivo adjunto del teléfono de Mystique tenía una dirección en Canadá: la vieja Instalación Arma X, donde le pegaron el adamantium a los huesos de Logan. Lleva años abandonada. Alguien volvió a encender las luces.",
    "Arma X sabía hacer algo que nadie más sabe: unir para siempre algo vivo a un cuerpo sin matarlo. Es lo que Osborn necesita para que el simbionte no lo abandone nunca.",
    "Logan baja del X-Jet con Ororo y con Jessica Drew, que conoce los archivos de S.H.I.E.L.D. sobre Arma X. Huele el aire: sangre, tabaco y algo dulzón. «Creed», gruñe. Osborn contrató a Sabretooth para cuidar los archivos.",
    { vio: "sabretooth", t: "Creed tiene cuentas pendientes con ustedes desde Nueva York. Esta vez vino preparado." }
  ],
  evento: { titulo: "Viejas heridas", texto: "Arma X huele al pasado de Logan, y Creed lo sabe.", efectos: ["Wolverine empieza la partida y recibe la ficha de Cazado.", "Coloca 1 Matón extra en Weapon X Facility."] },
  pistas: { titulo: "Los archivos", texto: "Las cajas de archivos ya salieron hacia la avioneta y hacia el camión de Oscorp. Si las recuperan, sabrán todo el plan.", lugares: ["hangar-bay", "osborn-labs"] , premio: "Los archivos de Arma X enseñan cómo pelea Osborn: en el próximo capítulo, cada héroe empieza con 1 ficha Heroica." },
  victoria: {
    titulo: "Garra contra garra",
    texto: [
      "Logan deja a Creed colgado de una viga, inconsciente. Entre los archivos rescatados está el plan completo: Osborn quiere unir el simbionte a su propio cuerpo con el método de Arma X. Y para saber quién más es compatible necesita la máquina que encuentra a cualquier persona del planeta: Cerebro.",
      "Hank McCoy lee los papeles en el avión de vuelta y se pone pálido: «Va a ir por la escuela.»"
    ],
    resumen: "Vencieron a Sabretooth y recuperaron los archivos de Arma X: Osborn va por Cerebro.",
    siguiente: "II3AA"
  },
  derrota: {
    titulo: "Creed se lleva los archivos",
    texto: [
      "Sabretooth desaparece en el bosque con la mitad de los archivos. Logan sangra en la nieve, ya cerrándose las heridas, furioso.",
      "Lo que quedó alcanza para entender el plan: Osborn quiere unirse al simbionte con el método de Arma X. En una de las hojas que se salvaron hay una palabra subrayada dos veces: Cerebro."
    ],
    resumen: "Sabretooth escapó con medio expediente de Arma X; Osborn va por Cerebro.",
    efectos: [{ panico: 1 }],
    siguiente: "II3AB"
  }
},

"II2B": {
  acto: 2, paso: 2, titulo: "La ley Kelly", villano: "juggernaut",
  inspiracion: "X-Men #12-13 (1965): Juggernaut ataca por primera vez la escuela de su hermanastro, Charles Xavier.",
  anillo: ["xavier-institute", "hangar-bay", "x-jet", "muir-island", "queens", "midtown-high"],
  notas: {
    "xavier-institute": "Juggernaut entra por el bosque de Westchester rumbo al sótano.",
    "muir-island": "Charles y Moira siguen en Muir Island. Los héroes salen desde ahí.",
    "hangar-bay": "Las compuertas del hangar protegen la entrada a Cerebro.",
    "x-jet": "El avión, listo para evacuar a los alumnos.",
    "queens": "Los alumnos que viven en la ciudad ven las noticias aterrados.",
    "midtown-high": "Kelly anuncia desde Midtown que los mutantes «se resisten a la ley»."
  },
  heroes: ["storm", "beast", "spider-ham"],
  llegan: ["storm", "beast"],
  prologo: [
    "La ley de Kelly está firmada y Oscorp tiene el contrato para «estudiar» a los mutantes detenidos. Solo le falta la lista: quién es mutante, dónde vive, qué puede hacer. Esa lista existe, y está en un sótano de Westchester. Se llama Cerebro.",
    "Osborn no va a entrar él mismo a la escuela de Xavier. Para eso tiene a alguien que odia a Charles más que nadie: su hermanastro, Cain Marko. Le prometió a Juggernaut que podrá destruir la casa donde creció a la sombra de Charles.",
    "Charles sigue en Muir Island cuando Cerebro detecta la señal: algo enorme atraviesa el bosque de Westchester en línea recta. Ororo y Hank despegan con el único visitante del Spider-Verse que se ofreció a ayudar: Spider-Ham. «Si es grande y no frena», dice, «es mi especialidad.»",
    { vio: "juggernaut", t: "Cain no olvidó a los que lo dejaron en ridículo en Nueva York." }
  ],
  evento: { titulo: "Los alumnos", texto: "Hay estudiantes atrapados en la escuela.", efectos: ["Coloca 1 Civil extra en Xavier Institute."] },
  pistas: { titulo: "Sellar Cerebro", texto: "Si cierran las compuertas del hangar y preparan el X-Jet para evacuar, Cerebro queda sellado aunque Cain llegue al sótano.", lugares: ["hangar-bay", "x-jet"] , premio: "La escuela queda blindada y los alumnos ayudan: en el próximo capítulo, derroten 1 Matón de cualquier Lugar antes de empezar (cuenta para la Misión)." },
  victoria: {
    titulo: "El casco",
    texto: [
      "Spider-Ham se planta frente a Juggernaut y le anula el paso con una telaraña de dibujo animado. Ororo le arranca el casco con un rayo, y Charles, desde Muir Island, apaga la mente de Cain como quien apaga una luz.",
      "Cerebro está a salvo. Pero al revisar los registros, Hank encuentra algo peor: alguien más entró a la red desde el espacio. Magneto también quiere la lista."
    ],
    resumen: "Detuvieron a Juggernaut y Cerebro quedó a salvo, pero Magneto también busca la lista.",
    efectos: [{ flag: "cerebro", valor: "a_salvo" }],
    siguiente: "II3BA"
  },
  derrota: {
    titulo: "El sótano abierto",
    texto: [
      "Juggernaut llega al sótano y arranca el disco de respaldo de Cerebro antes de que lo saquen a golpes. Osborn ya tiene la lista de mutantes.",
      "Esa noche empiezan las redadas. Y en Genosha, la isla donde se refugian los mutantes que huyen, alguien empieza a preparar una cacería."
    ],
    resumen: "Juggernaut robó la lista de Cerebro para Osborn y empezaron las redadas.",
    efectos: [{ panico: 1 }, { flag: "cerebro", valor: "robado" }],
    siguiente: "II3BB"
  }
},

"II3AA": {
  acto: 2, paso: 3, titulo: "Cerebro", villano: "magneto",
  inspiracion: "Magneto debutó en X-Men #1 (1963) y su fortaleza orbital, Asteroid M, en X-Men #5 (1964).",
  anillo: ["asteroid-m", "sentinel-station", "hangar-bay", "xavier-institute", "muir-island", "genosha"],
  notas: {
    "asteroid-m": "La fortaleza de Magneto en órbita. Desde ahí ataca.",
    "xavier-institute": "Cerebro está en el sótano. Los héroes lo defienden desde aquí.",
    "sentinel-station": "Magneto usa la vieja estación de los Centinelas como antena para entrar a Cerebro.",
    "genosha": "La isla adonde Erik quiere llevarse a los mutantes de la lista.",
    "hangar-bay": "Erik arranca el hangar de cuajo.",
    "muir-island": "Charles sigue la batalla desde Muir Island."
  },
  heroes: ["beast", "jean-grey", "ghost-spider"],
  llegan: ["beast"],
  prologo: [
    "Magneto leyó los mismos archivos que ustedes. Sabe que Osborn busca Cerebro para encontrar cuerpos compatibles con su simbionte, y que la mayoría de esos cuerpos son mutantes.",
    "Erik no quiere destruir Cerebro: quiere usarlo. Planea encontrar primero a todos los mutantes de la lista y llevárselos a Genosha. «Protegidos», dice. «A mi manera.» Hank entiende lo que eso significa: cientos de familias sacadas de sus casas sin preguntarles.",
    "Hank se sienta frente a Cerebro con Jean. Gwen Stacy vigila la puerta. Desde Asteroid M empieza a llover metal sobre Westchester."
  ],
  evento: { titulo: "Conectados a Cerebro", texto: "Jean entra a Cerebro con Hank para borrar la lista antes que Erik.", efectos: ["Jean Grey empieza con 1 ficha Heroica."] },
  pistas: { titulo: "Cortar la antena", texto: "Erik entra a Cerebro usando la vieja estación de los Centinelas como antena y ya mandó una copia de la lista a Genosha.", lugares: ["sentinel-station", "genosha"] , premio: "Sin antena, Magneto no puede espiar a nadie: en el próximo capítulo, cada héroe empieza con 1 ficha de Movimiento." },
  victoria: {
    titulo: "La lista a salvo",
    texto: [
      "Hank borra la lista de Cerebro un segundo antes de que Erik la vea. Magneto cae de rodillas sobre el pasto, sin casco. No pelea más. «Osborn no va a parar», dice. «Y ustedes no van a poder solos.»",
      "Erik se queda mirando a Charles en la pantalla de Muir Island. Por primera vez en años, le pide permiso para quedarse."
    ],
    resumen: "Protegieron Cerebro de Magneto, y Magneto pidió quedarse a ayudar.",
    efectos: [{ flag: "cerebro", valor: "a_salvo" }],
    siguiente: "D3"
  },
  derrota: {
    titulo: "Erik ve la lista",
    texto: [
      "Magneto alcanza a ver la lista antes de que Hank la borre. Pero lo que lee lo detiene: entre los nombres compatibles hay uno que no es mutante. Cletus Kasady, preso en Ravencroft.",
      "«Osborn no busca mutantes», dice Erik. «Busca un cuerpo para algo que ya creó.» Y por primera vez, ofrece su ayuda."
    ],
    resumen: "Magneto vio la lista de Cerebro, descubrió el nombre de Kasady y ofreció su ayuda.",
    efectos: [{ panico: 1 }],
    siguiente: "D3"
  }
},

"II3AB": {
  acto: 2, paso: 3, titulo: "El sótano", villano: "juggernaut",
  inspiracion: "X-Men #12-13 (1965): la primera vez que Cain Marko entra a la escuela de su hermanastro.",
  anillo: ["xavier-institute", "midtown-high", "queens", "x-jet", "hangar-bay", "muir-island"],
  notas: {
    "xavier-institute": "Juggernaut ya está adentro, rumbo al sótano de Cerebro.",
    "x-jet": "Scott, Logan y Miguel llegan volando desde Nueva York.",
    "hangar-bay": "Las compuertas blindadas del sótano.",
    "muir-island": "Charles necesita tiempo para entrar a la mente de Cain.",
    "midtown-high": "Algunos alumnos de la escuela de Xavier estudian en la ciudad.",
    "queens": "Ruta de los autobuses que evacúan a los alumnos."
  },
  heroes: ["cyclops", "wolverine", "spider-man-2099"],
  prologo: [
    "Con la mitad de los archivos de Arma X, Osborn sabe qué le falta: Cerebro, la máquina de Charles Xavier que encuentra a cualquier persona del planeta. Con ella puede buscar quién más es compatible con el simbionte.",
    "Y para entrar a la escuela de Xavier tiene a alguien que odia a Charles más que nadie: su hermanastro, Cain Marko, el Juggernaut.",
    "Scott y Logan vuelan desde Nueva York en el X-Jet con Miguel O'Hara, que en su futuro estudió a Juggernaut en los libros de historia. «En 2099 todavía no encontraron nada que lo frene», dice. «Así que mejor no lo dejen arrancar.»",
    { vio: "juggernaut", t: "Cain recuerda muy bien la última vez que se cruzaron." }
  ],
  evento: { titulo: "Ya entró", texto: "Juggernaut rompió el muro norte antes de que el X-Jet aterrizara.", efectos: ["Juggernaut empieza Acelerado (ficha naranja al final de la Trama)."] },
  pistas: { titulo: "Sellar Cerebro", texto: "Las compuertas blindadas y el respaldo de Muir Island pueden proteger la lista aunque Cain llegue al sótano.", lugares: ["hangar-bay", "muir-island"] , premio: "Cerebro sigue a salvo y los vigila a todos: el villano del próximo capítulo empieza Frenado (ficha verde sobre su mazo)." },
  victoria: {
    titulo: "Un casco menos",
    texto: [
      "Scott le arranca el casco a Cain con una ráfaga óptica a quemarropa y Charles, desde Muir Island, lo duerme en el acto. Cerebro está a salvo.",
      "Al revisar los registros, Hank descubre que alguien más espiaba la lista desde el espacio: Magneto. En la pantalla queda resaltado un nombre que no es mutante: Cletus Kasady, Ravencroft."
    ],
    resumen: "Detuvieron a Juggernaut y Cerebro quedó a salvo; Magneto también espiaba la lista.",
    efectos: [{ flag: "cerebro", valor: "a_salvo" }],
    siguiente: "D3"
  },
  derrota: {
    titulo: "Cerebro robado",
    texto: [
      "Juggernaut arranca el disco de respaldo de Cerebro y sale caminando por el mismo agujero por donde entró. Osborn tiene la lista.",
      "Esa noche, Magneto aparece en el jardín destruido, solo, sin atacar. «Osborn tiene la lista de mis hermanos», dice. «Vengo a ofrecerles algo que no les va a gustar: mi ayuda.»"
    ],
    resumen: "Juggernaut robó la lista de Cerebro y Magneto ofreció su ayuda.",
    efectos: [{ panico: 1 }, { flag: "cerebro", valor: "robado" }],
    siguiente: "D3"
  }
},

"II3BA": {
  acto: 2, paso: 3, titulo: "La estación", villano: "magneto",
  inspiracion: "Los Centinelas, robots cazadores de mutantes, debutaron en X-Men #14 (1965). Magneto y Asteroid M, en X-Men #5 (1964).",
  anillo: ["sentinel-station", "asteroid-m", "genosha", "hangar-bay", "xavier-institute", "x-jet"],
  notas: {
    "sentinel-station": "La estación de los Centinelas. Magneto la tomó.",
    "hangar-bay": "Hank prepara el X-Jet para subir a la órbita. Los héroes salen desde aquí.",
    "asteroid-m": "La fortaleza de Erik, al lado de la estación.",
    "genosha": "Los refugiados que Erik quiere proteger.",
    "xavier-institute": "Jean usa Cerebro a distancia para llegar a la mente de Erik.",
    "x-jet": "El avión, cargado de combustible para el viaje."
  },
  heroes: ["jean-grey", "beast", "spider-man"],
  llegan: ["beast"],
  prologo: [
    "La ley de Kelly despertó algo que debía seguir dormido: la vieja estación espacial de los Centinelas, las máquinas creadas para cazar mutantes. Oscorp la está reactivando con dinero del gobierno.",
    "Magneto no va a esperar a que las máquinas despierten. Tomó la estación desde Asteroid M y amenaza con dejarla caer sobre Washington si Kelly no deroga su ley.",
    "Jean puede usar Cerebro a distancia para llegar a la mente de Erik, pero necesita tiempo. Hank prepara el X-Jet en Hangar Bay. Peter insiste en ir: «Si esa cosa cae sobre Washington, la próxima ley va a ser contra todos nosotros.»"
  ],
  evento: { titulo: "Refugiados", texto: "Erik dice que lo hace por los mutantes que se esconden en Genosha.", efectos: ["Coloca 1 Civil extra en Genosha."] },
  pistas: { titulo: "Apagar los Centinelas", texto: "Los Centinelas se controlan desde Asteroid M y reciben órdenes de Cerebro. Si cortan las dos señales, no despiertan nunca.", lugares: ["asteroid-m", "xavier-institute"] , premio: "Los Centinelas duermen para siempre y la alianza respira: en el próximo capítulo, cada héroe roba 4 cartas al empezar en vez de 3.", premioRobo: 1 },
  victoria: {
    titulo: "La estación se apaga",
    texto: [
      "Jean llega a la mente de Erik y le muestra lo que ella ve: a Osborn riéndose de los dos. Magneto suelta la estación, que se queda flotando en órbita, apagada.",
      "Erik baja a la Tierra sin casco. En Cerebro brilla un nombre que no es mutante: Cletus Kasady, Ravencroft. «Osborn no busca mutantes», dice Erik. «Busca un cuerpo para algo que ya creó. Déjenme ayudar.»"
    ],
    resumen: "Detuvieron a Magneto en la estación de los Centinelas y él ofreció su ayuda.",
    siguiente: "D3"
  },
  derrota: {
    titulo: "Fuego en el cielo",
    texto: [
      "Magneto deja caer la estación, pero Jean consigue desviarla al océano en el último segundo. Nadie muere. Washington tiembla igual: Kelly declara a Magneto enemigo público.",
      "Esa noche Erik aparece en el jardín de la escuela, herido y sin casco. «Osborn me usó», dice. «Las órdenes de reactivar la estación eran suyas. Quería que yo hiciera esto.» Por primera vez, ofrece su ayuda."
    ],
    resumen: "Magneto dejó caer la estación de los Centinelas; descubrió que Osborn lo usó y ofreció su ayuda.",
    efectos: [{ panico: 1 }],
    siguiente: "D3"
  }
},

"II3BB": {
  acto: 2, paso: 3, titulo: "Cacería en Genosha", villano: "sabretooth", primero: "wolverine",
  inspiracion: "Genosha, la isla donde los mutantes eran esclavos, aparece en Uncanny X-Men #235 (1988); años después se convirtió en el refugio de Magneto.",
  anillo: ["weapon-x", "asteroid-m", "sentinel-station", "genosha", "hangar-bay", "x-jet"],
  notas: {
    "weapon-x": "Osborn usa Arma X como base para sus cazadores. Creed sale desde aquí.",
    "genosha": "Los refugiados de la lista. Los héroes los defienden desde aquí.",
    "asteroid-m": "Un grupo de refugiados se escondió en los túneles de Asteroid M.",
    "hangar-bay": "Otros esperan en el hangar a que alguien los saque.",
    "sentinel-station": "Las cámaras de la estación siguen cada movimiento de la isla.",
    "x-jet": "El avión que llevará a los refugiados a la escuela."
  },
  heroes: ["wolverine", "cyclops", { si: { eddie: "confianza" }, h: "venom-hero", no: "black-cat" }],
  llegan: ["wolverine"],
  prologo: [
    "Con la lista de Cerebro, Osborn empezó las redadas. Muchos mutantes huyeron a Genosha, la isla que Magneto ofrece como refugio.",
    "Osborn no quiere refugios. Mandó a Sabretooth a Genosha con una lista y una orden: traer vivos a los compatibles y no dejar testigos.",
    "Logan llega primero, con Scott. Creed lo estaba esperando: «Esta vez la presa eres tú, enano.»",
    { si: { eddie: "confianza" }, t: "Eddie Brock vino con ellos. El simbionte también sabe lo que es que te cacen." },
    { si: { eddie: "ravencroft" }, t: "Felicia Hardy vino con ellos: Osborn le debe una, y ella cobra sus deudas." }
  ],
  evento: { titulo: "La cacería", texto: "Creed vino por Logan antes que por nadie.", efectos: ["Wolverine empieza la partida y recibe la ficha de Cazado.", "Hay refugiados en la isla: coloca 1 Civil extra en Genosha."] },
  pistas: { titulo: "Los escondidos", texto: "Dos grupos de refugiados se escondieron lejos de la playa. Si los encuentran antes que Creed, los sacan a todos.", lugares: ["asteroid-m", "hangar-bay"] , premio: "Los refugiados rescatados se suman a la evacuación: en el próximo capítulo, rescaten 2 Civiles de cualquier Lugar antes de empezar (cuentan para la Misión)." },
  victoria: {
    titulo: "La isla resiste",
    texto: [
      "Logan y Creed caen juntos por un acantilado y solo Logan vuelve a subir. Los refugiados están a salvo.",
      "Magneto llega de Asteroid M cuando ya todo terminó. Ve a Logan ensangrentado protegiendo a su gente y baja la mano. «Osborn tiene la lista de mis hermanos», dice. «Déjenme pelear a su lado.»"
    ],
    resumen: "Salvaron a los refugiados de Genosha y Magneto ofreció su ayuda.",
    siguiente: "D3"
  },
  derrota: {
    titulo: "Jaulas",
    texto: [
      "Sabretooth se lleva a seis mutantes en jaulas hacia los laboratorios de Osborn. Logan tarda un día entero en levantarse.",
      "Magneto llega tarde y encuentra la isla vacía. No grita: se queda mirando el mar. «Osborn tiene a mis hermanos», dice. «Y ustedes son los únicos que intentaron detenerlo. Déjenme ayudar.»"
    ],
    resumen: "Sabretooth se llevó a seis mutantes de Genosha y Magneto ofreció su ayuda.",
    efectos: [{ panico: 1 }],
    siguiente: "D3"
  }
},

/* ======================= ACTO III · MÁXIMA MATANZA ======================= */
"III1M": {
  acto: 3, paso: 1, titulo: "El Duende en Genosha", villano: "green-goblin",
  inspiracion: "Norman Osborn se convirtió en el Duende Verde en The Amazing Spider-Man #14 (1964) y reveló su identidad en el #39 (1966).",
  anillo: ["genosha", "x-jet", "hangar-bay", "asteroid-m", "sentinel-station", "muir-island"],
  notas: {
    "genosha": "El Duende bombardea la isla para llevarse a los mutantes de la lista.",
    "asteroid-m": "La fortaleza de Magneto. Los héroes planeaban aquí cuando sonó la alarma.",
    "x-jet": "Dos mutantes de la lista se esconden en el avión averiado.",
    "sentinel-station": "Otros se refugiaron en la estación abandonada.",
    "hangar-bay": "El hangar de la isla, lleno de metal para Magneto.",
    "muir-island": "Moira recibe a los heridos."
  },
  heroes: ["magneto-hero", "storm", "spider-man"],
  llegan: ["mystique-hero"],
  prologo: [
    "Magneto los lleva a Asteroid M, su fortaleza en órbita, para planear juntos. No alcanzan a sentarse: las alarmas de Genosha suenan al mismo tiempo.",
    "Sobre la isla vuela un planeador. El hombre que va encima tira bombas de calabaza sobre los refugiados y se ríe con una voz que Peter conoce demasiado bien. Norman Osborn ya no se esconde: es el Duende Verde, y viene a llevarse a los mutantes de la lista.",
    { si: { evidencia: "publica" }, t: "Desde que el Bugle publicó la prueba, Osborn lo perdió todo. Ya no tiene nada que cuidar." },
    { si: { evidencia: "secreta" }, t: "Gracias a la prueba que guardaron, Jessica sabía que Osborn atacaría hoy: llegan antes que él." },
    "En la playa los espera alguien que no esperaban: Mystique. Osborn la culpó de todo frente a la prensa y ella quiere verlo caer. «No vengo a ayudarlos», dice. «Vengo a verlo perder.»"
  ],
  evento: { titulo: "Bombas sobre la isla", texto: "El Duende ataca sin esconderse.", efectos: [
    { si: { evidencia: "publica" }, t: "Osborn está desesperado: el Duende empieza Acelerado (ficha naranja al final de la Trama)." },
    { si: { evidencia: "secreta" }, t: "Llegaron antes que él: el Duende empieza Frenado (ficha verde sobre su mazo)." },
    "Coloca 1 Civil extra en Genosha."
  ] },
  pistas: { titulo: "Los compatibles", texto: "Hay mutantes de la lista escondidos en el X-Jet averiado y en la estación abandonada. Si los sacan primero, el Duende se va con las manos vacías.", lugares: ["x-jet", "sentinel-station"] , premio: "Los mutantes salvados ofrecen su ayuda: en el próximo capítulo, un héroe que ustedes elijan empieza con 2 fichas Comodín." },
  victoria: {
    titulo: "El planeador cae",
    texto: [
      "Magneto le arranca el planeador al Duende como quien le quita un juguete a un niño, y Norman Osborn cae sobre la arena de Genosha. S.H.I.E.L.D. se lo lleva esposado.",
      "Pero en su laboratorio de Nueva York, una cámara frigorífica se abre sola a medianoche. Osborn había dejado un plan de respaldo: una gota de la Muestra 7 viaja ya por las cañerías hacia Ravencroft, hacia la celda de Cletus Kasady."
    ],
    resumen: "Capturaron al Duende Verde en Genosha, pero una gota de la Muestra 7 viaja hacia Kasady.",
    efectos: [{ flag: "osborn", valor: "preso" }],
    siguiente: "III2A"
  },
  derrota: {
    titulo: "Vuela libre",
    texto: [
      "El Duende escapa con tres mutantes en una red y una carcajada que se oye en toda la isla.",
      "Magneto rastrea el planeador hasta Nueva York. Osborn tiene ahora los cuerpos que necesitaba y le falta una sola pieza: un simbionte adulto, que ya sepa obedecer. Solo hay uno así en la ciudad: el de Eddie Brock."
    ],
    resumen: "El Duende escapó de Genosha con tres mutantes y ahora va por el simbionte de Eddie Brock.",
    efectos: [{ panico: 1 }, { flag: "osborn", valor: "profugo" }],
    siguiente: "III2B"
  }
},

"III1X": {
  acto: 3, paso: 1, titulo: "El Duende sin máscara", villano: "green-goblin", identidad: true,
  inspiracion: "Norman Osborn se convirtió en el Duende Verde en The Amazing Spider-Man #14 (1964) y reveló su identidad en el #39 (1966).",
  anillo: ["daily-bugle", "brooklyn-bridge", "queens", "oscorp-tower", "osborn-labs", "midtown-high"],
  notas: {
    "daily-bugle": "El Duende bombardea la redacción del Bugle.",
    "oscorp-tower": "Peter y Felicia registraban la oficina de Osborn. Salen desde aquí.",
    "brooklyn-bridge": "Un reportero huyó con una copia de los archivos del Bugle.",
    "midtown-high": "Otra copia está en el aula de periodismo de la escuela.",
    "osborn-labs": "El laboratorio del Duende, vacío: ya salió a pelear.",
    "queens": "La tía May ve el ataque por televisión."
  },
  heroes: ["spider-man", "black-cat", "mystique-hero"],
  llegan: ["mystique-hero"],
  prologo: [
    "Sin Magneto, la alianza vuelve a Nueva York a buscar a Osborn por su cuenta. Peter y Felicia registran su oficina en lo alto de Oscorp Tower cuando la radio de la policía enloquece.",
    "Un planeador da vueltas alrededor del Daily Bugle tirando bombas de calabaza contra la redacción. El hombre que va encima se ríe con una voz que Peter conoce demasiado bien. Norman Osborn dejó de fingir que es un empresario: ahora es el Duende Verde.",
    { si: { evidencia: "publica" }, t: "Va por Jameson: el Bugle publicó la prueba y Osborn lo perdió todo." },
    { si: { evidencia: "secreta" }, t: "Va por los archivos del Bugle: sospecha que alguien guarda pruebas en su contra. Gracias a Jessica, ustedes ya lo esperaban." },
    "En la azotea de Oscorp los espera alguien que no esperaban: Mystique. Osborn la culpó de todo frente a la prensa y ella quiere verlo caer. «No vengo a ayudarlos», dice. «Vengo a verlo perder.»"
  ],
  evento: { titulo: "Fuego en la redacción", texto: "Toda la prensa de la ciudad está mirando.", efectos: [
    "Desafío Identidad Secreta: la prensa vigila. Se ponen 3 Periodistas en la mesa y cada héroe que actúe cerca de ellos acumula Exposición; con 3, su identidad se revela (lo explica el paso «Desafío Identidad Secreta» de la preparación).",
    { si: { evidencia: "publica" }, t: "Osborn está desesperado: el Duende empieza Acelerado (ficha naranja al final de la Trama)." },
    { si: { evidencia: "secreta" }, t: "Ya lo esperaban: el Duende empieza Frenado (ficha verde sobre su mazo)." }
  ] },
  pistas: { titulo: "Las copias", texto: "Dos copias de las pruebas contra Osborn siguen en la ciudad: en el puente y en el aula de periodismo de Midtown. Si el Duende las encuentra primero, las quema.", lugares: ["brooklyn-bridge", "midtown-high"] , premio: "Las pruebas del Bugle revelan los planes del Duende: en el próximo capítulo, miren las 3 primeras cartas del Plan Maestro y ordénenlas como quieran." },
  victoria: {
    titulo: "Desenmascarado",
    texto: [
      "Peter le arranca la máscara al Duende frente a todas las cámaras del Bugle y Norman Osborn cae sobre la azotea, temblando. S.H.I.E.L.D. se lo lleva esposado.",
      "Pero en su laboratorio, una cámara frigorífica se abre sola a medianoche. Osborn había dejado un plan de respaldo: una gota de la Muestra 7 viaja ya por las cañerías hacia Ravencroft, hacia la celda de Cletus Kasady."
    ],
    resumen: "Atraparon al Duende Verde en el Bugle, pero una gota de la Muestra 7 viaja hacia Kasady.",
    efectos: [{ flag: "osborn", valor: "preso" }],
    siguiente: "III2A"
  },
  derrota: {
    titulo: "El Bugle en llamas",
    texto: [
      "El Duende deja el Bugle en llamas y desaparece entre los rascacielos. Jameson sobrevive gritando, como siempre.",
      "En la azotea, Mystique encuentra una libreta que a Osborn se le cayó. Dice que le falta una sola pieza: un simbionte adulto que ya sepa obedecer. Solo hay uno así en la ciudad: el de Eddie Brock."
    ],
    resumen: "El Duende escapó tras incendiar el Bugle y ahora va por el simbionte de Eddie Brock.",
    efectos: [{ panico: 1 }, { flag: "osborn", valor: "profugo" }],
    siguiente: "III2B"
  }
},

"III2A": {
  acto: 3, paso: 2, titulo: "Ariete carmesí", villano: "rhino",
  inspiracion: "Carnage debutó en The Amazing Spider-Man #361 (1992): Cletus Kasady era el compañero de celda de Eddie Brock.",
  anillo: ["brooklyn-bridge", "oscorp-tower", "osborn-labs", "daily-bugle", "queens", "midtown-high"],
  notas: {
    "brooklyn-bridge": "Rhino, cubierto de rojo, carga contra el puente para partir la ciudad.",
    "daily-bugle": "Los héroes se reúnen en la azotea del Bugle.",
    "osborn-labs": "Hay engendros rojos dentro del laboratorio abandonado de Osborn.",
    "queens": "Otros engendros se esconden en los sótanos de Queens.",
    "oscorp-tower": "La torre vacía, sin su dueño.",
    "midtown-high": "Algo rojo se mueve detrás de las ventanas de la escuela."
  },
  heroes: ["wolverine", "spider-woman", { si: { eddie: "confianza" }, h: "venom-hero", no: "miles-morales" }],
  prologo: [
    "Ravencroft ya no existe. Esta madrugada, Cletus Kasady salió caminando por la puerta principal, cubierto de rojo, riéndose. La gota de simbionte que Osborn le mandó encontró a la persona más cruel de la prisión. Ahora se llama Carnage.",
    "Lo primero que hizo fue buscar a alguien grande. Aleksei Sytsevich, Rhino, cumplía condena en la celda de al lado. Ahora tiene zarcillos rojos en la armadura y carga contra el Puente de Brooklyn para partir la ciudad en dos.",
    { si: { eddie: "confianza" }, t: "Logan y Jessica llegan primero, con Eddie Brock. El simbionte de Eddie siente a su hijo y tiembla de rabia." },
    { si: { eddie: "ravencroft" }, t: "Logan y Jessica llegan primero, con Miles. Eddie Brock sigue encerrado entre los escombros de Ravencroft, y nadie sabe si está vivo." },
    { si: { magneto: "aliado" }, t: "Magneto vigila el cielo desde Asteroid M: si algo rojo intenta salir de la ciudad, lo verá." }
  ],
  evento: { titulo: "Zarcillos en el acero", texto: "Rhino arrastra con él a media prisión.", efectos: ["Coloca 1 Matón extra en Brooklyn Bridge."] },
  pistas: { titulo: "Los engendros", texto: "Carnage dejó dos nidos de engendros: en el laboratorio de Osborn y en los sótanos de Queens. Si los queman, su familia crece más despacio.", lugares: ["osborn-labs", "queens"] , premio: "Sin nidos, la familia de Carnage crece más despacio: el villano del próximo capítulo empieza Frenado (ficha verde sobre su mazo)." },
  victoria: {
    titulo: "El puente resiste",
    texto: [
      "Arrancan el simbionte de la armadura de Rhino y Aleksei cae de rodillas, temblando. «Está buscando una familia», jadea. «Ya tiene a otros. Va por más.»",
      "Esa noche, alguien toca la puerta de la celda de Norman Osborn en la cárcel de S.H.I.E.L.D. Es un guardia con los ojos rojos."
    ],
    resumen: "Liberaron a Rhino del simbionte de Carnage, pero Carnage fue a buscar a Osborn a su celda.",
    siguiente: "III3AA"
  },
  derrota: {
    titulo: "Un puente partido",
    texto: [
      "Rhino arranca dos cables del puente antes de caer. Media ciudad queda incomunicada y Carnage aprovecha cada minuto.",
      "Sus engendros toman las calles. Uno se mete en la base de S.H.I.E.L.D., pero no va por Osborn: busca al preso más fuerte que puede encontrar."
    ],
    resumen: "Rhino partió el puente y un engendro de Carnage entró a la cárcel de S.H.I.E.L.D.",
    efectos: [{ panico: 1 }, { carnage: 1 }],
    siguiente: "III3AB"
  }
},

"III2B": {
  acto: 3, paso: 2, titulo: "El simbionte robado", villano: "venom",
  inspiracion: "Venom: Lethal Protector (1993) convirtió a Eddie Brock en antihéroe. La debilidad del simbionte al sonido viene de sus primeras historias.",
  anillo: ["oscorp-tower", "daily-bugle", "midtown-high", "queens", "brooklyn-bridge", "osborn-labs"],
  notas: {
    "oscorp-tower": "Venom, con un collar sónico, cuida la torre de Osborn.",
    "queens": "Los héroes salen desde la casa de la tía May.",
    "daily-bugle": "Una antena del Bugle repite la señal del collar.",
    "osborn-labs": "El transmisor principal del collar.",
    "midtown-high": "Los alumnos oyen un pitido que nadie más oye.",
    "brooklyn-bridge": "Patrullas de Oscorp vigilan el puente."
  },
  heroes: ["miles-morales", "ghost-spider", "spider-man-2099"],
  prologo: [
    { si: { eddie: "confianza" }, t: "Osborn le tendió una trampa a Eddie Brock: lo citó en Oscorp Tower haciéndose pasar por Jameson, con una oferta de trabajo. Eddie fue." },
    { si: { eddie: "ravencroft" }, t: "Osborn entró a Ravencroft con un uniforme de guardia y salió con Eddie Brock en una camilla." },
    "Ahora Eddie lleva un collar sónico en el cuello. Cada vez que el simbionte duda, el collar chilla, y el simbionte obedece. Venom se pasea por Oscorp Tower como un perro de guardia, y Osborn tiene al fin lo que buscaba: un simbionte adulto que sabe obedecer.",
    "Miles, Gwen y Miguel no vienen a pelear contra Eddie: vienen a quitarle el collar."
  ],
  evento: { titulo: "Perro de guardia", texto: "Osborn reforzó la torre con su propia seguridad.", efectos: ["Coloca 1 Matón extra en Oscorp Tower."] },
  pistas: { titulo: "Romper el control", texto: "El collar recibe órdenes desde la antena del Bugle y desde el transmisor de Osborn Labs. Si apagan los dos, Eddie vuelve en sí.", lugares: ["daily-bugle", "osborn-labs"] , premio: "Con las antenas apagadas, el simbionte de Eddie está furioso con Osborn: en el próximo capítulo, cada héroe empieza con 1 ficha de Ataque." },
  victoria: {
    titulo: "Eddie vuelve",
    texto: [
      "Miguel corta el collar con las garras y el simbionte suelta un grito que rompe todas las ventanas del piso. Eddie cae de rodillas, libre.",
      "En la oficina de Osborn encuentran una jaula vacía y una nota: «Ya no necesito el tuyo. Encontré uno mejor.» En las noticias, Ravencroft está en llamas: Cletus Kasady escapó, cubierto de rojo."
    ],
    resumen: "Liberaron a Eddie del collar de Osborn, pero Carnage escapó de Ravencroft.",
    siguiente: "III3BA"
  },
  derrota: {
    titulo: "Sin collar no hay perro",
    texto: [
      "Venom los saca de Oscorp a golpes. Desde la azotea, el Duende los saluda con la mano.",
      "Pero el experimento le sale mal: el simbionte de Eddie no soporta el collar y escupe una gota roja que se escurre por el desagüe hacia Ravencroft. Esa noche, Cletus Kasady escapa cubierto de rojo."
    ],
    resumen: "Osborn mantuvo a Venom bajo control y una gota del simbionte liberó a Carnage.",
    efectos: [{ panico: 1 }, { carnage: 1 }],
    siguiente: "III3BB"
  }
},

"III3AA": {
  acto: 3, paso: 3, titulo: "Duende Rojo", villano: "green-goblin", nivel: 1,
  inspiracion: "The Amazing Spider-Man #798-800 (2018): Norman Osborn se une al simbionte de Carnage y nace el Duende Rojo.",
  anillo: ["oscorp-tower", "osborn-labs", "brooklyn-bridge", "midtown-high", "queens", "daily-bugle"],
  notas: {
    "oscorp-tower": "El Duende Rojo vuelve a su torre y anuncia que la ciudad es suya.",
    "midtown-high": "Los héroes se reúnen en la azotea de la escuela.",
    "daily-bugle": "Hank instaló un amplificador sónico en la antena del Bugle.",
    "brooklyn-bridge": "Otro amplificador, en los cables del puente.",
    "osborn-labs": "Los tanques donde Osborn guardaba la fórmula.",
    "queens": "La tía May no quiere irse de su casa."
  },
  heroes: ["spider-man", "mystique-hero", "jean-grey"],
  prologo: [
    "El guardia de ojos rojos abrió la celda de Norman Osborn. Esta vez el simbionte no tuvo que pelear para entrar: Osborn le abrió la puerta.",
    "Ya no es verde. Es rojo, tiene garras, una cola y una sonrisa demasiado grande. El Duende Rojo vuela de vuelta a Oscorp Tower para recuperar su torre y anuncia por todas las pantallas que Nueva York tiene un nuevo dueño.",
    "Mystique llega a la azotea de Midtown donde se reúnen los héroes. «Este es mío», dice. Jean le pone una mano en el hombro: «Es de todos.»"
  ],
  evento: { titulo: "Fórmula roja", texto: "Osborn tiene la fuerza del Duende y la del simbionte de Carnage.", efectos: ["Coloca 1 Matón extra en Oscorp Tower."] },
  pistas: { titulo: "Separar al simbionte", texto: "Hank preparó dos amplificadores sónicos. Si los encienden, el simbionte rojo se suelta de Osborn al primer golpe fuerte.", lugares: ["daily-bugle", "brooklyn-bridge"] , premio: "Los amplificadores de Hank siguen encendidos: en el final, el medidor de engendros de Carnage empieza 1 casilla más abajo.", premioEfectos: [{ carnage: -1 }] },
  victoria: {
    titulo: "El Duende cae",
    texto: [
      "El simbionte rojo se desprende de Osborn como una piel vieja y Norman queda tendido en la azotea, humano y vencido. Esta vez no hay plan de respaldo.",
      "La masa roja huye hacia donde la llama su dueño original: Carnage. Esta noche se juntan todas sus partes."
    ],
    resumen: "Vencieron al Duende Rojo y Osborn quedó humano y preso; el simbionte volvió con Carnage.",
    efectos: [{ flag: "osborn", valor: "vencido" }],
    siguiente: "D4"
  },
  derrota: {
    titulo: "El simbionte lo suelta",
    texto: [
      "El Duende Rojo escapa por los techos, pero no llega lejos: el simbionte lo abandona en pleno vuelo y Osborn cae sobre un toldo de Queens, sin fuerzas. Huye cojeando.",
      "La masa roja vuelve con Carnage, más fuerte de lo que se fue."
    ],
    resumen: "El Duende Rojo escapó, el simbionte lo abandonó y volvió con Carnage más fuerte.",
    efectos: [{ panico: 1 }, { carnage: 1 }, { flag: "osborn", valor: "profugo" }],
    siguiente: "D4"
  }
},

"III3AB": {
  acto: 3, paso: 3, titulo: "Imparable y rojo", villano: "juggernaut", nivel: 1,
  inspiracion: "En Maximum Carnage (1993), Carnage reúne una «familia» de villanos para sembrar el caos en Nueva York.",
  anillo: ["queens", "midtown-high", "x-jet", "xavier-institute", "hangar-bay", "muir-island"],
  notas: {
    "queens": "Juggernaut sale de la ciudad hacia Westchester.",
    "xavier-institute": "Ororo y Logan defienden Cerebro desde la escuela.",
    "midtown-high": "Carnage sigue la marcha de Cain desde su nido en Midtown.",
    "x-jet": "Los alumnos más chicos esperan en el avión.",
    "hangar-bay": "Los alumnos mayores esperan en el hangar.",
    "muir-island": "Charles trata de llegar a la mente de Cain desde Muir Island."
  },
  heroes: ["storm", "wolverine", { si: { magneto: "aliado" }, h: "magneto-hero", no: "cyclops" }],
  prologo: [
    "El engendro de Carnage que entró a la base de S.H.I.E.L.D. no fue por Osborn. Buscó al ser más fuerte que pudo encontrar: Cain Marko, el Juggernaut.",
    "Ahora el casco de Cain tiene grietas rojas y su risa no es la suya. Carnage lo mandó a Westchester con una misión: traer Cerebro, la máquina que encuentra a cualquier persona del planeta. Carnage quiere saber dónde vive cada posible huésped para su familia.",
    { si: { magneto: "aliado" }, t: "Ororo y Logan esperan en la escuela. Erik flota sobre el techo: «El metal del casco de Cain me escucha», dice. «Lo que hay debajo, no.»" },
    { si: { magneto: "rechazado" }, t: "Ororo y Logan esperan en la escuela con Scott, que se ajusta el visor: ya detuvieron a Cain una vez." }
  ],
  evento: { titulo: "Imparable", texto: "Juggernaut no se desvía y arrastra todo lo que encuentra.", efectos: ["Coloca 1 Matón extra en Queens."] },
  pistas: { titulo: "Los alumnos", texto: "Hay alumnos esperando en el X-Jet y en el hangar. Si los sacan a tiempo, Carnage no tendrá a quién buscar en la escuela.", lugares: ["x-jet", "hangar-bay"] , premio: "Los alumnos están a salvo y Carnage tiene menos a quién buscar: en el final, el medidor de engendros empieza 1 casilla más abajo.", premioEfectos: [{ carnage: -1 }] },
  victoria: {
    titulo: "El gigante se libera",
    texto: [
      "Ororo le parte el casco con un rayo y el engendro rojo sale de Cain chillando. Cain cae de rodillas, libre, y por primera vez en años no dice nada contra su hermano.",
      "Cerebro está a salvo y ya marca dónde está Carnage: en Midtown High, con todos los alumnos adentro."
    ],
    resumen: "Liberaron a Juggernaut del simbionte y Cerebro encontró el nido de Carnage.",
    siguiente: "D4"
  },
  derrota: {
    titulo: "Cerebro en manos rojas",
    texto: [
      "Juggernaut se lleva el casco de Cerebro arrancado de la pared. Carnage ya sabe dónde vive cada posible huésped de Nueva York.",
      "Pero Cerebro funciona en los dos sentidos: mientras Carnage lo usa, Jean puede ver dónde está. En Midtown High, con todos los alumnos adentro."
    ],
    resumen: "Juggernaut le llevó Cerebro a Carnage, pero eso reveló dónde está su nido.",
    efectos: [{ panico: 1 }, { carnage: 1 }],
    siguiente: "D4"
  }
},

"III3BA": {
  acto: 3, paso: 3, titulo: "El dueño de las copias", villano: "green-goblin", nivel: 1,
  inspiracion: "The Amazing Spider-Man #798-800 (2018): Norman Osborn se une al simbionte de Carnage y nace el Duende Rojo.",
  anillo: ["osborn-labs", "oscorp-tower", "daily-bugle", "queens", "brooklyn-bridge", "midtown-high"],
  notas: {
    "osborn-labs": "El Duende Rojo se encerró en su laboratorio a fabricar copias.",
    "queens": "Los héroes salen desde la casa de la tía May, donde se recupera Eddie.",
    "oscorp-tower": "Un tanque con copias, listo para venderse.",
    "midtown-high": "Otro tanque, escondido en el gimnasio de la escuela.",
    "daily-bugle": "Jameson transmite en vivo desde la azotea.",
    "brooklyn-bridge": "Compradores de todo el mundo esperan en el puente."
  },
  heroes: ["spider-man", "black-cat", "mystique-hero"],
  prologo: [
    "«Encontré uno mejor», decía la nota de Osborn. Se refería a Carnage. Norman fue directo a buscarlo, y Kasady, que adora el caos, le regaló un pedazo de sí mismo.",
    "Ahora Osborn es el Duende Rojo: garras, cola, una sonrisa demasiado grande y la fuerza de dos simbiontes. Se encerró en Osborn Laboratories para terminar lo que empezó: copias del simbionte rojo para vendérselas a quien pague.",
    "Peter, Felicia y Mystique salen desde Queens. Eddie se queda en la casa de la tía May recuperándose: el collar le dejó marcas que no se van."
  ],
  evento: { titulo: "Fórmula roja", texto: "Osborn tiene la fuerza del Duende y la del simbionte de Carnage.", efectos: ["Coloca 1 Matón extra en Osborn Laboratories."] },
  pistas: { titulo: "Los tanques", texto: "Hay dos tanques con copias listas: en Oscorp Tower y en el gimnasio de Midtown. Si los destruyen, nadie más tendrá un simbionte.", lugares: ["oscorp-tower", "midtown-high"] , premio: "Sin copias, Carnage llega más débil: en el final, el medidor de engendros empieza 1 casilla más abajo.", premioEfectos: [{ carnage: -1 }] },
  victoria: {
    titulo: "Sin copias",
    texto: [
      "Felicia le roba al Duende Rojo el detonador de sus tanques justo antes de que lo apriete, y Peter lo arranca del aire de una sola telaraña. El simbionte se suelta de Osborn y Norman queda en el suelo del laboratorio, humano y esposado.",
      "La masa roja huye hacia Carnage. Las copias se derriten en sus tanques."
    ],
    resumen: "Vencieron al Duende Rojo en su laboratorio y Osborn quedó preso; el simbionte volvió con Carnage.",
    efectos: [{ flag: "osborn", valor: "vencido" }],
    siguiente: "D4"
  },
  derrota: {
    titulo: "Copias en la calle",
    texto: [
      "El Duende Rojo escapa y dos tanques con copias del simbionte se rompen en la calle. Cada copia busca un dueño.",
      "Osborn cae al río desde el puente cuando el simbionte lo abandona en pleno vuelo. Nadie encuentra el cuerpo. Las copias corren a reunirse con Carnage."
    ],
    resumen: "El Duende Rojo escapó, sus copias se unieron a Carnage y Osborn desapareció en el río.",
    efectos: [{ panico: 1 }, { carnage: 1 }, { flag: "osborn", valor: "profugo" }],
    siguiente: "D4"
  }
},

"III3BB": {
  acto: 3, paso: 3, titulo: "Ariete negro", villano: "rhino", nivel: 1,
  inspiracion: "Rhino debutó en The Amazing Spider-Man #41 (1966). En los cómics, el simbionte de Venom tuvo muchos huéspedes además de Eddie Brock.",
  anillo: ["oscorp-tower", "osborn-labs", "midtown-high", "brooklyn-bridge", "queens", "daily-bugle"],
  notas: {
    "oscorp-tower": "Rhino, cubierto de negro, sale de la torre de Osborn.",
    "brooklyn-bridge": "Los héroes lo esperan en el puente, su camino hacia Carnage.",
    "midtown-high": "El nido de Carnage: el destino de Osborn.",
    "osborn-labs": "Un transmisor del collar sónico.",
    "daily-bugle": "Otro transmisor, en la antena del Bugle.",
    "queens": "Eddie Brock espera en la casa de la tía May, sin su simbionte."
  },
  heroes: ["spider-woman", "beast", "spider-ham"],
  prologo: [
    "Osborn descubrió que el simbionte de Eddie obedece mejor cuando el cuerpo que lo lleva no piensa mucho. Así que lo pasó a otro huésped: Aleksei Sytsevich, Rhino.",
    "Rhino cubierto de negro, con dientes y un collar sónico en el cuello. Osborn lo usa como ariete para abrirse paso hasta Carnage: quiere ofrecerle una alianza.",
    "Eddie, sin su simbionte, le ruega a Jessica que lo recuperen. Hank preparó un sonido que puede soltar al simbionte sin matarlo. Spider-Ham ya eligió su martillo más grande."
  ],
  evento: { titulo: "Ariete negro", texto: "Rhino lleva la fuerza de dos.", efectos: ["Coloca 1 Matón extra en Oscorp Tower."] },
  pistas: { titulo: "Las antenas del collar", texto: "El collar recibe órdenes desde Osborn Labs y desde la antena del Bugle. Si las apagan, el simbionte deja de obedecer.", lugares: ["osborn-labs", "daily-bugle"] , premio: "El simbionte de Eddie vuelve a casa con ganas de pelear: en el final, cada héroe empieza con 1 ficha Comodín." },
  victoria: {
    titulo: "El simbionte vuelve a casa",
    texto: [
      "El sonido de Hank suelta al simbionte de Rhino, que cruza la calle volando y se enrosca en Eddie como un perro que vuelve a casa. Venom ruge: está libre, y está furioso.",
      "Osborn huye solo, sin ariete y sin aliados. Nadie lo vuelve a ver antes del final."
    ],
    resumen: "Devolvieron el simbionte a Eddie y Osborn huyó solo.",
    efectos: [{ flag: "osborn", valor: "profugo" }],
    siguiente: "D4"
  },
  derrota: {
    titulo: "La alianza roja",
    texto: [
      "Rhino abre camino hasta Midtown High, donde Carnage recibe a Osborn con una carcajada, le rompe el planeador y lo deja colgado de un poste como trofeo. S.H.I.E.L.D. lo baja a la mañana siguiente, vivo y humillado.",
      "Eddie recupera su simbionte cuando Rhino cae dormido, agotado. Carnage ganó un día entero para crecer."
    ],
    resumen: "Carnage humilló a Osborn y lo dejó colgado como trofeo; Eddie recuperó su simbionte.",
    efectos: [{ panico: 1 }, { carnage: 1 }, { flag: "osborn", valor: "vencido" }],
    siguiente: "D4"
  }
},

/* ======================= FINAL ======================= */
"F": {
  acto: 4, paso: 1, titulo: "Máxima Matanza", villano: "carnage", nivel: 1, final: true,
  inspiracion: "Maximum Carnage (1993), la saga de 14 partes donde Spider-Man y Venom pelean juntos contra Carnage y su familia.",
  anillo: ["midtown-high", "daily-bugle", "oscorp-tower", "queens", "brooklyn-bridge", "x-jet"],
  notas: {
    "midtown-high": "El nido de Carnage, con los alumnos adentro.",
    "queens": "Todos los héroes se reúnen en la casa de la tía May antes de saltar.",
    "daily-bugle": "Un grupo de alumnos escapó al Bugle, con engendros detrás.",
    "x-jet": "El avión de los X-Men aterrizó en la calle para evacuar.",
    "oscorp-tower": "La torre de Osborn, convertida en nido.",
    "brooklyn-bridge": "La única salida hacia el resto de la ciudad."
  },
  heroes: ["spider-man", { si: { sonico: "no" }, h: "venom-hero", no: "miles-morales" }, "storm"],
  prologo: [
    "Todo empezó con una muestra en una bóveda de Oscorp. Termina en la escuela de Peter Parker.",
    "Carnage tomó Midtown High con los alumnos adentro. Cada persona que toca se convierte en un engendro, y cada engendro busca a otra persona. Si la marea roja sale de la escuela, no habrá forma de pararla.",
    { si: { sonico: "usar" }, t: "Los emisores sónicos de S.H.I.E.L.D. rodean la escuela. Eddie Brock se despidió de su simbionte en la azotea de la casa de la tía May. Nadie dijo nada. Miles se puso a su lado." },
    { si: { sonico: "no" }, t: "Eddie Brock se sube la capucha negra. «Es mi hijo», dice Venom. «Me toca a mí.»" },
    "Ororo vuela sobre la escuela llamando a la tormenta: el fuego y el ruido son lo único que asusta a un simbionte. Peter mira hacia Queens una última vez. Después salta."
  ],
  evento: { titulo: "La familia de Carnage", texto: "Kasady quiere que cada alumno sea parte de su familia.", efectos: [
    { si: { sonico: "usar" }, t: "Los emisores de S.H.I.E.L.D. debilitan a los engendros: el medidor empieza en 0 y cada héroe empieza con 1 ficha de Ataque." },
    { si: { sonico: "no" }, t: "El medidor de engendros empieza en la casilla que indica la campaña." }
  ] },
  pistas: { titulo: "Los alumnos atrapados", texto: "Dos grupos de alumnos escaparon de la escuela pero quedaron rodeados: en el Bugle y junto al X-Jet. Si los rescatan, ningún alumno se queda atrás.", lugares: ["daily-bugle", "x-jet"] , premio: "Ningún alumno se queda atrás: cambia el epílogo final." },
  victoria: {
    titulo: "Nueva York amanece",
    texto: [
      "Carnage se deshace en un chillido que rompe todos los vidrios de Midtown, y Cletus Kasady queda en el piso del gimnasio, pequeño, humano y encerrado en un frasco de S.H.I.E.L.D.",
      "Los alumnos salen de la escuela abrazados. Arriba, en el techo, los héroes miran salir el sol sobre Queens."
    ],
    resumen: "Carnage fue derrotado."
  },
  derrota: {
    titulo: "Todavía no",
    texto: [
      "La marea roja llega a la puerta de la escuela, pero no la cruza. Ororo levanta un muro de viento, Peter se pone de pie con el traje hecho jirones y grita algo que nadie oye por el ruido.",
      "Todavía hay alumnos adentro. Todavía hay tiempo. Vuelvan a intentarlo: esta vez, la ciudad entera está mirando."
    ],
    resumen: "Carnage casi gana, pero los héroes se levantaron otra vez."
  }
}
};

/* Decisiones: todas aparecen sin importar si ganaron o perdieron. */
const DECISIONES = {
  "D1": {
    titulo: "¿Qué hacen con Eddie Brock?",
    texto: "Eddie Brock y el simbionte son ahora un problema de todos. S.H.I.E.L.D. quiere encerrarlo en Ravencroft, la prisión para criminales con poderes. Jessica Drew cree que Eddie puede aprender a controlar al simbionte si lo dejan ayudar.",
    notas: {
      "I3AB:perdio": "Osborn tiene ahora al simbionte, pero Jessica asaltó su laboratorio esa misma noche y se lo devolvió a Eddie. El simbionte volvió furioso y asustado.",
      "I3BA:perdio": "Venom anduvo suelto toda la noche. Lo encontraron al amanecer bajo el Puente de Brooklyn, agotado, con Eddie medio despierto adentro.",
      "I3BB:gano": "Venom huyó por la ventana, pero no llegó lejos: lo encontraron dos calles más allá, con Eddie medio despierto adentro.",
      "I3BB:perdio": "Venom pasó la noche aterrorizando Manhattan. Al amanecer, Eddie logró que el simbionte se calmara y se entregó a Jessica."
    },
    opciones: [
      { id: "ravencroft", nombre: "Entregarlo a Ravencroft", texto: "Eddie va a una celda reforzada y la ciudad respira (Pánico −1). Pero en Ravencroft hay un preso llamado Cletus Kasady, y el simbionte deja huellas por donde pasa: Carnage llegará más fuerte al final.",
        efectos: [{ panico: -1 }, { flag: "eddie", valor: "ravencroft" }, { carnage: 1 }] },
      { id: "confianza", nombre: "Confiar en Eddie", texto: "Eddie se queda con ustedes bajo palabra: Venom pelea a su lado cuando haga falta. Pero la ciudad vio a un monstruo caminar libre (Pánico +1).",
        efectos: [{ panico: 1 }, { flag: "eddie", valor: "confianza" }] }
    ],
    siguiente: "II1"
  },
  "D2": {
    titulo: "El teléfono de Mystique",
    texto: "El teléfono prueba que Norman Osborn pagó el atentado contra Kelly. J. Jonah Jameson pagaría lo que fuera por publicarlo. Jessica Drew prefiere usarlo en secreto para seguir cada paso de Osborn.",
    opciones: [
      { id: "publica", nombre: "Dárselo a Jameson", texto: "Osborn queda expuesto ante todo el país y pierde contratos y amigos (Pánico −1). Pero un hombre acorralado es más peligroso: cuando vuelva, llegará desesperado.",
        efectos: [{ panico: -1 }, { flag: "evidencia", valor: "publica" }] },
      { id: "secreta", nombre: "Guardarlo para tenderle una trampa", texto: "Osborn no sabe que lo vigilan: cuando ataque, llegarán antes que él. Mientras tanto, la ciudad sigue creyendo que el atentado fue cosa de mutantes (Pánico +1).",
        efectos: [{ panico: 1 }, { flag: "evidencia", valor: "secreta" }] }
    ]
  },
  "D3": {
    titulo: "¿Aceptan la ayuda de Magneto?",
    texto: "Erik es el ser más poderoso que pueden tener de su lado. También es el hombre que, hasta hace muy poco, peleaba contra ustedes. Lo que decidan cambia dónde empieza el último acto.",
    opciones: [
      { id: "aliado", nombre: "Aceptar a Magneto", texto: "Magneto se une como héroe y el Acto III empieza en Genosha. Si Kelly quedó herido, la ciudad lo verá como una alianza con el enemigo (Pánico +1).",
        efectos: [{ flag: "magneto", valor: "aliado" }, { panicoSi: { flag: "kelly", valor: "herido", n: 1 } }], siguiente: "III1M" },
      { id: "rechazado", nombre: "Rechazarlo", texto: "Erik se va sin pelear y el Acto III empieza en Nueva York. Charles agradece que confíen en su sueño: cada héroe empieza el próximo capítulo con 1 ficha Heroica.",
        efectos: [{ flag: "magneto", valor: "rechazado" }], pendientes: ["La confianza de Xavier: cada Héroe empieza con 1 ficha Heroica."], siguiente: "III1X" }
    ]
  },
  "D4": {
    titulo: "El arma sónica",
    texto: "S.H.I.E.L.D. terminó un arma sónica capaz de destruir a todos los simbiontes de Nueva York al mismo tiempo. Si la usan, Carnage llegará mucho más débil a la pelea final. Pero el simbionte de Eddie Brock también morirá.",
    opciones: [
      { id: "usar", nombre: "Usar el arma", texto: "El final será más fácil: el medidor de Carnage empieza en 0 y cada héroe empieza con 1 ficha de Ataque. Venom no pelea en el final, y el compañero de Eddie muere.",
        efectos: [{ flag: "sonico", valor: "usar" }] },
      { id: "no", nombre: "No usarla", texto: "Venom pelea a su lado en el final. Carnage llega con toda la fuerza que juntó durante la campaña.",
        efectos: [{ flag: "sonico", valor: "no" }] }
    ],
    siguiente: "F"
  }
};

/* Epílogo final: depende de todo lo que pasó */
function epilogoFinal(estado) {
  const f = estado.flags || {};
  const derrotas = estado.historia.filter(h => !h.gano && h.nodo !== "F").length;
  const intentos = estado.historia.filter(h => h.nodo === "F").length;
  const l = [];
  let titulo;
  if (derrotas <= 2) titulo = "Amanecer dorado";
  else if (derrotas <= 5) titulo = "Cicatrices";
  else titulo = "La ciudad sigue de pie";

  if (f.osborn === "vencido" || f.osborn === "preso") l.push("Norman Osborn mira el amanecer desde una celda de máxima seguridad. Ya no tiene fórmula, ni simbionte, ni torre. Por primera vez en años, duerme toda la noche.");
  else l.push("En algún lugar de la ciudad, un Norman Osborn sin poderes ve las noticias y aprieta los dientes. Volverá a intentarlo: siempre vuelve.");

  if (f.kelly === "salvado") l.push("El Senador Kelly retira su proyecto de registro. En su discurso de despedida nombra a Scott Summers y a Jean Grey.");
  else if (f.kelly === "herido") l.push("La ley de Kelly sigue en pie. La próxima pelea de los X-Men no será con los puños: será en los tribunales, y Matt Murdock ya se ofreció a llevar el caso.");

  if (f.sonico === "usar") l.push("Eddie Brock entierra una caja vacía en el jardín de la tía May. Ella le pone flores sin preguntar qué hay adentro.");
  else if (f.eddie === "confianza") l.push("Eddie Brock vuelve al Bugle con la historia que nadie más puede contar. Esta vez la firma con su nombre, y Jameson la publica en primera plana.");
  else l.push("Eddie Brock salió de Ravencroft para pelear contra su hijo. S.H.I.E.L.D. todavía discute si dejarlo libre; Peter firma la carta de recomendación.");

  if (f.magneto === "aliado") l.push("Magneto vuelve a Genosha sin despedirse. Antes de irse, deja la lista de Cerebro en el escritorio de Charles, intacta.");
  else if (f.magneto === "rechazado") l.push("Charles le escribe una carta a Erik. Todavía no se anima a enviarla.");

  if (f.evidencia === "publica") l.push("J. Jonah Jameson gana un premio de periodismo por la historia de Osborn. En el discurso dice que Spider-Man sigue siendo una amenaza.");
  else if (f.evidencia === "secreta") l.push("Jessica Drew archiva el teléfono de Mystique en una caja de S.H.I.E.L.D. que nadie más puede abrir.");

  l.push("Mystique desaparece entre la multitud con la cara de una enfermera. Nadie la ve irse, pero en la mesa de la tía May queda una paloma de papel.");
  l.push("Esa noche, Hank abre una grieta por última vez. Gwen, Miguel y Peter Porker se despiden en el jardín de Queens. «Si alguna vez nos necesitan», dice Gwen, «ya saben dónde no buscarnos.»");

  const p = estado.panico;
  l.push(p <= 1 ? "Nueva York vuelve a la normalidad en una semana. La tía May prepara lasaña para todos, y esta vez nadie sale corriendo por la ventana."
    : p <= 3 ? "La ciudad tardará meses en reconstruirse, pero lo hará. Los vecinos de Queens organizan una colecta para arreglar Midtown High."
    : "Nueva York queda herida y desconfiada. Los héroes tendrán que ganarse de nuevo a cada vecino. Empiezan mañana.");
  if (intentos > 1) l.push(`Les costó ${intentos} intentos detener a Carnage. Ninguno de ellos se rindió.`);
  return { titulo, lineas: l };
}
