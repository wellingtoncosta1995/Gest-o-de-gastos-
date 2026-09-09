/* Meu Financeiro v59 — ícone de configurações limpo, centralizado e consistente. */
(function(){
  'use strict';
  const gear=`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.07-.94l2.03-1.58-1.92-3.32-2.5 1.01a7.9 7.9 0 0 0-1.63-.95L14.73 3.5h-3.84l-.38 2.72c-.58.24-1.12.56-1.62.94L6.38 6.15 4.46 9.48l2.03 1.58c-.04.31-.06.62-.06.94s.02.63.06.94l-2.03 1.58 1.92 3.33 2.51-1.02c.5.39 1.04.7 1.62.95l.38 2.72h3.84l.38-2.72a7.9 7.9 0 0 0 1.63-.95l2.5 1.02 1.92-3.33-2.02-1.58Z" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  function apply(){
    const settings=document.getElementById('mf-settings');
    if(!settings)return;
    settings.innerHTML=gear;
    settings.setAttribute('aria-label','Configurações');
    settings.setAttribute('title','Configurações');
    settings.classList.add('mf-settings-v59');
  }
  const style=document.createElement('style');
  style.textContent=`
    #mf-settings.mf-settings-v59{position:static!important;transform:none!important;appearance:none!important;-webkit-appearance:none!important;width:38px!important;height:38px!important;min-width:38px!important;flex:0 0 38px!important;padding:0!important;margin:0!important;border:0!important;border-radius:50%!important;background:transparent!important;color:#60736d!important;display:flex!important;align-items:center!important;justify-content:center!important;line-height:1!important;box-sizing:border-box!important;overflow:visible!important}
    #mf-settings.mf-settings-v59 svg{display:block!important;width:25px!important;height:25px!important;min-width:25px!important;min-height:25px!important;margin:0!important;padding:0!important;position:static!important;transform:none!important;overflow:visible!important}
    #mf-settings.mf-settings-v59:active{background:rgba(47,122,104,.10)!important}
    @media(max-width:430px){#mf-settings.mf-settings-v59{width:34px!important;height:34px!important;min-width:34px!important;flex-basis:34px!important}#mf-settings.mf-settings-v59 svg{width:23px!important;height:23px!important;min-width:23px!important;min-height:23px!important}}
  `;
  document.head.appendChild(style);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
  [200,700,1500].forEach(t=>setTimeout(apply,t));
})();