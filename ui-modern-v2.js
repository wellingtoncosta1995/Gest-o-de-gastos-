/* Meu Financeiro v29 — cabeçalho centralizado e perfil fora do card. */
(function(){
  try{Object.keys(localStorage).filter(k=>k.startsWith('biometria-ativa-')).forEach(k=>localStorage.removeItem(k));}catch(e){}
  window.biometriaAtiva=()=>false;
  window.ativarBiometria=()=>alert('A solicitação automática de chave-senha/Face ID está desativada.');
  const style=document.createElement('style');
  style.textContent='#btn-biometria{display:none!important}';
  document.head.appendChild(style);

  const norm=s=>(s||'').replace(/\s+/g,' ').trim().toLowerCase();
  const logo=`<div class="app-brand" aria-label="Meu Financeiro"><div class="mf-logo-icon" aria-hidden="true"><svg viewBox="0 0 72 72"><defs><linearGradient id="mf29" x1="0" x2="1" y1="1" y2="0"><stop stop-color="#174A60"/><stop offset="1" stop-color="#36B97A"/></linearGradient></defs><path d="M9 54V29l14 14 13-20v31h9V13l8 8V7l15 15v32H55V39L43 54H31L23 44 9 54Z" fill="url(#mf29)"/><path d="M45 13v41h10V40l13-18V7L45 13Z" fill="url(#mf29)" opacity=".9"/></svg></div><div class="brand-copy"><b>MEU FINANCEIRO</b><span>CONTROLE INTELIGENTE</span></div></div>`;
  function addBrand(){
    if(document.querySelector('.app-brand')) return;
    const header=document.querySelector('.top-header');
    if(header) header.insertAdjacentHTML('beforebegin',logo);
  }
  function moveProfile(){
    const header=document.querySelector('.top-header');
    if(!header) return;
    const profile=header.querySelector('.icon-btn');
    if(!profile || document.querySelector('.profile-outside-card')) return;
    const wrap=document.createElement('div');
    wrap.className='profile-outside-card';
    wrap.setAttribute('aria-label','Perfil');
    header.parentNode.insertBefore(wrap,header);
    wrap.appendChild(profile);
  }
  function enhance(){
    addBrand();
    moveProfile();
    document.querySelectorAll('.tab').forEach((tab,index)=>{
      const text=norm(tab.textContent);
      if(text.includes('resumo')) tab.querySelectorAll('*').forEach(el=>{if(!el.children.length&&norm(el.textContent)==='resumo')el.textContent='Home'});
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
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance);else enhance();
  setTimeout(enhance,300);setTimeout(enhance,900);
})();