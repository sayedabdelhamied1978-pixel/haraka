var V='haraka-v2';
var CORE=['./','index.html','manifest.webmanifest','config.js','icon-192.png','icon-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(CORE)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  var u=new URL(e.request.url);
  var ok=u.origin===self.location.origin||u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'||u.hostname==='cdn.jsdelivr.net';
  if(!ok)return; /* never cache Supabase API calls */
  e.respondWith(caches.match(e.request).then(function(hit){
    var net=fetch(e.request).then(function(r){
      if(r&&(r.ok||r.type==='opaque')){var cp=r.clone();caches.open(V).then(function(c){c.put(e.request,cp)})}
      return r;
    }).catch(function(){return hit||caches.match('index.html')});
    return hit||net;
  }));
});
