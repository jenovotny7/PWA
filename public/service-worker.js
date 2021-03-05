const APP_NAME = 'PWA-';     
const UNIT = 'version_01';
const CACHE = APP_NAME + UNIT
const FILES = [
  "./index.html",
  "./js/index.js",
  "./js/db.js",
  "./css/styles.css",
];






self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (request) {
      if (request) { 
        
        return request
      } else {      
        
        return fetch(event.request)
      }

     
    })
  )
})


self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      console.log('cache to be installed : ' + CACHE)
      return cache.addAll(FILES)
    })
  )
})






//Delete Cache 
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keyList) {
      
      let myList = keyList.filter(function (key) {
        return key.indexOf(APP_NAME);
      })
      
      myList.push(CACHE);

      return Promise.all(keyList.map(function (key, i) {
        if (mylist.indexOf(key) === -1) {
          console.log('removing cache : ' + keyList[i] );
          return caches.delete(keyList[i]);
        }
      }));
    })
  );
});
