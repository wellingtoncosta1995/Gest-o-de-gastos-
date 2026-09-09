/* Meu Financeiro v31 — marca centralizada, Home e ícones modernos. */
(function(){
  try{Object.keys(localStorage).filter(k=>k.startsWith('biometria-ativa-')).forEach(k=>localStorage.removeItem(k));}catch(e){}
  window.biometriaAtiva=()=>false;

  const logo=`<div class="app-brand" aria-label="Meu Financeiro"><div class="mf-logo-icon" aria-hidden="true"><svg viewBox="0 0 64 64"><defs><linearGradient id="mf31" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#174A60"/><stop offset="1" stop-color="#36B97A"/></linearGradient></defs><path d="M9 49V37h7v12H9Zm13 0V29h7v20h-7Zm13 0V21h7v28h-7Zm13 0V13h7v36h-7Z" fill="url(#mf31)"/><path d="M10 31 24 24l10 5 17-17" fill="none" stroke="url(#mf31)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="m45 12 8-1-1 8" fill="none" stroke="#36B97A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div class="brand-copy"><b>MEU FINANCEIRO</b><span>CONTROLE INTELIGENTE</span></div></div>`;

  const icons={
    'tela-resumo':'<svg viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-4.5v-6H9v6H4.5A1.5 1.5 0 0 1 3 19.5Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    'tela-contas':'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 10h18M7 15h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    'tela-dividas':'<svg viewBox="0 0 24 24"><path d="M7 3h8l4 4v14H7Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M15 3v5h5M10 12h6M10 16h6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    'tela-metas':'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m15 9 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    'tela-cartoes':'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 10h18" stroke="currentColor" stroke-width="1.8"/><circle cx="8" cy="15" r="1" fill="currentColor"/></svg>',
    'tela-assinaturas':'<svg viewBox="0 0 24 24"><path d="M6 9a6 6 0 0 1 12 0v4l2 3H4l2-3Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 19h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
  };

  function addBrand(){
    if(document.querySelector('.app-brand')) return;
    const header=document.querySelector('#tela-resumo .top-header');
    if(header) header.insertAdjacentHTML('beforebegin',logo);
  }

  function modernizeTabs(){
    document.querySelectorAll('.tab[data-tela]').forEach(tab=>{
      const id=tab.dataset.tela;
      const icon=tab.querySelector('.icone');
      if(icon&&icons[id]) icon.innerHTML=icons[id];
      if(id==='tela-resumo'){
        Array.from(tab.childNodes).forEach(node=>{if(node.nodeType===3&&node.textContent.trim())node.textContent='Home';});
      }
    });
  }

  function enhance(){
    addBrand();
    modernizeTabs();
    const header=document.querySelector('#tela-resumo .top-header');
    if(header) header.classList.add('compact-management-card');
    document.querySelectorAll('.card').forEach(card=>{
      const t=(card.textContent||'').toLowerCase();
      if(t.includes('orçamento do mês')||t.includes('orcamento do mes')) card.classList.add('budget-modern-card');
    });
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance);else enhance();
  setTimeout(enhance,250);setTimeout(enhance,800);
})();