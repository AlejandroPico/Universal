const CACHE='universal-install-v1';
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./offline.html','./icons/icon-192.png','./icons/icon-512.png'])));self.skipWaiting();});
self.addEventListener('activate',event=>event.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('universal-install-')&&k!==CACHE).map(k=>caches.delete(k))))])));
self.addEventListener('fetch',event=>{if(event.request.mode==='navigate')event.respondWith(fetch(event.request).catch(()=>caches.match('./offline.html')));});
