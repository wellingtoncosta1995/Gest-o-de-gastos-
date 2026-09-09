const CACHE='gestao-gastos-v31';
const ASSETS=['./','./index.html','./pierre-layout.css?v=31','./ui-modern-v2.js?v=31','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))));self.clients.claim()});
function adicionarLayout(response){return response.text().then(html=>{
  html=html.replace(/<link[^>]*href=["'][^"']*pierre-layout\.css[^"']*["'][^>]*>\s*/gi,'');
  html=html.replace(/<script[^>]*src=["'][^"']*ui-modern-v2\.js[^"']*["'][^>]*><\/script>\s*/gi,'');
  const patch='<link rel="stylesheet" href="./pierre-layout.css?v=31">\n<script src="./ui-modern-v2.js?v=31" defer></script>\n';
  html=html.replace('</head>',patch+'</head>');
  return new Response(html,{status:response.status,statusText:response.statusText,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}})
})}
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const url=new URL(event.request.url);const isPage=event.request.mode==='navigate'||url.pathname.endsWith('/index.html');const isModernAsset=url.pathname.endsWith('/pierre-layout.css')||url.pathname.endsWith('/ui-modern-v2.js');if(isPage){event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>adicionarLayout(response.clone())).catch(()=>caches.match('./index.html').then(cached=>adicionarLayout(cached))));return}if(isModernAsset){event.respondWith(fetch(event.request,{cache:'no-store'}).catch(()=>caches.match(event.request)));return}event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)))});
self.addEventListener('push',event=>{let data={title:'Meu Financeiro',body:''};try{data=event.data.json()}catch(e){if(event.data)data.body=event.data.text()}event.waitUntil(self.registration.showNotification(data.title||'Meu Financeiro',{body:data.body||'',icon:'./icon-192.png',badge:'./icon-192.png'}))});
self.addEventListener('notificationclick',event=>{event.notification.close();event.waitUntil(self.clients.openWindow('./'))});