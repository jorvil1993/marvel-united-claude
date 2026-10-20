const VERSION = 'tm-202610200955';
const IMAGENES = [
  'assets/char/beast.jpg',
  'assets/char/black-cat.jpg',
  'assets/char/carnage.jpg',
  'assets/char/cyclops.jpg',
  'assets/char/ghost-spider.jpg',
  'assets/char/green-goblin.jpg',
  'assets/char/jean-grey.jpg',
  'assets/char/juggernaut.jpg',
  'assets/char/magneto-hero.jpg',
  'assets/char/magneto.jpg',
  'assets/char/miles-morales.jpg',
  'assets/char/mystique-hero.jpg',
  'assets/char/mystique.jpg',
  'assets/char/rhino.jpg',
  'assets/char/sabretooth.jpg',
  'assets/char/spider-ham.jpg',
  'assets/char/spider-man-2099.jpg',
  'assets/char/spider-man.jpg',
  'assets/char/spider-woman.jpg',
  'assets/char/storm.jpg',
  'assets/char/venom-hero.jpg',
  'assets/char/venom.jpg',
  'assets/char/wolverine.jpg',
  'assets/covers/I1.jpg',
  'assets/icons/atacar.png',
  'assets/icons/civil.png',
  'assets/icons/comodin.png',
  'assets/icons/exposicion.png',
  'assets/icons/heroica.png',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/maton.png',
  'assets/icons/mover.png',
  'assets/icons/periodista.png',
  'assets/icons/pista.png',
  'assets/loc/asteroid-m.jpg',
  'assets/loc/brooklyn-bridge.jpg',
  'assets/loc/daily-bugle.jpg',
  'assets/loc/genosha.jpg',
  'assets/loc/hangar-bay.jpg',
  'assets/loc/midtown-high.jpg',
  'assets/loc/muir-island.jpg',
  'assets/loc/osborn-labs.jpg',
  'assets/loc/oscorp-tower.jpg',
  'assets/loc/queens.jpg',
  'assets/loc/sentinel-station.jpg',
  'assets/loc/weapon-x.jpg',
  'assets/loc/x-jet.jpg',
  'assets/loc/xavier-institute.jpg',
  'assets/villain/carnage-art.jpg',
  'assets/villain/carnage-board.jpg',
  'assets/villain/green-goblin-art.jpg',
  'assets/villain/green-goblin-board.jpg',
  'assets/villain/juggernaut-art.jpg',
  'assets/villain/juggernaut-board.jpg',
  'assets/villain/magneto-art.jpg',
  'assets/villain/magneto-board.jpg',
  'assets/villain/mystique-art.jpg',
  'assets/villain/mystique-board.jpg',
  'assets/villain/rhino-art.jpg',
  'assets/villain/rhino-board.jpg',
  'assets/villain/sabretooth-art.jpg',
  'assets/villain/sabretooth-board.jpg',
  'assets/villain/venom-art.jpg',
  'assets/villain/venom-board.jpg',
];
const NUCLEO = ['./', 'index.html', 'css/app.css', 'js/data.js', 'js/app.js', 'manifest.webmanifest'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(NUCLEO.concat(IMAGENES))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
/* Código: primero la red (así siempre llega la última versión) y, sin internet, la copia guardada.
   Imágenes: primero la copia guardada. */
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const esImagen = /\.(jpg|png)$/.test(new URL(req.url).pathname);
  if (esImagen) {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => { const copia = res.clone(); caches.open(VERSION).then(c => c.put(req, copia)); return res; })));
    return;
  }
  e.respondWith(fetch(req).then(res => {
    if (res.ok && new URL(req.url).origin === location.origin) { const copia = res.clone(); caches.open(VERSION).then(c => c.put(req, copia)); }
    return res;
  }).catch(() => caches.match(req).then(r => r || caches.match('index.html'))));
});
