/* Meu Financeiro — atualização rápida + aviso de nova versão. */
(function(){
  'use strict';
  const KEY='mf:last-app-version';
  let current='';
  let reloading=false;

  function toast(version){
    if(!version)return;
    const old=localStorage.getItem(KEY);
    if(old===version)return;
    localStorage.setItem(KEY,version);
    document.getElementById('mf-update-toast')?.remove();
    const el=document.createElement('div');
    el.id='mf-update-toast';
    el.setAttribute('role','status');
    el.innerHTML='<span>✓</span><div><b>App atualizado</b><small>Meu Financeiro agora está na v'+version+'</small></div>';
    document.body.appendChild(el);
    requestAnimationFrame(()=>el.classList.add('show'));
    setTimeout(()=>{el.classList.remove('show');setTimeout(()=>el.remove(),280)},4200);
  }

  function syncVersion(version){
    current=String(version||'').replace(/^v/i,'');
    if(!current)return;
    toast(current);
    document.querySelectorAll('[id^="mf-version"],.mf-app-version').forEach(el=>{el.textContent='v'+current});
  }

  function askVersion(){navigator.serviceWorker.controller?.postMessage({type:'GET_APP_VERSION'})}
  async function check(){
    if(!('serviceWorker' in navigator))return;
    try{const reg=await navigator.serviceWorker.getRegistration();if(reg)await reg.update()}catch(e){}
    askVersion();
  }

  if('serviceWorker' in navigator){
    navigator.serviceWorker.addEventListener('message',e=>{
      const d=e.data||{};
      if(d.type==='APP_VERSION'||d.type==='APP_UPDATED')syncVersion(d.version);
    });
    navigator.serviceWorker.addEventListener('controllerchange',()=>{
      if(reloading)return;
      reloading=true;
      sessionStorage.setItem('mf:just-updated','1');
      location.reload();
    });
    window.addEventListener('load',()=>{setTimeout(check,250);setTimeout(check,2500)});
    window.addEventListener('pageshow',()=>setTimeout(check,300));
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')setTimeout(check,150)});
    setInterval(()=>{if(document.visibilityState==='visible')check()},60000);
  }

  const style=document.createElement('style');
  style.textContent=`
    #mf-update-toast{position:fixed;left:50%;bottom:calc(92px + env(safe-area-inset-bottom));transform:translate(-50%,18px);width:min(360px,calc(100% - 28px));display:flex;align-items:center;gap:12px;padding:13px 15px;border-radius:18px;background:rgba(18,54,45,.97);color:#fff;box-shadow:0 14px 36px rgba(0,0,0,.22);z-index:9999;opacity:0;pointer-events:none;transition:.28s ease;font-family:var(--sans,system-ui)}
    #mf-update-toast.show{opacity:1;transform:translate(-50%,0)}
    #mf-update-toast>span{display:grid;place-items:center;width:34px;height:34px;min-width:34px;border-radius:50%;background:#5BE38D;color:#12362D;font-weight:900;font-size:18px}
    #mf-update-toast div{display:flex;flex-direction:column;gap:2px;min-width:0}
    #mf-update-toast b{font-size:14px;line-height:1.15}
    #mf-update-toast small{font-size:12px;opacity:.82;line-height:1.2}
  `;
  document.head.appendChild(style);
})();