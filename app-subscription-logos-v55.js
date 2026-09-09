/* Meu Financeiro v55 — restaura logos reais nas assinaturas. */
(function(){
  'use strict';
  const logoMap=[
    {keys:['spotify'],url:'https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg'},
    {keys:['netflix'],url:'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg'},
    {keys:['youtube','youtube premium'],url:'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg'},
    {keys:['disney','disney+'],url:'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg'},
    {keys:['amazon','prime','amazon prime'],url:'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg'},
    {keys:['icloud'],url:'https://upload.wikimedia.org/wikipedia/commons/1/1c/ICloud_logo.svg'},
    {keys:['deezer'],url:'https://upload.wikimedia.org/wikipedia/commons/e/e9/Deezer_logo.svg'},
    {keys:['google one','googleone'],url:'https://www.gstatic.com/subscriptions/img/g1_logo.svg'}
  ];
  const norm=s=>(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
  function findLogo(name){const n=norm(name);for(const item of logoMap){if(item.keys.some(k=>n.includes(norm(k))))return item.url}return ''}
  function enhance(){
    const box=document.getElementById('lista-assinaturas');if(!box)return;
    const rows=[...box.querySelectorAll('.assinatura-premium,.assinatura-row')];
    rows.forEach(row=>{
      const name=(row.querySelector('h3,.assinatura-info b,.assinatura-main h3')?.textContent||'').trim();
      if(!name)return;
      const holder=row.querySelector('.assinatura-logo,.assinatura-ico');if(!holder)return;
      const url=findLogo(name);
      holder.classList.add('mf55-logo-holder');
      if(url){
        holder.innerHTML='<img class="mf55-real-logo" src="'+url+'" alt="'+name+'" loading="lazy">';
        const img=holder.querySelector('img');
        img.onerror=()=>{holder.innerHTML='<span class="mf55-fallback">'+name.charAt(0).toUpperCase()+'</span>'};
      }else if(!holder.querySelector('img')){
        holder.innerHTML='<span class="mf55-fallback">'+name.charAt(0).toUpperCase()+'</span>';
      }
    });
  }
  const old=window.renderAssinaturas;
  if(typeof old==='function')window.renderAssinaturas=function(){const r=old.apply(this,arguments);setTimeout(enhance,0);return r};
  const obs=new MutationObserver(()=>{clearTimeout(window.__mf55t);window.__mf55t=setTimeout(enhance,40)});
  function start(){const box=document.getElementById('lista-assinaturas');if(box)obs.observe(box,{childList:true,subtree:true});enhance()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
  setTimeout(enhance,500);setTimeout(enhance,1200);
  const style=document.createElement('style');style.textContent=`
    #tela-assinaturas .mf55-logo-holder{display:grid!important;place-items:center!important;overflow:hidden!important;background:#fff!important;border:1px solid var(--line)!important}
    #tela-assinaturas .mf55-real-logo{width:72%!important;height:72%!important;object-fit:contain!important;display:block!important}
    #tela-assinaturas .mf55-fallback{font-weight:900!important;color:var(--sage)!important;font-size:22px!important}
  `;document.head.appendChild(style);
})();