/* Meu Financeiro v38 — mantém cabeçalho Home estável após scripts legados. */
(function(){
 const search='<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m15.5 15.5 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
 const bell='<svg viewBox="0 0 24 24"><path d="M6 9a6 6 0 0 1 12 0v4l2 3H4l2-3Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 19h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
 let rebuilding=false;
 function fix(){
  if(rebuilding)return;
  const tela=document.getElementById('tela-resumo'),top=tela?.querySelector('.top-header');if(!tela||!top)return;
  rebuilding=true;
  let brand=tela.querySelector('.app-brand');if(!brand){brand=document.createElement('div');brand.className='app-brand';top.before(brand)}
  const perfil=document.getElementById('perfil-mini');
  if(!brand.querySelector('.mf37-brand-left')||!brand.querySelector('.mf37-brand-actions')){
   brand.innerHTML='<div class="mf37-brand-left"><img src="./logo-meu-financeiro.svg?v=36" alt="Meu Financeiro"><div><b>MEU FINANCEIRO</b><span>CONTROLE INTELIGENTE</span></div></div><div class="mf37-brand-actions"><button type="button" class="mf37-icon" data-home-search aria-label="Buscar">'+search+'</button><button type="button" class="mf37-icon" data-home-bell aria-label="Assinaturas">'+bell+'</button><span class="mf37-profile-slot"></span></div>';
  }
  const slot=brand.querySelector('.mf37-profile-slot');if(perfil&&slot)slot.replaceWith(perfil);
  const p=document.getElementById('perfil-mini');if(p){p.style.display='flex';p.style.visibility='visible';p.style.opacity='1'}
  brand.querySelector('[data-home-search]')?.addEventListener('click',()=>{document.getElementById('lista-gastos-recentes')?.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>document.getElementById('busca-extrato')?.focus(),350)},{once:true});
  brand.querySelector('[data-home-bell]')?.addEventListener('click',()=>{const tab=document.querySelector('.tab[data-tela="tela-assinaturas"]');if(tab)irPara('tela-assinaturas',tab)},{once:true});
  if(typeof atualizarFotoPerfil==='function')atualizarFotoPerfil();
  rebuilding=false;
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fix);else fix();
 [100,300,600,1100,1800,3000].forEach(t=>setTimeout(fix,t));
 const obs=new MutationObserver(()=>{clearTimeout(window.__mf38t);window.__mf38t=setTimeout(fix,30)});
 const start=()=>{const tela=document.getElementById('tela-resumo');if(tela)obs.observe(tela,{childList:true,subtree:true});};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();