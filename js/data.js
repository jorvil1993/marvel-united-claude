/* Telaraña Mutante — datos de campaña (versión Claude)
   Solo usa material que Jorge tiene: caja física X-Men + caja impresa Enter the Spider-Verse.
   Todo efecto respeta el reglamento oficial: nada daña al villano antes de completar 2 misiones. */

const LUGARES = {
  "queens":           { nombre: "Queens", caja: "Spider-Verse", efecto: "Si tienes 1 o 2 cartas en tu mano, puedes robar una carta." },
  "oscorp-tower":     { nombre: "Oscorp Tower", caja: "Spider-Verse", efecto: "Puedes obtener una ficha de Movimiento." },
  "brooklyn-bridge":  { nombre: "Brooklyn Bridge", caja: "Spider-Verse", efecto: "Puedes añadir un Civil a cualquier Lugar. Entonces, rescata a un Civil de este Lugar." },
  "midtown-high":     { nombre: "Midtown High School", caja: "Spider-Verse", efecto: "Puedes obtener una ficha Heroica." },
  "daily-bugle":      { nombre: "Daily Bugle", caja: "Spider-Verse", efecto: "Descubre la carta superior del mazo de Plan Maestro. Puedes colocarla en la parte inferior del mazo." },
  "osborn-labs":      { nombre: "Osborn Laboratories", caja: "Spider-Verse", efecto: "Puedes obtener una ficha de Ataque." },
  "hangar-bay":       { nombre: "Hangar Bay", caja: "X-Men", efecto: "Puedes coger una ficha de Movimiento, Heroica o de Ataque." },
  "weapon-x":         { nombre: "Weapon X Facility", caja: "X-Men", efecto: "Puedes descartar una carta de tu mano al final de tu mazo para obtener 2 fichas de Ataque." },
  "xavier-institute": { nombre: "Xavier Institute", caja: "X-Men", efecto: "Puedes robar cartas hasta que tengas 3 en tu mano." },
  "muir-island":      { nombre: "Muir Island", caja: "X-Men", efecto: "Otro Héroe en este Lugar o en uno adyacente puede robar 1 carta." },
  "x-jet":            { nombre: "X-Jet", caja: "X-Men", efecto: "Puedes moverte a cualquier otro Lugar." },
  "genosha":          { nombre: "Genosha", caja: "X-Men", efecto: "Puedes rescatar a un Civil de este Lugar." },
  "asteroid-m":       { nombre: "Asteroid M", caja: "X-Men", efecto: "Puedes infligir un punto de daño a un Matón o a un Secuaz en cualquier Lugar." },
  "sentinel-station": { nombre: "Sentinel Space Station", caja: "X-Men", efecto: "Puedes descartar una carta de tu mano al final de tu mazo para intercambiar una carta de tu mano con una de tus cartas boca arriba en la Trama." }
};

/* Iconos contados en las 12 cartas reales de cada mazo: m mover, a atacar, h heroica, c comodín */
const HEROES = {
  "spider-man":      { nombre: "Spider-Man", alias: "Peter Parker", caja: "Spider-Verse", icons: { m: 7, a: 4, h: 4, c: 3 },
    rol: "Motor de misiones",
    especiales: ["Balanceo: recibe 2 fichas de Movimiento.", "Gran poder: 3 ataques contra Matones; por cada uno derrotado, 1 ficha Heroica.", "Gran responsabilidad: rescata hasta 3 Civiles; por cada uno, 1 ficha de Ataque."],
    fuerte: "Vacía lugares de Civiles y Matones de un solo golpe y convierte eso en fichas para después.",
    debil: "Poco daño directo al villano.", contra: "Carnage, Magneto, Green Goblin" },
  "miles-morales":   { nombre: "Miles Morales", alias: "Spider-Man de Brooklyn", caja: "Spider-Verse", icons: { m: 2, a: 6, h: 5, c: 4 },
    rol: "Defensa y golpe preciso",
    especiales: ["Invisibilidad: no puede sufrir daño hasta su siguiente turno.", "Ataque venenoso: 2 ataques contra un solo objetivo.", "Telaraña: si está con el villano, retrasa su siguiente turno una carta."],
    fuerte: "Aguanta castigo y frena al villano cuando se le pone al lado.",
    debil: "Solo 2 movimientos en todo el mazo: necesita que lo lleven.", contra: "Venom, Rhino, Sabretooth" },
  "ghost-spider":    { nombre: "Ghost-Spider", alias: "Gwen Stacy", caja: "Spider-Verse", icons: { m: 5, a: 3, h: 6, c: 3 },
    rol: "Control de amenazas",
    especiales: ["Bailarina: no puede sufrir daño hasta su siguiente turno.", "Tejedora de telarañas: intercambia dos cartas de Amenaza en juego.", "Lucha acrobática: derrota a todos los Matones de su Lugar."],
    fuerte: "Mueve Amenazas peligrosas a donde no molestan y limpia Matones en masa.",
    debil: "Casi no daña al villano.", contra: "Green Goblin, Magneto, Mystique" },
  "spider-ham":      { nombre: "Spider-Ham", alias: "Peter Porker", caja: "Spider-Verse", icons: { m: 4, a: 7, h: 2, c: 3 },
    rol: "Golpeador que frena",
    especiales: ["Dibu-esencia: no pueden forzarlo a descartar su última carta.", "Dibu-telaraña: si acaba con el villano, anula su siguiente movimiento.", "Dibu-arma: un ataque en cualquier Lugar."],
    fuerte: "Le anula el movimiento al villano: desactiva a quienes castigan moviéndose.",
    debil: "Solo 2 acciones heroicas: malo para Civiles y Amenazas.", contra: "Juggernaut, Rhino" },
  "spider-man-2099": { nombre: "Spider-Man 2099", alias: "Miguel O'Hara", caja: "Spider-Verse", icons: { m: 6, a: 5, h: 4, c: 3 },
    rol: "Todoterreno",
    especiales: ["Garras: 2 ataques a un enemigo; el daño no se puede reducir.", "Sentidos aumentados: no puede sufrir daño hasta su siguiente turno.", "Asistencia de Lyla: una acción Heroica en cualquier Lugar."],
    fuerte: "Equilibrado y con acción Heroica a distancia.",
    debil: "No destaca en nada.", contra: "Green Goblin, Venom" },
  "spider-woman":    { nombre: "Spider-Woman", alias: "Jessica Drew", caja: "Spider-Verse", icons: { m: 6, a: 7, h: 3, c: 3 },
    rol: "Ritmo y daño",
    especiales: ["Súper resistencia: no puede sufrir daño hasta su siguiente turno.", "Picotazo venenoso (x2): 2 ataques, o retrasa el siguiente turno del villano una carta."],
    fuerte: "Puede frenar al villano dos veces por partida y pega fuerte.",
    debil: "Pocas acciones Heroicas.", contra: "Juggernaut, Venom, Rhino" },
  "black-cat":       { nombre: "Black Cat", alias: "Felicia Hardy", caja: "Spider-Verse", icons: { m: 4, a: 5, h: 3, c: 3 },
    rol: "Manipula el Plan Maestro",
    especiales: ["Instintos felinos (x2): recibe 2 fichas a tu elección.", "Garras felinas y Suerte felina (x4): cuando se juegue la siguiente carta de Plan Maestro, puedes mandarla al fondo y robar otra."],
    fuerte: "Cuatro veces por partida esquiva la peor carta del villano.",
    debil: "Pocos iconos en sus cartas.", contra: "Rhino, Mystique, Carnage" },
  "venom-hero":      { nombre: "Venom", alias: "Eddie Brock", caja: "Spider-Verse", icons: { m: 5, a: 8, h: 2, c: 3 },
    rol: "Bestia protectora",
    especiales: ["Mejora simbionte: fichas de Movimiento y Ataque.", "Regeneración: roba hasta tener 3 cartas.", "Seguimiento: muévete a cualquier Lugar y ataca allí."],
    fuerte: "Mucho daño y se recupera solo.",
    debil: "Solo 2 acciones Heroicas.", contra: "Carnage, Rhino" },
  "wolverine":       { nombre: "Wolverine", alias: "Logan", caja: "X-Men", icons: { m: 4, a: 5, h: 4, c: 4 },
    rol: "El que más daño hace",
    especiales: ["Garras de adamantium (x3): 2 ataques cada una.", "Factor de curación: mientras está en la Trama, si tienes menos de 3 cartas al final del turno del villano, robas 1."],
    fuerte: "Hasta 11 ataques por mazo y aguanta mucho.",
    debil: "Poco control del tablero.", contra: "Sabretooth, Juggernaut, Rhino" },
  "cyclops":         { nombre: "Cyclops", alias: "Scott Summers", caja: "X-Men", icons: { m: 3, a: 7, h: 6, c: 3 },
    rol: "Líder",
    especiales: ["Rayos ópticos: ataca en los dos Lugares adyacentes.", "Liderazgo: entrega una ficha Comodín a otro Héroe."],
    fuerte: "Limpia lugares vecinos y le da recursos a su pareja.",
    debil: "Se mueve poco.", contra: "Mystique, Magneto" },
  "storm":           { nombre: "Storm", alias: "Ororo Munroe", caja: "X-Men", icons: { m: 7, a: 4, h: 3, c: 3 },
    rol: "Movilidad total",
    especiales: ["Atmoquinesis (x2): 2 ataques en cualquier Lugar.", "Diosa del clima (x2): recoloca a todos los Héroes que quieras."],
    fuerte: "Pone a todo el equipo donde hace falta y pega a distancia.",
    debil: "Pocas acciones Heroicas.", contra: "Juggernaut, Carnage" },
  "jean-grey":       { nombre: "Jean Grey", alias: "Marvel Girl", caja: "X-Men", icons: { m: 5, a: 3, h: 5, c: 5 },
    rol: "El mejor apoyo",
    especiales: ["Gran telequinesis (x2): reparte una acción Heroica y un ataque entre tu Lugar y los adyacentes.", "Telepatía (x2): intercambia la carta anterior de la Trama por cualquier otra carta de Héroe de la Trama."],
    fuerte: "Telepatía deja reutilizar la mejor carta jugada: multiplica a su pareja.",
    debil: "Poco daño propio.", contra: "Magneto, Sabretooth, Green Goblin" },
  "beast":           { nombre: "Beast", alias: "Hank McCoy", caja: "X-Men", icons: { m: 6, a: 4, h: 7, c: 3 },
    rol: "Motor de acciones Heroicas",
    especiales: ["Inteligencia genial (x2): ese turno trata las acciones Heroicas como Comodín.", "Factor de regeneración (x2): roba hasta tener 3 cartas."],
    fuerte: "La mayor cantidad de acciones Heroicas del juego y nunca se queda sin cartas.",
    debil: "Daño medio-bajo.", contra: "Magneto, Green Goblin, Carnage" },
  "magneto-hero":    { nombre: "Magneto", alias: "Erik Lehnsherr", caja: "X-Men", antiheroe: true, icons: { m: 3, a: 6, h: 1, c: 4 },
    rol: "Artillería",
    especiales: ["Magnetoquinesis (x2): 3 ataques repartidos entre tu Lugar y los adyacentes.", "Inteligencia privilegiada y prodigiosa: convierte iconos en Comodín."],
    fuerte: "El mayor daño en área del juego.",
    debil: "1 acción Heroica y 2 cartas sin iconos que dejan a su pareja sin nada que compartir.", contra: "Rhino, Juggernaut" },
  "mystique-hero":   { nombre: "Mystique", alias: "Raven Darkhölme", caja: "X-Men", antiheroe: true, icons: { m: 5, a: 7, h: 2, c: 3 },
    rol: "Saboteadora",
    especiales: ["Metamorfa (x2): en el siguiente turno del villano, desvía el daño que te hagan a un Matón o Secuaz de tu Lugar.", "Maestra del espionaje (x2): la siguiente carta de Plan Maestro no puede añadir fichas a tu Lugar o a uno adyacente."],
    fuerte: "Evita Excesos y esquiva golpes.",
    debil: "Pocas acciones Heroicas.", contra: "Green Goblin, Carnage" }
};

/* Valores leídos de los tableros reales */
const VILLANOS = {
  "rhino": { nombre: "Rhino", alias: "Aleksei Sytsevich", vida: { 2: 5, 3: 8, 4: 11 }, dificultad: 2,
    especial: "Cuando un Héroe queda fuera de combate, Rhino no activa su BAM: ese Héroe coge 1 ficha de Crisis. Un Héroe con Crisis juega su próxima carta boca abajo y luego descarta sus Crisis.",
    bam: "1 daño a cada Héroe en su Lugar por cada Lugar en que entró este turno. Luego mueve a los Héroes dañados 1 Lugar en sentido horario.",
    exceso: "Roba otra carta de Plan Maestro y colócala boca abajo en la Trama.",
    complot: "No tiene.",
    prep: [],
    consejo: "No se queden juntos en su camino: cada Lugar que recorre suma daño. Spider-Ham anula su movimiento y Black Cat esquiva sus cargas." },
  "green-goblin": { nombre: "Green Goblin", alias: "Norman Osborn", vida: { 2: 5, 3: 7, 4: 10 }, dificultad: 3,
    especial: "Cuando se elimina una Amenaza, vuelve a su mazo y se añade una ficha de Amenaza a la Misión. No se le puede dañar si hay algún Civil en su Lugar; si estás con él, puedes usar 2 acciones Heroicas para rescatar a uno de esos Civiles.",
    bam: "1 daño a cada Héroe en su Lugar. Roba una Amenaza y colócala en el siguiente Lugar sin Amenaza (sentido horario).",
    exceso: "Roba una Amenaza y colócala en el siguiente Lugar sin Amenaza.",
    complot: "Pierden si todos los Lugares tienen una carta de Amenaza.",
    prep: ["Preparación especial (reverso del tablero): no coloques cartas de Amenaza ni fichas en los Lugares. Deja las Amenazas en un mazo boca abajo y las fichas aparte."],
    consejo: "La carrera es contra las Amenazas: elimínenlas en cuanto aparezcan. Ghost-Spider puede intercambiarlas y 2099 hace acciones Heroicas a distancia." },
  "venom": { nombre: "Venom", alias: "Eddie Brock", vida: { 2: 5, 3: 8, 4: 11 }, dificultad: 3,
    especial: "Cuando un Héroe queda fuera de combate, Venom no activa su BAM: juega otra carta de Plan Maestro.",
    bam: "1 daño a cada Héroe en su Lugar (2 si tienen alguna Crisis). Después, cada Héroe recibe 1 ficha de Crisis.",
    exceso: "1 Héroe recibe 1 ficha de Crisis.",
    complot: "Un Héroe queda fuera de juego al acumular 8 Crisis con 2 Héroes (6 con 3). Pierden si todos quedan fuera de juego.",
    prep: [],
    consejo: "Las Crisis no se van: cuenten cada una. Los héroes invulnerables (Miles, Ghost-Spider, 2099, Spider-Woman) se comen sus BAM sin daño." },
  "carnage": { nombre: "Carnage", alias: "Cletus Kasady", vida: { 2: 5, 3: 8, 4: 11 }, dificultad: 4,
    especial: "Cuando un Héroe queda fuera de combate, el medidor de engendros sube 1.",
    bam: "1 daño a cada Héroe en su Lugar. Después coloca 1 ficha de Crisis sobre cada Civil de ese Lugar.",
    exceso: "Descarta todos los Civiles con Crisis del Lugar con más Civiles; el medidor sube 1 por cada uno.",
    complot: "Medidor de engendros: si llega a 10, pierden.",
    prep: ["Coloca el indicador del villano en la casilla 0 del medidor de engendros (o en la que indique la campaña)."],
    consejo: "Rescaten Civiles cerca de Carnage antes de que les ponga Crisis. Spider-Man rescata 3 de golpe; Beast y Jean sostienen el ritmo." },
  "sabretooth": { nombre: "Sabretooth", alias: "Victor Creed", vida: { 2: 5, 3: 7, 4: 10 }, dificultad: 3,
    especial: "Cuando el Héroe Cazado queda fuera de combate (antes del BAM), el siguiente Héroe en sentido horario recibe la ficha de Cazado. Si cae otro Héroe, roba otra carta de Plan Maestro boca abajo.",
    bam: "2 daños a un Héroe en su Lugar; si el Cazado está ahí, lo recibe él.",
    exceso: "1 daño al Héroe Cazado.",
    complot: "Pierden si el Héroe que empezó la partida vuelve a recibir la ficha de Cazado. Con 2 jugadores, a la segunda vez.",
    prep: ["Preparación especial: asigna la ficha de Cazado al Héroe que empieza la partida."],
    consejo: "Nadie puede caer dos veces. El Cazado debe jugar invulnerable o lejos; su pareja limpia el tablero." },
  "juggernaut": { nombre: "Juggernaut", alias: "Cain Marko", vida: { 2: 8, 3: 8, 4: 8 }, dificultad: 4,
    especial: "Cuando un Héroe queda fuera de combate, no activa su BAM: roba otra carta de Plan Maestro y la pone boca abajo en la Trama.",
    bam: "1 daño a cada Héroe en los Lugares de los que salió, a los que entró o por los que pasó este turno.",
    exceso: "1 daño a cada Héroe en su Lugar y roba otra carta de Plan Maestro boca abajo.",
    complot: "No tiene.",
    prep: [],
    consejo: "Con 2 jugadores tiene 8 de vida, más que nadie: guarden ataques para el final. Spider-Ham le anula el movimiento y con eso su BAM." },
  "mystique": { nombre: "Mystique", alias: "Raven Darkhölme", vida: { 2: 4, 3: 6, 4: 9 }, dificultad: 4,
    especial: "Senador Kelly: le afecta todo lo que afecta a los Héroes y lo pueden llevar consigo al moverse. Los Héroes en su Lugar pueden recibir el daño que iba para él. Cuando un Héroe queda fuera de combate, mueve a Kelly 1 Lugar antihorario y roba otra carta de Plan Maestro boca abajo.",
    bam: "2 daños a un Héroe en su Lugar.",
    exceso: "Mueve a Kelly 1 Lugar antihorario y roba otra carta de Plan Maestro boca abajo.",
    complot: "Pierden si el Senador Kelly recibe 1 punto de daño.",
    prep: ["Preparación especial: coloca la ficha del Senador Kelly en el Lugar donde empiezan los Héroes."],
    consejo: "Todo gira en torno a Kelly: llévenlo lejos de ella y ataquen solo cuando esté a salvo. Tiene poca vida (4 con 2 jugadores)." },
  "magneto": { nombre: "Magneto", alias: "Erik Lehnsherr", vida: { 2: 5, 3: 7, 4: 10 }, dificultad: 5,
    especial: "Al inicio de cada turno del villano, añade 1 Civil al Lugar opuesto al de Magneto.",
    bam: "Añade 1 Matón a su Lugar y 1 daño a cada Héroe allí. Cada Héroe en ese Lugar y en los adyacentes descarta 1 ficha de acción.",
    exceso: "Convierte en Matones a todos los Civiles de ese Lugar y de los adyacentes.",
    complot: "Pierden si en algún momento no hay Civiles en ningún Lugar.",
    prep: ["Preparación especial: sustituye la Misión «Rescatar Civiles» por «Usar Cerebro». Para avanzarla, un Héroe gasta una acción Heroica y una de Movimiento en el mismo turno; 3 pares la completan."],
    consejo: "El villano más exigente: hacen falta muchas acciones Heroicas para Cerebro y Amenazas, y no se pueden rescatar todos los Civiles. Beast y Jean son clave." }
};

const NIVELES = [
  { nombre: "Normal", regla: "Sin cartas quitadas." },
  { nombre: "Moderado", regla: "Cada jugador quita de su mazo la carta con 1 Comodín." },
  { nombre: "Difícil", regla: "Cada jugador quita de su mazo la carta con 2 Comodines." },
  { nombre: "Heroico", regla: "Cada jugador quita las cartas con 1 y con 2 Comodines." }
];

const RECOMPENSAS = [
  { id: "refuerzos", nombre: "Refuerzos", texto: "Cada Héroe empieza el próximo capítulo con 1 ficha Comodín." },
  { id: "inteligencia", nombre: "Inteligencia", texto: "Al preparar el próximo capítulo, miren las 3 primeras cartas del Plan Maestro y ordénenlas como quieran." },
  { id: "respiro", nombre: "Respiro", texto: "El villano del próximo capítulo empieza Frenado (ficha verde sobre su mazo)." }
];

/* Anillo de 6 Lugares en sentido horario. Posición 0 = villano, posición 3 = Héroes (el Lugar opuesto, como dice el reglamento). */
const CAPITULOS = [
  {
    id: 1, acto: 1, titulo: "Golpe en Oscorp", villano: "rhino",
    anillo: ["oscorp-tower", "osborn-labs", "brooklyn-bridge", "queens", "midtown-high", "daily-bugle"],
    nivel: 0, identidad: false,
    llegan: ["spider-man", "miles-morales"],
    fijo: "spider-man", fijo2: "miles-morales", recomendados: [],
    porQue: "Capítulo de aprendizaje: dos héroes equilibrados contra el villano más directo.",
    prologo: [
      "Hace tres semanas, un transbordador de la NASA volvió a la Tierra con algo pegado al casco: una masa negra que se movía sola. Oscorp ganó el contrato para estudiarla y se llevó un fragmento a sus bóvedas. Lo llaman la Muestra 7.",
      "Esta noche, en Queens, la tía May le sirve a Miles un segundo plato de lasaña cuando el teléfono de Peter vibra. Las alarmas de Oscorp Tower suenan en todo Manhattan.",
      "Rhino acaba de atravesar tres pisos de concreto. Alguien le pagó el triple por sacar un solo contenedor. Peter y Miles salen por la ventana del cuarto antes de que la tía May termine de preguntar adónde van."
    ],
    viñetas: {
      inicio: { titulo: "Visita nocturna", texto: "Entre los conductos de ventilación, una sombra con orejas de gato también busca el contenedor. Desaparece en cuanto la miran.", efecto: "" },
      presion: { titulo: "¡Arranca una columna!", texto: "Rhino se impacienta y empieza a derribar la estructura para escapar con el contenedor.", efecto: "Coloca 1 Matón en el Lugar de Rhino (si no cabe, aplica su Exceso)." },
      segunda: { titulo: "El camión del comprador", texto: "Miles ve un camión sin placas esperando en la esquina. Si Rhino llega hasta él, el contenedor desaparece.", efecto: "El Héroe que completó esta Misión gana 1 ficha de Movimiento." }
    },
    victoria: {
      titulo: "Contenedor asegurado",
      texto: [
        "Rhino queda incrustado en el piso del vestíbulo. Peter abre el contenedor recuperado: está medio vacío. Alguien de adentro ya se llevó la mitad de la Muestra 7 antes del robo.",
        "En la azotea, la sombra de antes se deja ver. Felicia Hardy, Black Cat, levanta una tarjeta de acceso con el nombre de Norman Osborn. «Yo también vine a robarlo, pero el dueño se me adelantó», dice. «Y me interesa saber para qué lo quiere.»"
      ],
      resumen: "Rhino fue detenido, pero la mitad de la Muestra 7 ya estaba en manos de Osborn.",
      efectos: [], pendientes: []
    },
    derrota: {
      titulo: "El ariete escapa",
      texto: [
        "Rhino atraviesa la pared este y sube al camión sin placas con el contenedor. Peter y Miles lo pierden entre el tráfico del puente.",
        "Black Cat aparece a su lado en la cornisa. «El camión es de una empresa fantasma de Osborn», dice. «Se robó su propia muestra para que nadie le pregunte qué hace con ella.»"
      ],
      resumen: "Rhino escapó y entregó la Muestra 7 completa a Osborn.",
      efectos: [{ panico: 1 }],
      pendientes: ["Osborn tiene la muestra completa: Green Goblin empieza Acelerado (ficha naranja al final de la Trama)."]
    }
  },
  {
    id: 2, acto: 1, titulo: "El colisionador", villano: "green-goblin",
    anillo: ["osborn-labs", "oscorp-tower", "daily-bugle", "midtown-high", "queens", "brooklyn-bridge"],
    nivel: 0, identidad: true,
    llegan: ["black-cat", "ghost-spider", "spider-ham", "spider-man-2099"],
    fijo: "ghost-spider", recomendados: ["spider-man-2099", "spider-man", "miles-morales"],
    porQue: "Green Goblin se gana llenando el tablero de Amenazas. Ghost-Spider las intercambia y 2099 hace acciones Heroicas a distancia.",
    prologo: [
      "Norman Osborn no quería un arma: quería una respuesta. En el sótano de Osborn Laboratories construyó un colisionador para asomarse a otros universos y encontrar uno donde él ya hubiera ganado. La Muestra 7 es su batería.",
      "A las 4:12 de la madrugada, el colisionador se enciende. El cielo sobre Manhattan se abre en grietas de colores y por ellas caen tres desconocidos: una chica con capucha blanca, un hombre con un traje del año 2099 y un cerdo con antifaz que pregunta dónde queda la salida.",
      "J. Jonah Jameson manda a todo el Daily Bugle a la calle. Entre los reporteros va Eddie Brock, que tiene una cuenta pendiente con Spider-Man. El Duende Verde sale a proteger su máquina."
    ],
    viñetas: {
      inicio: { titulo: "Prensa en todas partes", texto: "Jameson quiere fotos de los «invasores multiversales». Los periodistas están en el lugar del Duende y alrededor de donde empiezan ustedes.", efecto: "Desafío Identidad Secreta activo (ver Preparación)." },
      presion: { titulo: "Secuestro en la avenida", texto: "El Duende baja en picada y se lleva civiles como escudo.", efecto: "Si hay algún Civil en el Lugar del Duende, colócalo sobre su tablero (como su carta Secuestro)." },
      segunda: { titulo: "Grieta inestable", texto: "El colisionador tiembla: Gwen sabe que si sigue encendido, se traga la manzana entera.", efecto: "Cada Héroe roba 1 carta." }
    },
    victoria: {
      titulo: "Las grietas se cierran",
      texto: [
        "Gwen arranca el núcleo del colisionador y las grietas se cierran con un chasquido. El Duende huye en su planeador, herido pero vivo.",
        "Nadie ve que la Muestra 7 se escurre por un ducto de ventilación. Diez minutos después, en el estacionamiento del Bugle, Eddie Brock siente algo frío trepándole por el brazo. Una voz le habla desde adentro: «Nosotros sabemos lo que le hizo Spider-Man a tu carrera.»"
      ],
      resumen: "El colisionador se apagó, pero la Muestra 7 escapó y encontró a Eddie Brock.",
      efectos: [], pendientes: []
    },
    derrota: {
      titulo: "Manhattan se agrieta",
      texto: [
        "El Duende se lleva el núcleo del colisionador antes de huir. Las grietas tardan horas en cerrarse y la ciudad entera ve criaturas imposibles en los noticieros. Jameson titula: «¿HÉROES O INVASORES?».",
        "En el caos nadie nota que la Muestra 7 se escurre por un ducto. En el estacionamiento del Bugle, Eddie Brock siente algo frío trepándole por el brazo."
      ],
      resumen: "El Duende escapó con el núcleo y la Muestra 7 encontró a Eddie Brock.",
      efectos: [{ panico: 1 }],
      pendientes: ["Las grietas siguen abiertas: Venom empieza Acelerado (ficha naranja al final de la Trama)."]
    }
  },
  {
    id: 3, acto: 1, titulo: "Primera plana", villano: "venom",
    anillo: ["daily-bugle", "midtown-high", "osborn-labs", "brooklyn-bridge", "queens", "oscorp-tower"],
    nivel: 0, identidad: true,
    llegan: ["spider-woman"],
    fijo: "spider-woman", recomendados: ["miles-morales", "ghost-spider", "spider-man-2099"],
    porQue: "Las Crisis de Venom se acumulan. Spider-Woman y su pareja necesitan cartas de invulnerabilidad para comerse sus BAM.",
    prologo: [
      "Jessica Drew trabaja para S.H.I.E.L.D. y lleva una semana siguiendo el rastro de la Muestra 7. La encontró: está en la sala de redacción del Daily Bugle, y tiene dientes.",
      "Eddie Brock y el simbionte ya no son dos. Se llaman a sí mismos Venom, y quieren que la ciudad lea en primera plana lo que Spider-Man le hizo a Eddie. Para eso tomaron el edificio con todos adentro.",
      "Jessica llega por el puente. Cada persona que el simbionte toca queda marcada con algo negro que no se quita con agua."
    ],
    viñetas: {
      inicio: { titulo: "Edición extra", texto: "Venom obliga a los periodistas a transmitir en vivo. Cada foto de un héroe sale al aire al instante.", efecto: "Desafío Identidad Secreta activo (ver Preparación)." },
      presion: { titulo: "La marca negra", texto: "El simbionte se reparte por las tuberías del edificio.", efecto: "Coloca 1 Civil en el Lugar opuesto al de Venom (si cabe)." },
      segunda: { titulo: "El ruido lo duele", texto: "Jessica recuerda el informe de S.H.I.E.L.D.: el simbionte odia las frecuencias altas. La alarma de incendios del Bugle sirve.", efecto: "El Héroe que completó esta Misión descarta 1 de sus fichas de Crisis." }
    },
    victoria: {
      titulo: "Eddie despierta",
      texto: [
        "La alarma de incendios aúlla y el simbionte se encoge. Por primera vez, Eddie Brock habla con su propia voz: «No quiero lastimar a nadie. Solo quería que me escucharan.»",
        "En el suelo queda una gota roja que se mueve sola. Jessica la guarda en un frasco para S.H.I.E.L.D. Ahora hay que decidir qué hacer con Eddie."
      ],
      resumen: "Venom fue contenido y Eddie Brock recuperó el control.",
      efectos: [], pendientes: []
    },
    derrota: {
      titulo: "Venom en la calle",
      texto: [
        "Venom salta del techo del Bugle con la mitad de las cámaras del edificio encima. Su cara está en todas las pantallas de Times Square.",
        "Lo encuentran al amanecer bajo el puente, agotado, con Eddie medio despierto adentro. El simbionte dejó atrás una gota roja que se mueve sola. Jessica la guarda en un frasco para S.H.I.E.L.D. Ahora hay que decidir qué hacer con Eddie."
      ],
      resumen: "Venom aterrorizó la ciudad antes de ser encontrado.",
      efectos: [{ panico: 1 }], pendientes: []
    },
    decision: {
      titulo: "¿Qué hacen con Eddie Brock?",
      texto: "S.H.I.E.L.D. quiere encerrarlo en Ravencroft, la prisión para criminales con poderes. Eddie jura que puede controlar al simbionte si lo dejan ayudar.",
      opciones: [
        { id: "ravencroft", nombre: "Entregarlo a Ravencroft", texto: "La ciudad se tranquiliza (Pánico baja 1). Pero en Ravencroft hay un preso llamado Cletus Kasady y la gota roja no estará tan lejos como creen. Venom no los ayudará hasta muy tarde.",
          efectos: [{ panico: -1 }, { flag: "eddie", valor: "ravencroft" }, { carnage: 1 }] },
        { id: "palabra", nombre: "Dejarlo libre bajo palabra", texto: "Venom se une como héroe desde ya. Pero la ciudad vio a un monstruo salir caminando (Pánico sube 1).",
          efectos: [{ panico: 1 }, { flag: "eddie", valor: "aliado" }, { unlock: "venom-hero" }] }
      ]
    }
  },
  {
    id: 4, acto: 2, titulo: "La audiencia", villano: "mystique",
    anillo: ["daily-bugle", "oscorp-tower", "osborn-labs", "midtown-high", "queens", "brooklyn-bridge"],
    nivel: 0, identidad: false,
    llegan: ["cyclops", "jean-grey"],
    fijo: "cyclops", recomendados: ["black-cat", "ghost-spider", "jean-grey"],
    porQue: "Contra Mystique todo es proteger a Kelly. Cyclops limpia los lugares vecinos y Black Cat esquiva las peores cartas del villano.",
    prologo: [
      "Después de las grietas y de Venom, el Senador Robert Kelly vuela a Nueva York con una sola idea: los mutantes y los «fenómenos con máscara» son una amenaza y hay que registrarlos a todos. Esta tarde habla en el auditorio de Midtown High.",
      "El Profesor Xavier recibe una advertencia anónima: alguien va a matar a Kelly durante el discurso, para que la culpa caiga sobre los mutantes. Xavier está en Muir Island y no llega a tiempo. Manda a Scott Summers.",
      "Scott sabe lo que significa: proteger al hombre que quiere encerrarlos. Lo hará igual. En el público, una mujer de traje gris sonríe demasiado."
    ],
    viñetas: {
      inicio: { titulo: "Cualquier cara", texto: "Mystique puede ser cualquiera del auditorio. Kelly no deja de hablar.", efecto: "" },
      presion: { titulo: "Pánico en el auditorio", texto: "Alguien grita «¡mutante!» y la gente corre hacia las salidas.", efecto: "Coloca 1 Civil en el Lugar donde está Kelly (si cabe)." },
      segunda: { titulo: "Kelly duda", texto: "Kelly ve a Scott ponerse entre él y una bala. Por primera vez, no sabe qué decir.", efecto: "El Héroe que está con Kelly gana 1 ficha Heroica." }
    },
    victoria: {
      titulo: "Kelly sigue vivo",
      texto: [
        "Mystique escapa por una ventana con la forma de una paloma, pero Kelly está vivo. Frente a las cámaras, el senador dice algo que nadie esperaba: «Hoy un mutante me salvó la vida.»",
        "En el piso queda el teléfono de Mystique. El último mensaje es una transferencia de dinero firmada con una inicial: O."
      ],
      resumen: "Kelly sobrevivió y agradeció en público a un mutante. Mystique trabajaba para Osborn.",
      efectos: [{ panico: -1 }, { flag: "kelly", valor: "salvado" }], pendientes: []
    },
    derrota: {
      titulo: "Kelly herido",
      texto: [
        "Kelly sale en camilla. Sobrevivirá, pero desde el hospital firma la orden: registro obligatorio para todo mutante en Nueva York.",
        "En el piso queda el teléfono de Mystique. El último mensaje es una transferencia de dinero firmada con una inicial: O."
      ],
      resumen: "Kelly fue herido y ahora impulsa el registro de mutantes. Mystique trabajaba para Osborn.",
      efectos: [{ panico: 1 }, { flag: "kelly", valor: "herido" }],
      pendientes: ["La policía vigila a los mutantes: coloca 1 Matón extra en el Lugar donde empiezan los Héroes."]
    }
  },
  {
    id: 5, acto: 2, titulo: "Instalación Arma X", villano: "sabretooth",
    anillo: ["weapon-x", "osborn-labs", "hangar-bay", "x-jet", "muir-island", "xavier-institute"],
    nivel: 0, identidad: false,
    llegan: ["wolverine", "beast"],
    fijo: "wolverine", recomendados: ["jean-grey", "spider-woman", "beast"],
    primero: "wolverine",
    porQue: "Wolverine empieza la partida y recibe la ficha de Cazado: aguanta y roba cartas solo. Su pareja tiene que limpiar el tablero.",
    prologo: [
      "El teléfono de Mystique tenía más que una transferencia: tenía una dirección en Canadá. La vieja Instalación Arma X, donde convirtieron a Logan en un arma, lleva años abandonada. Alguien volvió a encender las luces.",
      "Logan baja del X-Jet y huele el aire. Sangre, tabaco y algo dulzón que conoce demasiado bien. «Creed», gruñe.",
      "Osborn compró los archivos de Arma X: quiere saber cómo se une algo vivo a un cuerpo sin matarlo. Y contrató a Sabretooth para que nadie se los quite."
    ],
    viñetas: {
      inicio: { titulo: "La presa", texto: "Creed ya sabe quién bajó del avión.", efecto: "Wolverine empieza la partida y recibe la ficha de Cazado." },
      presion: { titulo: "Los archivos arden", texto: "Sabretooth prende fuego a los archivos de papel para que no se los lleven.", efecto: "Coloca 1 Matón en el Lugar de Sabretooth (si cabe)." },
      segunda: { titulo: "El expediente Kasady", texto: "Entre las cenizas aparece una carpeta que Osborn pidió aparte: «Sujeto compatible: C. Kasady, Ravencroft».", efecto: "El Héroe que completó esta Misión gana 1 ficha de Ataque." }
    },
    victoria: {
      titulo: "Garra contra garra",
      texto: [
        "Logan deja a Creed colgado de una viga, inconsciente. Entre los archivos rescatados hay un plan completo: Osborn quiere un simbionte que obedezca, y para eso necesita encontrar mutantes compatibles. La única máquina capaz de encontrarlos es Cerebro.",
        "Hank McCoy lee los papeles en el avión de vuelta y se pone pálido. «Va a ir por la escuela.»"
      ],
      resumen: "Sabretooth cayó y descubrieron que Osborn quiere Cerebro.",
      efectos: [], pendientes: []
    },
    derrota: {
      titulo: "Creed se lleva los archivos",
      texto: [
        "Sabretooth desaparece en el bosque con la mitad de los archivos. Logan sangra en la nieve, ya cerrándose las heridas, furioso.",
        "Lo que quedó alcanza para entender el plan: Osborn necesita Cerebro para encontrar mutantes compatibles con su simbionte. Y ya sabe dónde está."
      ],
      resumen: "Sabretooth escapó con medio expediente. Osborn va por Cerebro.",
      efectos: [{ panico: 1 }],
      pendientes: ["Osborn tiene ventaja: Juggernaut empieza Acelerado (ficha naranja al final de la Trama)."]
    }
  },
  {
    id: 6, acto: 2, titulo: "Hermanastro", villano: "juggernaut",
    anillo: ["xavier-institute", "hangar-bay", "x-jet", "muir-island", "weapon-x", "midtown-high"],
    nivel: 0, identidad: false,
    llegan: ["storm"],
    fijo: "storm", recomendados: ["spider-ham", "wolverine", "cyclops"],
    porQue: "Juggernaut tiene 8 de vida y su BAM depende de cuánto se mueve. Spider-Ham le anula el movimiento; Storm reacomoda al equipo y ataca desde lejos.",
    prologo: [
      "Osborn no va a entrar él mismo a la escuela de Xavier. Para eso tiene a alguien que odia a Charles más que nadie: su hermanastro, Cain Marko.",
      "Charles sigue en Muir Island con Moira MacTaggert cuando Cerebro detecta la señal: algo enorme atraviesa el bosque de Westchester en línea recta. Árboles, muros, una camioneta. Nada lo frena.",
      "Ororo Munroe despega desde Muir Island con los que pueden volar. Tienen hasta que Juggernaut llegue al sótano."
    ],
    viñetas: {
      inicio: { titulo: "Línea recta", texto: "Juggernaut no esquiva nada. Cada pared que rompe es una pared menos entre él y Cerebro.", efecto: "" },
      presion: { titulo: "Los alumnos", texto: "Hay estudiantes atrapados en el ala este.", efecto: "Coloca 1 Civil en el Lugar de Juggernaut (si cabe)." },
      segunda: { titulo: "El casco", texto: "Ororo recuerda lo único que funciona: si le quitan el casco, Charles puede entrar en su mente.", efecto: "Cada Héroe gana 1 ficha de Movimiento." }
    },
    victoria: {
      titulo: "Cerebro a salvo",
      texto: [
        "El casco de Cain rueda por el jardín y Juggernaut cae dormido, por fin. Cerebro está intacto.",
        "Pero al encenderlo para revisar los daños, la máquina marca otra presencia acercándose desde la órbita. Metal que flota. Magneto también quiere Cerebro, y no viene a pedir permiso."
      ],
      resumen: "Juggernaut fue detenido antes del sótano. Magneto viene por Cerebro.",
      efectos: [], pendientes: []
    },
    derrota: {
      titulo: "El sótano abierto",
      texto: [
        "Juggernaut llega al sótano y arranca el disco de respaldo de Cerebro antes de que lo saquen a golpes. Osborn ya tiene una copia de la lista de mutantes.",
        "Cerebro sigue funcionando y marca otra presencia acercándose desde la órbita. Magneto también se enteró."
      ],
      resumen: "Juggernaut se llevó el respaldo de Cerebro. Magneto viene en camino.",
      efectos: [{ panico: 1 }],
      pendientes: ["Osborn tiene la lista de mutantes: Magneto empieza Acelerado (ficha naranja al final de la Trama)."]
    }
  },
  {
    id: 7, acto: 3, titulo: "Cerebro", villano: "magneto",
    anillo: ["asteroid-m", "sentinel-station", "hangar-bay", "xavier-institute", "muir-island", "genosha"],
    nivel: 1, identidad: false,
    llegan: [],
    fijo: "beast", recomendados: ["jean-grey", "ghost-spider", "spider-man"],
    porQue: "Magneto exige muchas acciones Heroicas: la Misión Usar Cerebro y sus Amenazas. Beast y Jean son las que más tienen.",
    prologo: [
      "Magneto no quiere destruir Cerebro. Quiere usarlo. Sabe lo que planea Osborn y quiere encontrar a los mutantes compatibles antes que él, para llevárselos a Genosha. «Protegidos», dice. «A mi manera.»",
      "Hank McCoy entiende lo que eso significa: cientos de personas sacadas de sus casas sin preguntarles. Se sienta frente a Cerebro antes de que llegue Erik.",
      "Desde Asteroid M llueve metal sobre Westchester."
    ],
    viñetas: {
      inicio: { titulo: "Usar Cerebro", texto: "Hank tiene que entrar a Cerebro tres veces para borrar la lista antes de que Erik la vea.", efecto: "La Misión «Rescatar Civiles» se sustituye por «Usar Cerebro»." },
      presion: { titulo: "Lluvia de metal", texto: "Magneto arranca los hangares de cuajo.", efecto: "Coloca 1 Matón en Hangar Bay (si cabe)." },
      segunda: { titulo: "Erik escucha", texto: "Por un momento Magneto deja de atacar: en la pantalla de Cerebro ve el nombre de Kasady junto al de cientos de mutantes.", efecto: "Cada Héroe roba 1 carta." }
    },
    victoria: {
      titulo: "La lista borrada",
      texto: [
        "La lista desaparece de Cerebro y Magneto cae de rodillas sobre el pasto, sin su casco. No pelea más. «Osborn no busca mutantes», dice. «Busca un cuerpo para algo que ya creó. Y ese algo está en Ravencroft.»",
        "Erik ofrece su ayuda. Hank mira a los demás."
      ],
      resumen: "La lista de Cerebro quedó a salvo. Magneto ofrece una alianza.",
      efectos: [], pendientes: []
    },
    derrota: {
      titulo: "Erik ve la lista",
      texto: [
        "Magneto alcanza a ver la lista antes de que Hank la borre. Pero lo que lee lo detiene: entre los nombres compatibles hay uno que no es mutante. Cletus Kasady, Ravencroft.",
        "«Osborn no busca mutantes», dice Erik. «Busca un cuerpo para algo que ya creó.» Y por primera vez, ofrece su ayuda."
      ],
      resumen: "Magneto vio la lista, pero descubrió a Kasady y ofrece una alianza.",
      efectos: [{ panico: 1 }], pendientes: []
    },
    decision: {
      titulo: "¿Aceptan la ayuda de Magneto?",
      texto: "Erik es el ser más poderoso que pueden tener de su lado. También es el hombre que hace una hora les tiraba un hangar encima.",
      opciones: [
        { id: "aceptar", nombre: "Aceptar a Magneto", texto: "Magneto se une como héroe. Pero si Kelly fue herido, la ciudad lo ve como un ataque mutante (Pánico sube 1).",
          efectos: [{ flag: "magneto", valor: "aliado" }, { unlock: "magneto-hero" }, { panicoSi: { flag: "kelly", valor: "herido", n: 1 } }] },
        { id: "rechazar", nombre: "Rechazarlo", texto: "Erik se va sin pelear. Charles agradece la confianza: cada Héroe empieza el próximo capítulo con 1 ficha Heroica.",
          efectos: [{ flag: "magneto", valor: "rechazado" }], pendientes: ["La confianza de Xavier: cada Héroe empieza con 1 ficha Heroica."] }
      ]
    }
  },
  {
    id: 8, acto: 3, titulo: "Duende Rojo", villano: "green-goblin",
    anillo: ["oscorp-tower", "daily-bugle", "brooklyn-bridge", "queens", "midtown-high", "osborn-labs"],
    nivel: 1, identidad: true,
    llegan: ["mystique-hero"],
    fijo: "mystique-hero", recomendados: ["spider-man", "black-cat", "ghost-spider"],
    porQue: "Las Amenazas del Duende vuelven a llenar el tablero. Mystique evita que el villano ponga fichas cerca y su pareja limpia Amenazas.",
    prologo: [
      "Mystique toca la ventana de Peter a las tres de la mañana. Viene sola. «Osborn me pagó para matar a Kelly y después le dio mi cara a la policía», dice. «Quiero estar ahí cuando caiga.»",
      "No falta mucho. Norman Osborn se inyectó lo que quedaba de la Muestra 7 mezclado con su fórmula. Ya no es verde: es rojo, tiene garras y una sonrisa demasiado grande. Desde la azotea de Oscorp Tower anuncia que Nueva York tiene un nuevo dueño.",
      "Jameson vuelve a mandar a todos los periodistas a la calle. Lo que la prensa ya sabía de cada héroe sigue sabiéndolo."
    ],
    viñetas: {
      inicio: { titulo: "Fórmula roja", texto: "Osborn es más fuerte que nunca y sabe quién es Peter Parker.", efecto: "Desafío Identidad Secreta activo. La Exposición acumulada de la campaña se mantiene." },
      presion: { titulo: "Bombas de calabaza", texto: "El Duende Rojo bombardea el puente para dividirlos.", efecto: "Coloca 1 Civil en Brooklyn Bridge (si cabe)." },
      segunda: { titulo: "El simbionte se rebela", texto: "La masa roja no quiere a Osborn. Mystique lo ve temblar.", efecto: "El Héroe que completó esta Misión gana 1 ficha Comodín." }
    },
    victoria: {
      titulo: "Osborn cae",
      texto: [
        "El simbionte rojo se desprende de Osborn como una piel vieja y Norman queda tendido en la azotea, humano y vencido. Lo esposan frente a todas las cámaras del Bugle. Mystique se queda mirando hasta que la patrulla dobla la esquina.",
        "La masa roja no se queda: se escurre por el desagüe en dirección a Ravencroft, donde la espera un hombre que lleva semanas soñando con ella."
      ],
      resumen: "Osborn fue arrestado, pero el simbionte rojo huyó hacia Ravencroft.",
      efectos: [{ flag: "osborn", valor: "arrestado" }], pendientes: []
    },
    derrota: {
      titulo: "El simbionte elige",
      texto: [
        "El Duende Rojo escapa por los techos, pero no llega lejos: el simbionte lo abandona en pleno vuelo y Osborn cae sobre un toldo de Queens, sin fuerzas, sin fórmula y sin nadie que lo busque. Huye cojeando y desaparece.",
        "La masa roja va directo a Ravencroft. Llega antes de lo que nadie esperaba."
      ],
      resumen: "Osborn quedó sin poderes y huyó. El simbionte llegó antes a Ravencroft.",
      efectos: [{ panico: 1 }, { carnage: 1 }, { flag: "osborn", valor: "huyo" }], pendientes: []
    }
  },
  {
    id: 9, acto: 3, titulo: "Ariete carmesí", villano: "rhino",
    anillo: ["brooklyn-bridge", "oscorp-tower", "osborn-labs", "daily-bugle", "x-jet", "queens"],
    nivel: 1, identidad: false,
    llegan: [],
    fijo: "magneto-hero", fijoAlterno: "storm", recomendados: ["wolverine", "spider-woman", "venom-hero"],
    porQue: "Rhino es una carrera de daño. Magneto (o Storm) castiga en área y la pareja pega fuerte de cerca.",
    prologo: [
      "Ravencroft ya no existe. Esta mañana, Cletus Kasady salió caminando por la puerta principal, cubierto de rojo, riéndose. Ahora se hace llamar Carnage.",
      "Lo primero que hizo fue buscar a alguien grande. Aleksei Sytsevich estaba en una celda de Ravencroft desde aquella noche en Oscorp. Ahora Rhino tiene zarcillos rojos en la armadura y carga contra el Puente de Brooklyn para cortar la ciudad en dos.",
      "Si el puente cae, Carnage tiene Manhattan para él solo."
    ],
    viñetas: {
      inicio: { titulo: "Viejo conocido", texto: "Rhino reconoce a los que lo encerraron. Esta vez no lo controla nadie, ni él mismo.", efecto: "" },
      presion: { titulo: "Zarcillos en el acero", texto: "Los zarcillos de Carnage se agarran de los cables del puente.", efecto: "Coloca 1 Matón en Brooklyn Bridge (si cabe)." },
      segunda: { titulo: "Aleksei pide ayuda", texto: "Entre rugidos, una voz con acento ruso pide que le saquen esto de encima.", efecto: "Cada Héroe gana 1 ficha de Ataque." }
    },
    victoria: {
      titulo: "El puente resiste",
      texto: [
        "Arrancan el simbionte de la armadura de Rhino y Aleksei cae de rodillas, temblando. «Está en la escuela de la araña», jadea. «Midtown. Dice que ahí hay mucha gente para su familia.»",
        "Esta noche termina todo."
      ],
      resumen: "Rhino quedó libre del simbionte y les dijo dónde está Carnage.",
      efectos: [], pendientes: []
    },
    derrota: {
      titulo: "Un puente partido",
      texto: [
        "Rhino arranca dos cables del puente antes de caer. Media ciudad queda incomunicada y Carnage aprovecha cada minuto: sus engendros ya están en las calles.",
        "Aleksei, libre del simbionte, les dice lo único que importa: Carnage está en Midtown High."
      ],
      resumen: "El puente quedó dañado y los engendros de Carnage ganaron tiempo.",
      efectos: [{ panico: 1 }, { carnage: 1 }], pendientes: []
    }
  },
  {
    id: 10, acto: 3, titulo: "Máxima Matanza", villano: "carnage", final: true,
    anillo: ["midtown-high", "daily-bugle", "oscorp-tower", "queens", "brooklyn-bridge", "x-jet"],
    nivel: 1, identidad: false,
    llegan: [],
    fijo: "spider-man", recomendados: ["venom-hero", "beast", "jean-grey"],
    tercero: true,
    porQue: "El final se juega con 3 héroes si pueden. Spider-Man rescata 3 Civiles de golpe; Venom conoce a su hijo mejor que nadie.",
    prologo: [
      "Todo empezó con una muestra en una bóveda de Oscorp. Termina en la escuela de Peter Parker.",
      "Carnage tomó Midtown High con los alumnos adentro. Cada persona que toca se convierte en un engendro, y cada engendro busca a otra persona. Si la marea roja sale de la escuela, no habrá forma de pararla.",
      "Peter mira hacia Queens una última vez. Después salta."
    ],
    viñetas: {
      inicio: { titulo: "La familia de Carnage", texto: "Kasady quiere que cada alumno sea parte de su familia.", efecto: "Coloca el medidor de engendros en la casilla que indica la campaña." },
      presion: { titulo: "Marea roja", texto: "Los engendros salen por las ventanas de la escuela.", efecto: "Coloca 1 Civil en el Lugar de Carnage (si cabe)." },
      segunda: { titulo: "Todos juntos", texto: "Por primera vez, todos los que conocieron en esta historia están en la misma calle.", efecto: "Cada Héroe roba 1 carta." }
    },
    victoria: {
      titulo: "Nueva York amanece",
      texto: [
        "Carnage se deshace en un chillido que rompe todos los vidrios de Midtown, y Cletus Kasady queda en el piso del gimnasio, pequeño, humano y encerrado en un frasco de S.H.I.E.L.D.",
        "Los alumnos salen de la escuela abrazados. Arriba, en el techo, los héroes miran salir el sol sobre Queens."
      ],
      resumen: "Carnage fue derrotado.",
      efectos: [], pendientes: []
    },
    derrota: {
      titulo: "La ciudad roja",
      texto: [
        "La marea roja sale de la escuela. Por una noche, Nueva York pertenece a Carnage.",
        "Pero los héroes no se rinden: evacuan a cada persona que pueden hacia el puente, hacia Westchester, hacia cualquier lugar lejos del rojo. Esta historia no termina aquí. Solo cambia de capítulo."
      ],
      resumen: "Carnage tomó la ciudad por una noche.",
      efectos: [], pendientes: []
    }
  }
];

const ACTOS = {
  1: { nombre: "Acto I", titulo: "La muestra" },
  2: { nombre: "Acto II", titulo: "Mutantes en la mira" },
  3: { nombre: "Acto III", titulo: "Máxima Matanza" }
};

/* Líneas del epílogo final según lo que pasó en la campaña */
function lineasFinales(estado, gano) {
  const f = estado.flags || {};
  const l = [];
  if (f.osborn === "arrestado") l.push("Norman Osborn mira el amanecer desde una celda de máxima seguridad. Nadie volverá a confiarle un laboratorio.");
  if (f.osborn === "huyo") l.push("En algún lugar de la ciudad, un Norman Osborn sin poderes ve las noticias y aprieta los dientes. Volverá a intentarlo; siempre vuelve.");
  if (f.kelly === "salvado") l.push("El Senador Kelly retira su proyecto de registro. En su discurso nombra a Scott Summers.");
  if (f.kelly === "herido") l.push("El registro de mutantes de Kelly sigue en pie. La próxima pelea de los X-Men será en los tribunales.");
  if (f.eddie === "aliado") l.push("Eddie Brock vuelve al Bugle con una historia que nadie más puede contar, y esta vez la firma con su nombre.");
  if (f.eddie === "ravencroft") l.push("Eddie Brock salió de Ravencroft para pelear contra su hijo. S.H.I.E.L.D. todavía discute si dejarlo libre.");
  if (f.magneto === "aliado") l.push("Magneto vuelve a Genosha sin despedirse. Antes de irse, deja la lista de Cerebro en el escritorio de Charles, intacta.");
  if (f.magneto === "rechazado") l.push("Charles le escribe una carta a Erik. Todavía no la envía.");
  const p = estado.panico;
  if (gano) l.push(p <= 1 ? "Nueva York vuelve a la normalidad en una semana. La tía May prepara lasaña para todos." : p <= 3 ? "La ciudad tardará meses en reconstruirse, pero lo hará." : "Nueva York queda herida y desconfiada. Los héroes tendrán que ganarse de nuevo a cada vecino.");
  return l;
}
