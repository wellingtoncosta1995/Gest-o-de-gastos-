/* Meu Financeiro v53 — versão ao lado da engrenagem e ícone de configurações corrigido. */
(function(){
  const APP_VERSION='v53';
  const gear='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M19.2 13.3c.05-.43.05-.87 0-1.3l1.7-1.3-1.7-3-2 .8a7.8 7.8 0 0 0-1.1-.7l-.3-2.1h-3.4l-.3 2.1c-.4.2-.8.4-1.1.7l-2-.8-1.7 3L5 12c-.05.43-.05.87 0 1.3l-1.7 1.3 1.7 3 2-.8c.35.28.72.52 1.1.7l.3 2.1h3.4l.3-2.1c.4-.18.77-.42 1.1-.7l2 .8 1.7-3-1.7-1.3Z" transform="translate(2 -1) scale(.83)" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function apply(){
    const tela=document.getElementById('tela-resumo');
    const actions=tela?.querySelector('.mf-head-actions');
    const settings=document.getElementById('mf-settings');
    if(!tela||!actions||!settings)return;

    tela.querySelectorAll('.mf-app-version').forEach(el=>el.remove());

    let badge=document.getElementById('mf-version-inline');
    if(!badge){
      badge=document.createElement('span');
      badge.id='mf-version-inline';
      actions.insertBefore(badge,settings);
    }
    badge.textContent=APP_VERSION;

    settings.innerHTML=gear;
    settings.setAttribute('aria-label','Configurações');
  }

  const style=document.createElement('style');
  style.textContent=`
    #tela-resumo .mf-head-actions{display:flex!important;align-items:center!important;gap:7px!important}
    #mf-version-inline{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-width:38px!important;height:28px!important;padding:0 9px!important;border-radius:999px!important;background:#e7f2ee!important;border:1px solid #d6e8e1!important;color:#2f7a68!important;font:800 10px/1 var(--sans)!important;letter-spacing:.02em!important;white-space:nowrap!important;flex:0 0 auto!important}
    #mf-settings{width:38px!important;height:38px!important;min-width:38px!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:0!important;margin:0!important;border:0!important;background:transparent!important;color:#60736d!important;line-height:1!important;box-sizing:border-box!important;flex:0 0 38px!important}
    #mf-settings svg{width:23px!important;height:23px!important;display:block!important;margin:0!important;padding:0!important;transform:none!important;overflow:visible!important}
  `;
  document.head.appendChild(style);

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
  setTimeout(apply,250);setTimeout(apply,900);
})();