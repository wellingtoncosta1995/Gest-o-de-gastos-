/* Meu Financeiro v56 — logos de assinaturas robustos e independentes do layout. */
(function(){
  'use strict';
  const services=[
    {keys:['spotify'],domain:'spotify.com',label:'Spotify'},
    {keys:['netflix'],domain:'netflix.com',label:'Netflix'},
    {keys:['youtube premium','youtube'],domain:'youtube.com',label:'YouTube'},
    {keys:['disney+','disney plus','disney'],domain:'disneyplus.com',label:'Disney+'},
    {keys:['amazon prime','prime video','prime','amazon'],domain:'amazon.com.br',label:'Amazon Prime'},
    {keys:['icloud','i cloud'],domain:'icloud.com',label:'iCloud'},
    {keys:['deezer'],domain:'deezer.com',label:'Deezer'},
    {keys:['google one','googleone'],domain:'one.google.com',label:'Google One'},
    {keys:['max','hbo max'],domain:'max.com',label:'Max'},
    {keys:['paramount+','paramount plus','paramount'],domain:'paramountplus.com',label:'Paramount+'},
    {keys:['globoplay','globo play'],domain:'globoplay.globo.com',label:'Globoplay'},
    {keys:['apple music'],domain:'music.apple.com',label:'Apple Music'}
  ];
  const norm=s=>(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function serviceFor(name){const n=norm(name);return services.find(s=>s.keys.some(k=>n.includes(norm(k))))||null}
  function favicon(domain){return 'https://www.google.com/s2/favicons?domain='+encodeURIComponent(domain)+'&sz=128'}

  function ensureCardLogo(card,name){
    if(!card||!name)return;
    let holder=card.querySelector('.mf56-sub-logo');
    if(holder?.dataset.name===name)return;
    if(!holder){
      holder=document.createElement('div');
      holder.className='mf56-sub-logo';
      card.insertBefore(holder,card.firstChild);
    }
    holder.dataset.name=name;card.querySelector('.mf-sub-logo')?.remove();
    const svc=serviceFor(name);
    if(svc){
      holder.innerHTML='<img loading="lazy" referrerpolicy="no-referrer" src="'+favicon(svc.domain)+'" alt="'+esc(svc.label)+'">';
      const img=holder.querySelector('img');
      img.onerror=()=>{holder.innerHTML='<span>'+esc(name.charAt(0).toUpperCase())+'</span>'};
    }else holder.innerHTML='<span>'+esc(name.charAt(0).toUpperCase())+'</span>';
  }

  function apply(){
    const box=document.getElementById('lista-assinaturas');
    if(!box)return;
    const data=typeof assinaturas!=='undefined'?assinaturas:[];
    if(data.length){
      data.forEach(a=>{
        const name=(a&&a.nome)||'';if(!name)return;
        const candidates=[...box.querySelectorAll(':scope > *, article, .card, .assinatura-row, .assinatura-premium')];
        const card=candidates.find(el=>norm(el.textContent).includes(norm(name)));
        if(card)ensureCardLogo(card,name);
      });
    }else{
      [...box.children].forEach(card=>{
        const title=card.querySelector('h3,b,.assinatura-info,.assinatura-main');
        const name=(title?.textContent||'').trim();
        if(name)ensureCardLogo(card,name);
      });
    }
  }

  window.mfApplyLogos=apply;apply();

  const style=document.createElement('style');
  style.textContent=`
    #lista-assinaturas .mf56-sub-logo{width:56px!important;height:56px!important;min-width:56px!important;border-radius:16px!important;background:#fff!important;border:1px solid var(--line,#d8e4de)!important;display:grid!important;place-items:center!important;overflow:hidden!important;box-shadow:0 4px 12px rgba(23,53,47,.06)!important;align-self:flex-start!important;margin-right:12px!important}
    #lista-assinaturas .mf56-sub-logo img{width:38px!important;height:38px!important;object-fit:contain!important;display:block!important}
    #lista-assinaturas .mf56-sub-logo span{font:900 22px/1 var(--sans,system-ui)!important;color:var(--sage,#2f7a68)!important}
    #lista-assinaturas>.assinatura-row,#lista-assinaturas>.assinatura-premium,#lista-assinaturas>article{display:flex!important;align-items:flex-start!important}
    #lista-assinaturas .assinatura-logo,#lista-assinaturas .assinatura-ico{display:none!important}
  `;
  document.head.appendChild(style);
})();