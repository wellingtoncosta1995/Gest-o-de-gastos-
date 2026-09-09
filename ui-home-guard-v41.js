/* Meu Financeiro v41 — guarda do cabeçalho: impede o script legado de recolocar a logo grande. */
(function(){
 const search='<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m15.5 15.5 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
 const bell='<svg viewBox="0 0 24 24"><path d="M6 9a6 6 0 0 1 12 0v4l2 3H4l2-3Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 19h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
 function primeiroNome(){try{const m=usuarioAtual?.user_metadata||{},p=m.perfil||{};return (p.nome||m.nome||m.name||'Wellington').trim().split(' ')[0]||'Wellington'}catch(e){return 'Wellington'}}
 function foto(){try{if(typeof chaveFotoPerfil==='function'){const k=chaveFotoPerfil();return k?localStorage.getItem(k)||'':''}}catch(e){}return ''}
 function render(){
   const tela=document.getElementById('tela-resumo'),brand=tela?.querySelector('.app-brand');if(!tela||!brand)return;
   if(brand.querySelector('.mf39-brand-left')&&brand.querySelector('#home-profile-btn'))return;
   brand.innerHTML='<div class="mf39-brand-left"><img src="./logo-meu-financeiro.svg?v=36" alt="Meu Financeiro"><div><b>MEU FINANCEIRO</b><span>CONTROLE INTELIGENTE</span></div></div><div class="mf39-brand-actions"><button class="mf39-icon" id="home-search-btn" aria-label="Buscar">'+search+'</button><button class="mf39-icon" id="home-bell-btn" aria-label="Assinaturas">'+bell+'</button><button class="mf39-profile" id="home-profile-btn" aria-label="Perfil"></button></div>';
   const f=foto(),pb=document.getElementById('home-profile-btn');if(pb)pb.innerHTML=f?'<img src="'+f+'" alt="Foto do perfil">':'<span>'+primeiroNome().slice(0,2).toUpperCase()+'</span>';
   const sb=document.getElementById('home-search-btn');if(sb)sb.onclick=()=>{document.getElementById('lista-gastos-recentes')?.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>document.getElementById('busca-extrato')?.focus(),350)};
   const bb=document.getElementById('home-bell-btn');if(bb)bb.onclick=()=>{const t=document.querySelector('.tab[data-tela="tela-assinaturas"]');if(t)irPara('tela-assinaturas',t)};
   if(pb)pb.onclick=()=>abrirPopupPerfil();
 }
 const style=document.createElement('style');style.textContent='#tela-resumo.home-v39>.app-brand>img{display:none!important;width:0!important;height:0!important;opacity:0!important}';document.head.appendChild(style);
 function start(){render();const b=document.querySelector('#tela-resumo .app-brand');if(!b)return;new MutationObserver(()=>queueMicrotask(render)).observe(b,{childList:true});[420,1020,1250].forEach(t=>setTimeout(render,t));}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();