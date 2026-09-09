/* Meu Financeiro v57 — mantém apenas um logo por assinatura. */
(function(){
  'use strict';
  const norm=s=>(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();

  function cleanupCard(card){
    if(!card)return;
    const official=card.querySelector('.mf56-sub-logo');
    if(!official)return;

    const title=(card.querySelector('h3,.assinatura-main h3,.assinatura-info b,b')?.textContent||'').trim();
    const initial=(title.charAt(0)||'').toUpperCase();

    // Esconde os avatares/logos antigos conhecidos.
    card.querySelectorAll('.assinatura-logo,.assinatura-ico,.subscription-icon,.assinatura-avatar,.logo-assinatura').forEach(el=>{
      if(!el.classList.contains('mf56-sub-logo')) el.classList.add('mf57-hide-duplicate');
    });

    // Também remove o quadrado legado com apenas a inicial (ex.: S / G),
    // que era o segundo ícone mostrado ao lado do logo oficial.
    [...card.querySelectorAll('div,span')].forEach(el=>{
      if(el.closest('.mf56-sub-logo'))return;
      if(el.children.length)return;
      const txt=(el.textContent||'').trim().toUpperCase();
      if(initial && txt===initial){
        const cs=getComputedStyle(el);
        const w=parseFloat(cs.width)||el.getBoundingClientRect().width;
        const h=parseFloat(cs.height)||el.getBoundingClientRect().height;
        if(w>=32&&w<=100&&h>=32&&h<=100) el.classList.add('mf57-hide-duplicate');
      }
    });
  }

  function apply(){
    const box=document.getElementById('lista-assinaturas');
    if(!box)return;
    const cards=[...box.querySelectorAll(':scope > .assinatura-row,:scope > .assinatura-premium,:scope > article,:scope > .card')];
    (cards.length?cards:[...box.children]).forEach(cleanupCard);
  }

  const style=document.createElement('style');
  style.textContent=`
    #lista-assinaturas .mf57-hide-duplicate{display:none!important;width:0!important;height:0!important;min-width:0!important;margin:0!important;padding:0!important;border:0!important}
    #lista-assinaturas .mf56-sub-logo{margin-right:14px!important}
  `;
  document.head.appendChild(style);

  function start(){
    const box=document.getElementById('lista-assinaturas');
    if(box){
      const obs=new MutationObserver(()=>{clearTimeout(window.__mf57);window.__mf57=setTimeout(apply,40)});
      obs.observe(box,{childList:true,subtree:true});
    }
    apply();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
  [250,700,1400,2500].forEach(t=>setTimeout(apply,t));
})();