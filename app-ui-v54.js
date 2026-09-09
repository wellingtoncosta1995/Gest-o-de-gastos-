/* Meu Financeiro v54 — cabeçalho limpo, versão discreta e configurações corrigidas. */
(function(){
  'use strict';
  const APP_VERSION='v54';
  const gear='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M19.4 13.5a7.8 7.8 0 0 0 0-3l2-1.5-2-3.4-2.4 1a8.5 8.5 0 0 0-2.6-1.5L14 2.5h-4l-.4 2.6A8.5 8.5 0 0 0 7 6.6l-2.4-1-2 3.4 2 1.5a7.8 7.8 0 0 0 0 3l-2 1.5 2 3.4 2.4-1a8.5 8.5 0 0 0 2.6 1.5l.4 2.6h4l.4-2.6a8.5 8.5 0 0 0 2.6-1.5l2.4 1 2-3.4-2-1.5Z" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function apply(){
    const tela=document.getElementById('tela-resumo');
    const actions=tela?.querySelector('.mf-head-actions');
    if(!tela||!actions)return;

    /* Remove aviso de assinaturas do cabeçalho: a tela já existe na barra inferior. */
    const notify=document.getElementById('mf-notify');
    if(notify)notify.remove();

    /* Remove versões antigas/duplicadas. */
    tela.querySelectorAll('.mf-app-version,#mf-version-inline').forEach(el=>el.remove());

    /* Remove a data da saudação. */
    tela.querySelectorAll('.mf-greet time').forEach(el=>el.remove());

    /* Mantém somente uma versão discreta antes das configurações. */
    let settings=document.getElementById('mf-settings');
    if(!settings)return;
    let badge=document.getElementById('mf-version-v54');
    if(!badge){
      badge=document.createElement('span');
      badge.id='mf-version-v54';
      actions.insertBefore(badge,settings);
    }
    badge.textContent=APP_VERSION;

    /* Engrenagem correta e centralizada. */
    settings.innerHTML=gear;
    settings.setAttribute('aria-label','Configurações');
    settings.setAttribute('title','Configurações');
  }

  const style=document.createElement('style');
  style.textContent=`
    #tela-resumo .mf-head{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:16px!important}
    #tela-resumo .mf-brand{min-width:0!important;flex:1 1 auto!important}
    #tela-resumo .mf-head-actions{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:10px!important;flex:0 0 auto!important;margin-left:12px!important}
    #tela-resumo #mf-search{position:static!important;transform:none!important;margin:0!important;flex:0 0 38px!important;width:38px!important;height:38px!important;display:grid!important;place-items:center!important;padding:0!important}
    #tela-resumo #mf-search svg{width:22px!important;height:22px!important;display:block!important;margin:0!important}
    #tela-resumo #mf-notify{display:none!important}
    #tela-resumo .mf-greet time{display:none!important}
    #mf-version-v54{display:inline-flex!important;align-items:center!important;justify-content:center!important;height:24px!important;min-width:32px!important;padding:0 7px!important;border-radius:999px!important;background:#edf5f2!important;border:1px solid #dbeae4!important;color:#4f806f!important;font:700 9px/1 var(--sans)!important;letter-spacing:.01em!important;white-space:nowrap!important;flex:0 0 auto!important}
    #mf-settings{position:static!important;transform:none!important;width:38px!important;height:38px!important;min-width:38px!important;flex:0 0 38px!important;display:grid!important;place-items:center!important;padding:0!important;margin:0!important;border:0!important;background:transparent!important;color:#60736d!important;line-height:0!important;box-sizing:border-box!important}
    #mf-settings svg{display:block!important;width:24px!important;height:24px!important;margin:0!important;padding:0!important;transform:none!important;overflow:visible!important}
    @media(max-width:430px){
      #tela-resumo .mf-head{gap:8px!important}
      #tela-resumo .mf-head-actions{gap:6px!important;margin-left:4px!important}
      #tela-resumo #mf-search,#mf-settings{width:34px!important;height:34px!important;min-width:34px!important;flex-basis:34px!important}
      #tela-resumo #mf-search svg,#mf-settings svg{width:21px!important;height:21px!important}
      #mf-version-v54{height:22px!important;min-width:30px!important;padding:0 6px!important;font-size:8.5px!important}
    }
  `;
  document.head.appendChild(style);

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
  setTimeout(apply,250);setTimeout(apply,900);setTimeout(apply,1600);
})();