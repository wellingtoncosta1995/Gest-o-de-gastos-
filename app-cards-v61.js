/* Meu Financeiro v61 — tela de cartões restaurada, moderna e estável. */
(function(){
  'use strict';
  const esc=v=>typeof escaparHtml==='function'?escaparHtml(v):String(v??'');
  const money=v=>typeof formatarReal==='function'?formatarReal(v):Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  const icon={
    invoice:'<svg viewBox="0 0 24 24"><path d="M6 3h9l3 3v15H6Z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M15 3v4h4M9 11h6M9 15h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    card:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 10h18M7 15h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    cal:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M7 3v4M17 3v4M3 10h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    pie:'<svg viewBox="0 0 24 24"><path d="M11 3a9 9 0 1 0 9 9h-9Z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M14 3.5A7 7 0 0 1 20.5 10H14Z" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    trash:'<svg viewBox="0 0 24 24"><path d="M4 7h16M9 3h6l1 4H8l1-4ZM7 7l1 14h8l1-14M10 11v6M14 11v6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  function comprasHtml(c){
    const xs=c.compras||[];
    if(!xs.length)return '<div class="mf61-empty"><div>'+icon.invoice+'</div><b>Nenhuma compra cadastrada.</b><span>Suas compras parceladas aparecerão aqui.</span></div>';
    return xs.map(x=>{
      const n=typeof parcelaNumero==='function'?parcelaNumero(x):1;
      const quitada=n>x.parcelas;
      const tag=x.parcelas>1?(quitada?'Quitada':Math.max(1,n)+'/'+x.parcelas+' parcelas'):'À vista';
      return '<div class="mf61-purchase" onclick="editarCompra(\''+x.id+'\')"><div><b>'+esc(x.nome)+'</b><span>'+esc(tag)+'</span></div><div><strong>'+money(typeof valorParcela==='function'?valorParcela(x):x.valor_total)+'</strong><button aria-label="Excluir compra" onclick="event.stopPropagation();excluirCompra(\''+x.id+'\')">×</button></div></div>';
    }).join('');
  }

  function cardHtml(c){
    const fat=typeof faturaAtualCartao==='function'?faturaAtualCartao(c):0;
    const comp=typeof comprometidoCartao==='function'?comprometidoCartao(c):fat;
    const limite=Number(c.limite||0),disp=Math.max(0,limite-comp),pct=limite?Math.min(100,Math.max(0,comp/limite*100)):0;
    const banco=c.banco||'Cartão de crédito',nome=c.nome||banco;
    const fecha=c.dia_fechamento||'—',vence=c.dia_vencimento||'—';
    return '<article class="mf61-card">'+
      '<div class="mf61-card-head"><div class="mf61-card-icon">'+icon.card+'</div><div><h3>'+esc(nome)+'</h3><p>'+esc(banco)+'</p></div><span class="mf61-open">Aberta</span></div>'+
      '<section class="mf61-summary"><div class="mf61-summary-title"><h4>Resumo da fatura</h4><span>Atual</span></div><div class="mf61-grid">'+
        '<div><i>'+icon.invoice+'</i><span>Fatura atual</span><b>'+money(fat)+'</b></div>'+
        '<div><i>'+icon.card+'</i><span>Limite disponível</span><b>'+money(disp)+'</b></div>'+
        '<div><i>'+icon.cal+'</i><span>Fecha dia</span><b>'+fecha+'</b></div>'+
        '<div><i>'+icon.cal+'</i><span>Vence dia</span><b>'+vence+'</b></div>'+
      '</div><div class="mf61-limit"><div><span>Utilizado do limite</span><b>'+pct.toFixed(1).replace('.',',')+'%</b></div><div class="mf61-track"><i style="width:'+pct+'%"></i></div><div><small>'+money(comp)+' utilizados</small><small>'+money(limite)+' limite total</small></div></div></section>'+
      '<section class="mf61-installments"><div class="mf61-section-head"><h4>'+icon.pie+' Compras parceladas</h4></div>'+comprasHtml(c)+'<div class="mf61-actions"><button class="primary" onclick="novaCompraCartao(\''+c.id+'\')">+ Compra parcelada</button><button class="danger" onclick="excluirCartao(\''+c.id+'\')">'+icon.trash+' Excluir</button></div></section>'+
    '</article>';
  }

  function render(){
    const box=document.getElementById('lista-cartoes');if(!box)return;
    const title=document.querySelector('#tela-cartoes .section-title');
    if(title){title.childNodes.forEach(n=>{if(n.nodeType===3)n.textContent='Meus cartões'});const btn=title.querySelector('.adicionar');if(btn)btn.textContent='+ Novo cartão';}
    if(!Array.isArray(window.cartoes)||!window.cartoes.length){box.innerHTML='<div class="mf61-empty standalone"><div>'+icon.card+'</div><b>Nenhum cartão cadastrado.</b><span>Adicione seu primeiro cartão para acompanhar fatura e limite.</span></div>';return;}
    box.innerHTML=window.cartoes.map(cardHtml).join('');
  }

  const original=window.renderCartoes;
  window.renderCartoes=function(){render();};
  if(typeof original==='function'&&document.readyState!=='loading')setTimeout(render,0);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(render,0));else setTimeout(render,0);
  [400,1200].forEach(t=>setTimeout(render,t));

  const style=document.createElement('style');
  style.textContent=`
    #tela-cartoes .content{padding-bottom:120px!important}
    #tela-cartoes .section-title{font-family:var(--sans)!important;font-size:27px!important;font-weight:800!important;letter-spacing:-.03em!important;margin-bottom:22px!important}
    #tela-cartoes .section-title .adicionar{font-size:13px!important;font-weight:800!important;color:var(--sage)!important}
    #lista-cartoes{display:grid!important;gap:18px!important}
    .mf61-card{background:var(--card)!important;border:1px solid var(--line)!important;border-radius:26px!important;padding:18px!important;box-shadow:0 10px 28px rgba(23,53,47,.06)!important;color:var(--ink)!important}
    .mf61-card-head{display:grid!important;grid-template-columns:46px 1fr auto!important;gap:12px!important;align-items:center!important;padding-bottom:16px!important;border-bottom:1px solid var(--line)!important}
    .mf61-card-icon{width:46px!important;height:46px!important;border-radius:15px!important;background:var(--sage-soft)!important;color:var(--sage)!important;display:grid!important;place-items:center!important}.mf61-card-icon svg{width:24px!important;height:24px!important}
    .mf61-card-head h3{margin:0!important;font:800 18px/1.2 var(--sans)!important}.mf61-card-head p{margin:4px 0 0!important;color:var(--ink-soft)!important;font-size:12px!important}.mf61-open{font-size:10px!important;font-weight:800!important;color:var(--sage)!important;background:var(--sage-soft)!important;border:1px solid var(--line)!important;border-radius:999px!important;padding:6px 9px!important}
    .mf61-summary{padding:18px 0 0!important}.mf61-summary-title{display:flex!important;align-items:center!important;justify-content:space-between!important;margin-bottom:12px!important}.mf61-summary-title h4,.mf61-section-head h4{margin:0!important;font:800 17px/1.2 var(--sans)!important}.mf61-summary-title span{font-size:10px!important;font-weight:800!important;color:var(--sage)!important}
    .mf61-grid{display:grid!important;grid-template-columns:1fr 1fr!important;gap:10px!important}.mf61-grid>div{background:var(--sage-soft)!important;border:1px solid var(--line)!important;border-radius:18px!important;padding:13px!important;display:grid!important;grid-template-columns:28px 1fr!important;column-gap:8px!important;align-items:center!important}.mf61-grid i{grid-row:1/3;width:28px!important;height:28px!important;border-radius:9px!important;display:grid!important;place-items:center!important;color:var(--sage)!important;background:rgba(255,255,255,.45)!important}.mf61-grid i svg{width:18px!important;height:18px!important}.mf61-grid span{color:var(--ink-soft)!important;font-size:10px!important}.mf61-grid b{font-size:16px!important;line-height:1.15!important;white-space:nowrap!important}
    .mf61-limit{margin-top:16px!important}.mf61-limit>div:first-child,.mf61-limit>div:last-child{display:flex!important;justify-content:space-between!important;gap:8px!important}.mf61-limit span,.mf61-limit small{color:var(--ink-soft)!important;font-size:10.5px!important}.mf61-limit b{font-size:11px!important}.mf61-track{height:8px!important;background:var(--sage-soft)!important;border-radius:99px!important;overflow:hidden!important;margin:7px 0!important}.mf61-track i{display:block!important;height:100%!important;border-radius:inherit!important;background:var(--sage)!important}
    .mf61-installments{margin-top:18px!important;padding-top:18px!important;border-top:1px solid var(--line)!important}.mf61-section-head h4{display:flex!important;align-items:center!important;gap:8px!important}.mf61-section-head svg{width:20px!important;height:20px!important;color:var(--sage)!important}.mf61-empty{margin-top:12px!important;border:1px solid var(--line)!important;background:var(--paper)!important;border-radius:18px!important;padding:22px 14px!important;text-align:center!important;display:grid!important;place-items:center!important;gap:5px!important}.mf61-empty>div{width:38px!important;height:38px!important;display:grid!important;place-items:center!important;color:var(--ink-soft)!important}.mf61-empty svg{width:28px!important;height:28px!important}.mf61-empty b{font-size:13px!important}.mf61-empty span{font-size:11px!important;color:var(--ink-soft)!important}.mf61-empty.standalone{margin-top:0!important;background:var(--card)!important}
    .mf61-purchase{display:flex!important;justify-content:space-between!important;align-items:center!important;gap:10px!important;padding:12px 0!important;border-bottom:1px solid var(--line)!important;cursor:pointer!important}.mf61-purchase>div:first-child{display:grid!important;gap:4px!important}.mf61-purchase>div:first-child b{font-size:13px!important}.mf61-purchase>div:first-child span{font-size:10px!important;color:var(--ink-soft)!important}.mf61-purchase>div:last-child{display:flex!important;align-items:center!important;gap:6px!important}.mf61-purchase strong{font-size:12px!important}.mf61-purchase button{border:0!important;background:transparent!important;color:var(--ink-soft)!important;font-size:18px!important}
    .mf61-actions{display:flex!important;gap:8px!important;margin-top:14px!important}.mf61-actions button{border-radius:14px!important;padding:11px 13px!important;font:800 11px/1 var(--sans)!important;border:1px solid var(--line)!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:6px!important}.mf61-actions .primary{background:var(--sage)!important;color:#fff!important;border-color:var(--sage)!important;flex:1!important}.mf61-actions .danger{background:transparent!important;color:var(--rust)!important}.mf61-actions svg{width:16px!important;height:16px!important}
    @media(max-width:380px){.mf61-card{padding:15px!important}.mf61-grid{gap:8px!important}.mf61-grid>div{padding:11px!important}.mf61-grid b{font-size:14px!important}.mf61-actions{flex-direction:column!important}.mf61-actions button{width:100%!important}}
  `;
  document.head.appendChild(style);
})();