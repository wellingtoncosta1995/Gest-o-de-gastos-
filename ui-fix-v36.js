/* Meu Financeiro v36 — restaura identidade da Home e navegação sem remover recursos existentes. */
(function(){
  const logoHtml=`<div class="app-brand" aria-label="Meu Financeiro"><img src="./logo-meu-financeiro.svg?v=36" alt="Meu Financeiro" style="width:min(330px,82vw);height:auto;display:block"></div>`;
  const icons={
    'tela-resumo':'<svg viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-4.5v-6H9v6H4.5A1.5 1.5 0 0 1 3 19.5Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    'tela-contas':'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 10h18M7 15h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    'tela-dividas':'<svg viewBox="0 0 24 24"><path d="M7 3h8l4 4v14H7Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M15 3v5h5M10 12h6M10 16h6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    'tela-metas':'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m15 9 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    'tela-cartoes':'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 10h18" stroke="currentColor" stroke-width="1.8"/><circle cx="8" cy="15" r="1" fill="currentColor"/></svg>',
    'tela-assinaturas':'<svg viewBox="0 0 24 24"><path d="M6 9a6 6 0 0 1 12 0v4l2 3H4l2-3Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 19h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
  };
  function restoreBrand(){
    let brand=document.querySelector('.app-brand');
    const header=document.querySelector('#tela-resumo .top-header');
    if(!brand&&header){header.insertAdjacentHTML('beforebegin',logoHtml);brand=document.querySelector('.app-brand');}
    if(brand&&!brand.querySelector('img')) brand.innerHTML='<img src="./logo-meu-financeiro.svg?v=36" alt="Meu Financeiro" style="width:min(330px,82vw);height:auto;display:block">';
  }
  function restoreTabs(){
    document.querySelectorAll('.tab[data-tela]').forEach(tab=>{
      const id=tab.dataset.tela,icon=tab.querySelector('.icone');
      if(icon&&icons[id]) icon.innerHTML=icons[id];
      if(id==='tela-resumo') Array.from(tab.childNodes).forEach(n=>{if(n.nodeType===3&&n.textContent.trim())n.textContent='Home';});
    });
  }
  function restore(){restoreBrand();restoreTabs();const h=document.querySelector('#tela-resumo .top-header');if(h)h.classList.add('compact-management-card');}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',restore);else restore();
  setTimeout(restore,250);setTimeout(restore,800);setTimeout(restore,1600);
})();