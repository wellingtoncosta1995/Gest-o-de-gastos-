/* Meu Financeiro v42 — modais acima da navegação e sem sobreposição da barra inferior. */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    .modal-fundo{z-index:5000!important}
    .modal-fundo.aberto{display:flex!important}
    .modal-fundo .modal-cartao{max-height:calc(100dvh - 18px)!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch!important;padding-bottom:calc(28px + env(safe-area-inset-bottom))!important}
    body.mf-modal-open .tabbar{visibility:hidden!important;pointer-events:none!important;opacity:0!important}
    body.mf-modal-open{overflow:hidden!important}
    @media(max-width:480px){.modal-fundo .modal-cartao{max-height:calc(100dvh - 10px)!important}}
  `;
  document.head.appendChild(style);

  function sync(){
    const aberto=!!document.querySelector('.modal-fundo.aberto');
    document.body.classList.toggle('mf-modal-open',aberto);
  }

  const abrir=window.abrirModal;
  if(typeof abrir==='function')window.abrirModal=function(id){const r=abrir.apply(this,arguments);requestAnimationFrame(sync);return r};
  const fechar=window.fecharModal;
  if(typeof fechar==='function')window.fecharModal=function(id){const r=fechar.apply(this,arguments);requestAnimationFrame(sync);return r};

  document.addEventListener('click',()=>setTimeout(sync,0));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync);else sync();
})();