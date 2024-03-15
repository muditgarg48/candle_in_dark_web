'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "82e4d320503c3c53253f21f79ee72e25",
"assets/AssetManifest.bin.json": "03ed01f30c3458f623db9074aec3c4f1",
"assets/AssetManifest.json": "e5880d31b07b412d5b7d1e0ace300441",
"assets/assets/imgs/app-icon.jpg": "06e77cd47d3e13f32eba17b7afd0a897",
"assets/assets/imgs/firebase.png": "45ec5c8523c42019e2aa9fe5436750af",
"assets/assets/imgs/flutter.png": "e02a6c427d3f2f6128219c4916cc4c6f",
"assets/assets/imgs/focus_dark.jpg": "82d9b1fdf6be6dc39963f7c83150e684",
"assets/assets/imgs/focus_light.jpg": "57c56f735f2a0b78d342f5d27ee9779a",
"assets/assets/imgs/github.png": "1b9b9f71269e504156ce9d89a00f2551",
"assets/assets/imgs/gmail.png": "eabc1a70245f1384e30960f25f9b2784",
"assets/assets/imgs/google_icon.png": "a56de8ea85a0d62b7ff6b255eaf27f8e",
"assets/assets/imgs/instagram.png": "6d502e87783d611f2d606d55d541e139",
"assets/assets/imgs/internet.png": "c6fc41df108c42e031788582de49cf01",
"assets/assets/imgs/linkedin.png": "fd0d5546fdbdc85c76c4372a0d51f1bc",
"assets/assets/imgs/trinity_drawer.jpg": "3ee46805184d3d4e7272f35ddccea615",
"assets/assets/imgs/trinity_home_page.jpg": "fccf029127023aceea1d4454a6f9c82e",
"assets/assets/json/calm_audios.json": "d38f08e6552c57245d8a4bdf29a3e81f",
"assets/assets/json/faculty.json": "a0190aa598e16dcebd3beb3e0c920430",
"assets/assets/json/imp_links.json": "3def5a56297ff55e255b4aef4a2f0dfa",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "722913583b7649f4a544fe28ec936f24",
"assets/NOTICES": "63f1f562f3bffb195c6b84318e1358df",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "fdd989f02576ec05830911556d83473a",
"assets/packages/currency_picker/lib/src/res/no_flag.png": "3f454777dfe9b6aae5e9d8544f4fa6f6",
"assets/packages/currency_picker/lib/src/res/xof.png": "5843e487ecffd9d3dcd01c1070cc6c6a",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "c86fbd9e7b17accae76e5ad116583dc4",
"canvaskit/canvaskit.js.symbols": "38cba9233b92472a36ff011dc21c2c9f",
"canvaskit/canvaskit.wasm": "3d2a2d663e8c5111ac61a46367f751ac",
"canvaskit/chromium/canvaskit.js": "43787ac5098c648979c27c13c6f804c3",
"canvaskit/chromium/canvaskit.js.symbols": "4525682ef039faeb11f24f37436dca06",
"canvaskit/chromium/canvaskit.wasm": "f5934e694f12929ed56a671617acd254",
"canvaskit/skwasm.js": "445e9e400085faead4493be2224d95aa",
"canvaskit/skwasm.js.symbols": "741d50ffba71f89345996b0aa8426af8",
"canvaskit/skwasm.wasm": "e42815763c5d05bba43f9d0337fa7d84",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"favicon.png": "1a55ed2b0102ee86e9dd0882dc1018bc",
"flutter.js": "c71a09214cb6f5f8996a531350400a9a",
"icons/Icon-192.png": "c29116ae59a293d89e07f8324b9d2d41",
"icons/Icon-512.png": "6324c029ce41c00a672853289c5dba9c",
"icons/Icon-maskable-192.png": "c29116ae59a293d89e07f8324b9d2d41",
"icons/Icon-maskable-512.png": "6324c029ce41c00a672853289c5dba9c",
"index.html": "f1853900722e80f29e0482129b59f420",
"/": "f1853900722e80f29e0482129b59f420",
"main.dart.js": "c0ecd1d250122feb26445f78f0c369e4",
"manifest.json": "5afc310f14ab8dcddd578b49f18add1e",
"version.json": "25963cae42c6034c443f05b4349a5fad"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
