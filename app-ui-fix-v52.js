/* Meu Financeiro v52 — versão visível na Home e ícone de configurações centralizado. */
(function(){
  const APP_VERSION='v52';

  function applyVersion(){
    const tela=document.getElementById('tela-resumo');
    if(!tela)return;
    let badge=tela.querySelector('.mf-app-version');
    if(!badge){
      badge=document.createElement('div');
      badge.className='mf-app-version';
      const head=tela.querySelector('.mf-head');
      if(head) head.insertAdjacentElement('afterend',badge);
      else tela.prepend(badge);
    }
    badge.innerHTML='<span>Meu Financeiro</span><b>'+APP_VERSION+'</b>';
  }

  function fixSettings(){
    const btn=document.getElementById('mf-settings');
    if(!btn)return;
    btn.setAttribute('aria-label','Configurações');
    btn.style.display='grid';
    btn.style.placeItems='center';
    btn.style.padding='0';
    btn.style.lineHeight='0';
    const icon=btn.querySelector('svg');
    if(icon){
      icon.style.display='block';
      icon.style.margin='0';
      icon.style.width='22px';
      icon.style.height='22px';
      icon.style.flex='0 0 auto';
    }
  }

  function apply(){applyVersion();fixSettings();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
  setTimeout(apply,350);
  setTimeout(apply,1200);

  const style=document.createElement('style');
  style.textContent=`
    #tela-resumo .mf-app-version{
      display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:6px!important;
      padding:0 20px 4px!important;margin-top:-6px!important;color:#81908b!important;
      font-family:var(--sans)!important;font-size:9px!important;line-height:1!important;letter-spacing:.02em!important;
      pointer-events:none!important;
    }
    #tela-resumo .mf-app-version span{font-weight:600!important;opacity:.8!important}
    #tela-resumo .mf-app-version b{font-weight:800!important;color:#2f7a68!important;background:#e7f2ee!important;border:1px solid #d6e8e1!important;border-radius:999px!important;padding:4px 7px!important}
    #mf-settings{display:grid!important;place-items:center!important;padding:0!important;line-height:0!important;text-align:center!important}
    #mf-settings svg{display:block!important;width:22px!important;height:22px!important;margin:0!important;transform:none!important}
  `;
  document.head.appendChild(style);
})();