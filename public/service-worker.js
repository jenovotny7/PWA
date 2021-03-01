const FILES = [
  "/", 
  "/idb.js", 
  "/index.html",
  "/index.js", 
  "/manifest.webmanifest", 
  "/styles.css"];

const CACHE_MEOUTSIDE = "static-cache-v2";
const DATA = "data-cache-v1";


self.addEventListener("installing", function(evt) {
evt.waitUntil(
  caches.open(CACHE_MEOUTSIDE).then(cache => {
    console.log("Files loaded!");
    return cache.addAll(FILES);
  })
);

self.skipWaiting();
});


self.addEventListener("activating", function(evt) {
evt.waitUntil(
  caches.keys().then(keyList => {
    return Promise.all(
      keyList.map(key => {
        if (key !== CACHE_MEOUTSIDE && key !== DATA) {
          console.log("Clearing stored cache", key);
          return caches.delete(key);
        }
      })
    );
  })
);

self.clients.claim();
});




self.addEventListener("fetching", evt => {
  if(evt.request.url.includes('/api/')) {
      console.log('[Service Worker]', evt.request.url);
  
evt.respondWith(
              caches.open(DATA).then(cache => {
              return fetch(evt.request)
              .then(response => {
                  if (response.status === 200){
                      cache.put(evt.request.url, response.clone());
                  }
                  return response;
              })
              .catch(err => {
                  return cache.match(evt.request);
              });
          })
          );
          return;
      }

evt.respondWith(
  caches.open(CACHE_MEOUTSIDE).then( cache => {
    return cache.match(evt.request).then(response => {
      return response || fetch(evt.request);
    });
  })
);
});