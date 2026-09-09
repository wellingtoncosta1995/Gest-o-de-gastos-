// Cache only this app's public shell. Authenticated Supabase requests stay on the network.
const PREFIX='meu-financeiro:'+self.registration.scope+':';
const CACHE=PREFIX+'61';
const ASSETS=['./','./index.html','./pierre-layout.css?v=40','./app-accessibility.css?v=58','./app-core.js?v=58','./app-v50.js?v=58','./app-subscription-logos-v56.js?v=58','./app-settings-icon-v59.js?v=60','./app-cards-v61.js?v=61','./logo-meu-financeiro.svg?v=36','./app-icon.svg?v=35','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
const CDN=new Set(['https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2','https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js']);
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(ASSETS);await self.skipWaiting()})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})()));
async function pageResponse(response){
  const html=await response.text();
  const clean=html.replace(/<script[^>]*src=["'][^"']*app-cards-v61\.js[^"']*["'][^>]*><\/script>\s*/gi,'');
  const patched=clean.replace('</head>','<script defer src="./app-cards-v61.js?v=61"></script>\n</head>');
  return new Response(patched,{status:response.status,statusText:response.statusText,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
}
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url),local=url.origin===self.location.origin&&url.href.startsWith(self.registration.scope);
  if(!local&&!CDN.has(url.href))return;
  if(event.request.mode==='navigate'){
    event.respondWith((async()=>{const cache=await caches.open(CACHE);try{const response=await fetch(event.request,{cache:'no-store'});if(response.ok)await cache.put('./index.html',response.clone());return await pageResponse(response)}catch(e){const cached=await cache.match('./index.html');return cached?await pageResponse(cached):new Response('Sem conexão. Conecte-se à internet para abrir o app.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})}})());return;
  }
  const known=ASSETS.some(a=>new URL(a,self.registration.scope).href===url.href)||CDN.has(url.href);
  if(!known)return;
  event.respondWith((async()=>{const cache=await caches.open(CACHE);if(local){try{const response=await fetch(event.request,{cache:'no-store'});if(response.ok){await cache.put(event.request,response.clone());return response}}catch(e){}return await cache.match(event.request)}const cached=await cache.match(event.request);if(cached)return cached;const response=await fetch(event.request);if(response.ok)await cache.put(event.request,response.clone());return response})());
});
self.addEventListener('push',event=>{let data={title:'Meu Financeiro',body:''};try{data=event.data?.json()||data}catch(e){data.body=event.data?.text()||''}event.waitUntil(self.registration.showNotification(data.title||'Meu Financeiro',{body:data.body||'',icon:'./icon-192.png',badge:'./icon-192.png'}))});
self.addEventListener('notificationclick',event=>{event.notification.close();event.waitUntil((async()=>{const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});const existing=clients.find(c=>c.url.startsWith(self.registration.scope));if(existing)return existing.focus();return self.clients.openWindow(self.registration.scope)})())});
