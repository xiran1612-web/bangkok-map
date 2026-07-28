// 曼谷地图 Service Worker - 离线缓存
var CACHE_NAME = 'bangkok-map-v1';
var urlsToCache = [
  '/bangkok-map/',
  '/bangkok-map/index.html',
  '/bangkok-map/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache).catch(function() {
        // 部分资源加载失败不阻塞安装
      });
    })
  );
});

self.addEventListener('fetch', function(event) {
  // 对地图瓦片做缓存
  if (event.request.url.indexOf('tile.openstreetmap.org') > -1) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request).then(function(resp) {
          var clone = resp.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, clone);
          });
          return resp;
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
