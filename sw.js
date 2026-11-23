const CACHE_NAME = 'portafolio-evidencias-v1';

const ARCHIVOS_A_CACHEAR = [
  './',
  './index.html',
  './manifest.json',
  './css/estilos.css',
  './js/iniciarSesion.js',
  './js/registro.js',
  './js/principal.js',
  './js/formularios.js',
  './html/iniciarSesion.html',
  './html/registro.html',
  './html/principal.html',
  './html/datosPersonales.html',
  './html/formacionAcademica.html',
  './html/cursos.html',
  './html/congresos.html',
  './html/conferencias.html',
  './html/experienciaLaboral.html',
  './html/proyectosPracticas.html',
  './html/habilidadesIntereses.html'
];

// Instalación: guarda los archivos base en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ARCHIVOS_A_CACHEAR);
    })
  );
  self.skipWaiting();
});

// Activación: limpia cachés de versiones anteriores
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch: responde desde caché si existe, o busca en red y guarda una copia
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((respuestaCache) => {
      if (respuestaCache) {
        return respuestaCache;
      }

      return fetch(event.request)
        .then((respuestaRed) => {
          if (
            !respuestaRed ||
            respuestaRed.status !== 200 ||
            respuestaRed.type !== 'basic'
          ) {
            return respuestaRed;
          }

          const copiaRespuesta = respuestaRed.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, copiaRespuesta);
          });

          return respuestaRed;
        })
        .catch(() => caches.match('./html/iniciarSesion.html'));
    })
  );
});
