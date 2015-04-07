if (!Cache.prototype.add) {
  Cache.prototype.add = function add(request) {
    return this.addAll([request]);
  };
}

if (!Cache.prototype.addAll) {
  Cache.prototype.addAll = function addAll(requests) {
    var cache = this;

    // Since DOMExceptions are not constructable:
    function NetworkError(message) {
      this.name = 'NetworkError';
      this.code = 19;
      this.message = message;
    }
    NetworkError.prototype = Object.create(Error.prototype);

    return Promise.resolve().then(function() {
      if (arguments.length < 1) throw new TypeError();
      
      // Simulate sequence<(Request or USVString)> binding:
      var sequence = [];

      requests = requests.map(function(request) {
        if (request instanceof Request) {
          return request;
        }
        else {
          return String(request); // may throw TypeError
        }
      });

      return Promise.all(
        requests.map(function(request) {
          if (typeof request === 'string') {
            request = new Request(request);
          }

          var scheme = new URL(request.url).protocol;

          if (scheme !== 'http:' && scheme !== 'https:') {
            throw new NetworkError("Invalid scheme");
          }

          return fetch(request.clone());
        })
      );
    }).then(function(responses) {
      // TODO: check that requests don't overwrite one another
      // (don't think this is possible to polyfill due to opaque responses)
      return Promise.all(
        responses.map(function(response, i) {
          return cache.put(requests[i], response);
        })
      );
    }).then(function() {
      return undefined;
    });
  };
}

if (!CacheStorage.prototype.match) {
  // This is probably vulnerable to race conditions (removing caches etc)
  CacheStorage.prototype.match = function match(request, opts) {
    var caches = this;

    return this.keys().then(function(cacheNames) {
      var match;

      return cacheNames.reduce(function(chain, cacheName) {
        return chain.then(function() {
          return match || caches.open(cacheName).then(function(cache) {
            return cache.match(request, opts);
          }).then(function(response) {
            match = response;
            return match;
          });
        });
      }, Promise.resolve());
    });
  };
}


console.log("set");
self.addEventListener('fetch', function(event) {
  console.log("set");
   event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - 응답 반환
        if (response) {
          return response;
        }

        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('install', function(event) {
  console.log("install");
  event.waitUntil(
    caches.open('static-v5').then(function(cache) {
      return cache.addAll([
        '/blog/'
         //new Request('/blog/assets/js/scripts.min.js', {mode: 'no-cors'}),
         //new Request('/blog/images/nhnent.png', {mode: 'no-cors'})
      ]);
    }).then(function(){
      console.log('등록완료');
    }).catch(function(e){
      console.log(e);
    })
  );
});


// self.addEventListener('fetch', function(event) {
//   console.log("fetch");
//   console.log(event.request);
//   console.log(caches);

//   event.respondWith(
//     caches.match(event.request).then(function(response) {
//       console.log('in');
//       if(response){
//          console.log(response);
//         return response;
//       }
//     }).catch(function() {
//       console.log('exception');
//       return caches.match('/blog/404.html');
//     })
//   );
// });


