/* Meu Financeiro v51 — identidade individual por conta. */
(function(){
  'use strict';
  function currentUser(){return window.usuarioAtual||null}
  function displayName(){
    const u=currentUser();
    if(!u)return 'Usuário';
    const m=u.user_metadata||{},p=m.perfil||{};
    const raw=(p.nome||m.nome||m.name||m.full_name||'').trim();
    if(raw)return raw.split(/\s+/)[0];
    const email=(u.email||'').split('@')[0].replace(/[._-]+/g,' ').trim();
    if(!email)return 'Usuário';
    const first=email.split(/\s+/)[0];
    return first.charAt(0).toUpperCase()+first.slice(1);
  }
  function photoForUser(){
    const u=currentUser();if(!u)return '';
    try{return localStorage.getItem('foto-perfil-'+u.id)||''}catch(e){return ''}
  }
  function applyIdentity(){
    const u=currentUser();if(!u)return;
    const n=displayName();
    const h=document.querySelector('#tela-resumo .mf-greet h1');if(h)h.textContent='Olá, '+n+'!';
    const btn=document.getElementById('mf-profile');
    if(btn){const f=photoForUser();btn.innerHTML=f?'<img src="'+f+'" alt="Foto do perfil">':'<span>'+n.slice(0,2).toUpperCase()+'</span>'}
    const pop=document.getElementById('perfil-popup-nome');if(pop&&!((u.user_metadata||{}).perfil||{}).nome)pop.textContent=n;
  }
  function resetVisibleUserState(){
    const h=document.querySelector('#tela-resumo .mf-greet h1');if(h)h.textContent='Olá!';
    const btn=document.getElementById('mf-profile');if(btn)btn.innerHTML='';
  }
  if(window.sb?.auth?.onAuthStateChange){
    sb.auth.onAuthStateChange((event,session)=>{
      if(!session){resetVisibleUserState();return}
      setTimeout(applyIdentity,0);setTimeout(applyIdentity,350);setTimeout(applyIdentity,1000);
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(applyIdentity,250));else setTimeout(applyIdentity,250);
  const oldFoto=window.atualizarFotoPerfil;
  if(typeof oldFoto==='function')window.atualizarFotoPerfil=function(){const r=oldFoto.apply(this,arguments);setTimeout(applyIdentity,0);return r};
  const oldSalvar=window.salvarPerfil;
  if(typeof oldSalvar==='function')window.salvarPerfil=async function(){const r=await oldSalvar.apply(this,arguments);setTimeout(applyIdentity,0);return r};
})();