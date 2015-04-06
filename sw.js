self.addEventListener('fetch', function(event) {
  console.log(event.request);
});
self.addEventListener('fetch', function(event) {
  event.respondWith(
    new Response('This came from the service worker!')
  );
});
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('static-v1').then(function(cache) {
      return cache.addAll([
        '/my-blog/',
        '/my-blog/fallback.html',
        new Request('//mycdn.com/style.css', {mode: 'no-cors'}),
        new Request('//mycdn.com/script.js', {mode: 'no-cors'})
      ]);
    })
  );
});