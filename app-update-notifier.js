/* Meu Financeiro — atualização rápida sem travar a interface. */
(function(){
  'use strict';
  const APP_VERSION='65';
  const KEY='mf:last-app-version';
  const RELOAD_KEY='mf:reload-version';
  let checking=false;
  let lastCheck=0;

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
    setTimeout(()=>{el.classList.remove('show');setTimeout(()=>el.remove(),280)},3800);
  }

  function forceVersion(version=APP_VERSION){
    const v='v'+String(version).replace(/^v/i,'');
    document.querySelectorAll('[id^="mf-version"],.mf-app-version,[data-app-version]').forEach(el=>{if(el.textContent!==v)el.textContent=v});
  }

  function syncVersion(version){
    const clean=String(version||APP_VERSION).replace(/^v/i,'');
    forceVersion(clean);
    toast(clean);
  }

  async function check(force=false){
    if(!('serviceWorker' in navigator)||checking)return;
    const now=Date.now();
    if(!force&&now-lastCheck<45000)return;
    checking=true;lastCheck=now;
    try{
      const reg=await navigator.serviceWorker.getRegistration();
      if(reg)await reg.update();
      navigator.serviceWorker.controller?.postMessage({type:'GET_APP_VERSION'});
    }catch(e){}finally{checking=false}
    forceVersion(APP_VERSION);
  }

  if('serviceWorker' in navigator){
    navigator.serviceWorker.addEventListener('message',e=>{
      const d=e.data||{};
      if(d.type==='APP_VERSION'||d.type==='APP_UPDATED')syncVersion(d.version||APP_VERSION);
    });
    navigator.serviceWorker.addEventListener('controllerchange',()=>{
      if(sessionStorage.getItem(RELOAD_KEY)===APP_VERSION)return;
      sessionStorage.setItem(RELOAD_KEY,APP_VERSION);
      setTimeout(()=>location.reload(),120);
    });
    window.addEventListener('load',()=>{forceVersion(APP_VERSION);setTimeout(()=>check(true),500)});
    window.addEventListener('pageshow',()=>setTimeout(()=>check(false),700));
    window.addEventListener('focus',()=>setTimeout(()=>check(false),400));
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')setTimeout(()=>check(false),500)});
    setInterval(()=>{if(document.visibilityState==='visible')check(false)},120000);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{forceVersion(APP_VERSION);toast(APP_VERSION)});else{forceVersion(APP_VERSION);toast(APP_VERSION)}

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