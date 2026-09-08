/* Meu Financeiro v27 — melhorias visuais sem alterar dados ou funcionalidades. */
(function(){
  const norm=s=>(s||'').replace(/\s+/g,' ').trim().toLowerCase();
  const logo=`<div class="app-brand" aria-label="Meu Financeiro"><svg viewBox="0 0 72 72" aria-hidden="true"><defs><linearGradient id="mf27" x1="0" x2="1" y1="1" y2="0"><stop stop-color="#174A60"/><stop offset="1" stop-color="#36B97A"/></linearGradient></defs><path d="M10 54V29l14 14 14-21v32h8V14l7 7V8l15 15v31H56V40L43 54H32L24 44 10 54Z" fill="url(#mf27)"/></svg><div class="brand-copy"><b>MEU FINANCEIRO</b><span>CONTROLE INTELIGENTE</span></div></div>`;
  function addBrand(){
    if(document.querySelector('.app-brand')) return;
    const header=document.querySelector('.top-header');
    if(header) header.insertAdjacentHTML('beforebegin',logo);
  }
  function enhance(){
    addBrand();
    document.querySelectorAll('.tab').forEach((tab,index)=>{
      const text=norm(tab.textContent);
      if(text.includes('resumo')){
        tab.querySelectorAll('*').forEach(el=>{if(!el.children.length&&norm(el.textContent)==='resumo')el.textContent='Home'});
      }
      if(index===0) tab.classList.add('modern-home-tab');
    });
    document.querySelectorAll('.top-header').forEach(header=>{
      if(norm(header.textContent).includes('gestão de gastos')||norm(header.textContent).includes('gestao de gastos')) header.classList.add('compact-management-card');
    });
    document.querySelectorAll('.card').forEach(card=>{
      const text=norm(card.textContent);
      if(text.includes('orçamento do mês')||text.includes('orcamento do mes')) card.classList.add('budget-modern-card');
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance);
  else enhance();
  setTimeout(enhance,600);
})();