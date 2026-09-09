/* Meu Financeiro v32 — identidade visual + assinaturas vinculadas aos cartões. */
(function(){
  try{Object.keys(localStorage).filter(k=>k.startsWith('biometria-ativa-')).forEach(k=>localStorage.removeItem(k));}catch(e){}
  window.biometriaAtiva=()=>false;

  const logo=`<div class="app-brand" aria-label="Meu Financeiro"><div class="mf-logo-icon" aria-hidden="true"><svg viewBox="0 0 64 64"><defs><linearGradient id="mf32" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#174A60"/><stop offset="1" stop-color="#36B97A"/></linearGradient></defs><path d="M9 49V37h7v12H9Zm13 0V29h7v20h-7Zm13 0V21h7v28h-7Zm13 0V13h7v36h-7Z" fill="url(#mf32)"/><path d="M10 31 24 24l10 5 17-17" fill="none" stroke="url(#mf32)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="m45 12 8-1-1 8" fill="none" stroke="#36B97A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div class="brand-copy"><b>MEU FINANCEIRO</b><span>CONTROLE INTELIGENTE</span></div></div>`;

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
      if(id==='tela-resumo') Array.from(tab.childNodes).forEach(node=>{if(node.nodeType===3&&node.textContent.trim())node.textContent='Home';});
    });
  }

  function mapaAssinaturas(){
    return usuarioAtual?.user_metadata?.assinaturas_cartoes||{};
  }
  async function salvarMapaAssinaturas(novoMapa){
    if(!usuarioAtual)return false;
    const r=await sb.auth.updateUser({data:{...usuarioAtual.user_metadata,assinaturas_cartoes:novoMapa}});
    if(r.error){console.error(r.error);return false}
    usuarioAtual=r.data.user;
    return true;
  }
  function cartaoDaAssinatura(id){
    const cid=mapaAssinaturas()[id];
    return cartoes.find(c=>String(c.id)===String(cid))||null;
  }
  function assinaturaCobraNoMes(a,ref=new Date()){
    if(a.ativo===false)return false;
    if(a.ciclo==='anual')return Number(a.mes_cobranca||0)===ref.getMonth()+1;
    return true;
  }
  function assinaturasDoCartao(cartaoId,ref=new Date()){
    const mapa=mapaAssinaturas();
    return (assinaturas||[]).filter(a=>String(mapa[a.id]||'')===String(cartaoId)&&assinaturaCobraNoMes(a,ref));
  }
  function valorAssinaturasCartao(cartaoId,ref=new Date()){
    return assinaturasDoCartao(cartaoId,ref).reduce((s,a)=>s+Number(a.valor||0),0);
  }

  function injetarCampoCartao(){
    const modal=document.querySelector('#modal-assinatura .modal-cartao');
    if(!modal||document.getElementById('assinatura-cartao'))return;
    const salvar=modal.querySelector('.modal-salvar');
    const campo=document.createElement('div');
    campo.className='campo';
    campo.innerHTML='<label>Pagar com</label><select id="assinatura-cartao"><option value="">Sem cartão vinculado</option></select><div class="assinatura-ajuda">Se escolher um cartão, esta assinatura entra automaticamente na fatura dele.</div>';
    modal.insertBefore(campo,salvar);
  }
  function preencherCartoesAssinatura(valor=''){
    const sel=document.getElementById('assinatura-cartao');
    if(!sel)return;
    sel.innerHTML='<option value="">Sem cartão vinculado</option>'+cartoes.map(c=>`<option value="${c.id}">${escaparHtml(c.nome||c.banco||'Cartão')}</option>`).join('');
    sel.value=valor||'';
  }

  window.vincularAssinaturaCartao=async function(id,cartaoId){
    const mapa={...mapaAssinaturas()};
    if(cartaoId)mapa[id]=cartaoId;else delete mapa[id];
    const ok=await salvarMapaAssinaturas(mapa);
    if(!ok){alert('Não foi possível salvar o cartão desta assinatura.');return}
    renderAssinaturas();renderCartoes();renderCarrosselCartoes();renderResumo();
  };

  const abrirModalOriginal=window.abrirModal;
  window.abrirModal=function(id){
    if(id==='modal-assinatura'){injetarCampoCartao();preencherCartoesAssinatura('');}
    return abrirModalOriginal.apply(this,arguments);
  };

  window.salvarAssinatura=async function(){
    const nome=document.getElementById('assinatura-nome').value.trim();
    const valor=valorMonetario(document.getElementById('assinatura-valor').value);
    const ciclo=document.getElementById('assinatura-ciclo').value;
    const dia_cobranca=Math.min(31,Math.max(1,parseInt(document.getElementById('assinatura-dia').value)||1));
    const mes_cobranca=ciclo==='anual'?Math.min(12,Math.max(1,parseInt(document.getElementById('assinatura-mes').value)||1)):null;
    const cartaoId=document.getElementById('assinatura-cartao')?.value||'';
    if(!nome||!valor){alert('Preencha o nome e o valor.');return}
    const r=await sb.from('assinaturas').insert({nome,valor,ciclo,dia_cobranca,mes_cobranca}).select('id').single();
    if(informarErro(r.error,'salvar a assinatura'))return;
    if(cartaoId){const mapa={...mapaAssinaturas(),[r.data.id]:cartaoId};await salvarMapaAssinaturas(mapa)}
    document.getElementById('assinatura-nome').value='';document.getElementById('assinatura-valor').value='';document.getElementById('assinatura-dia').value='';document.getElementById('assinatura-mes').value='';
    if(document.getElementById('assinatura-cartao'))document.getElementById('assinatura-cartao').value='';
    fecharModal('modal-assinatura');await carregarTudo();
  };

  window.excluirAssinatura=async function(id){
    if(!confirm('Excluir esta assinatura?'))return;
    const{error}=await sb.from('assinaturas').delete().eq('id',id);
    if(informarErro(error,'excluir a assinatura'))return;
    const mapa={...mapaAssinaturas()};delete mapa[id];await salvarMapaAssinaturas(mapa);await carregarTudo();
  };

  const faturaBase=window.faturaAtualCartao;
  window.faturaAtualCartao=function(c){return Number(faturaBase(c)||0)+valorAssinaturasCartao(c.id)};
  const comprometidoBase=window.comprometidoCartao;
  window.comprometidoCartao=function(c){return Number(comprometidoBase(c)||0)+valorAssinaturasCartao(c.id)};

  const renderCartoesBase=window.renderCartoes;
  window.renderCartoes=function(){
    renderCartoesBase();
    const cards=[...document.querySelectorAll('#lista-cartoes > .card')];
    cartoes.forEach((c,i)=>{
      const card=cards[i];if(!card)return;
      card.querySelectorAll('.assinaturas-no-cartao').forEach(e=>e.remove());
      const lista=assinaturasDoCartao(c.id);
      if(!lista.length)return;
      const box=document.createElement('div');box.className='assinaturas-no-cartao';
      box.innerHTML='<h3>Assinaturas recorrentes</h3>'+lista.map(a=>`<div class="compra-row"><div><b>${escaparHtml(a.nome)}</b><span class="recorrente-tag">Recorrente</span><small>${a.ciclo==='anual'?'Cobrança anual':'Cobrança mensal'} · dia ${a.dia_cobranca}</small></div><strong class="tabular">${formatarReal(a.valor)}</strong></div>`).join('');
      const acoes=card.querySelector('.cartao-acoes');if(acoes)card.insertBefore(box,acoes);else card.appendChild(box);
    });
  };

  window.renderAssinaturas=function(){
    const box=document.getElementById('lista-assinaturas'),alertas=document.getElementById('alertas-assinaturas');if(!box)return;
    const ativas=(assinaturas||[]).filter(a=>a.ativo!==false);
    const mensal=ativas.reduce((s,a)=>s+(a.ciclo==='anual'?Number(a.valor||0)/12:Number(a.valor||0)),0);
    const anual=ativas.reduce((s,a)=>s+(a.ciclo==='anual'?Number(a.valor||0):Number(a.valor||0)*12),0);
    const em=document.getElementById('assinaturas-mensal'),ea=document.getElementById('assinaturas-anual');if(em)em.textContent=formatarReal(mensal);if(ea)ea.textContent=formatarReal(anual);
    if(alertas){const proximas=ativas.map(a=>({a,d:proximaCobranca(a),n:diasAte(proximaCobranca(a))})).filter(x=>x.n>=0&&x.n<=3);alertas.innerHTML=proximas.map(x=>`<div class="alerta-strip">${escaparHtml(x.a.nome)} vence ${x.n===0?'hoje':x.n===1?'amanhã':'em '+x.n+' dias'} · ${formatarReal(x.a.valor)}</div>`).join('')}
    if(!ativas.length){box.innerHTML='<div class="vazio">Nenhuma assinatura cadastrada.</div>';return}
    box.innerHTML=ativas.map(a=>{const d=proximaCobranca(a),cartao=cartaoDaAssinatura(a.id);return`<div class="assinatura-row"><div class="swipe-inner"><div class="assinatura-info"><b>${escaparHtml(a.nome)}</b><small>${a.ciclo==='anual'?'Anual':'Mensal'} · próxima ${d.toLocaleDateString('pt-BR')} · ${formatarReal(a.valor)}</small><div class="assinatura-pagamento"><span>Pagar com</span><select onchange="vincularAssinaturaCartao('${a.id}',this.value)"><option value="">Sem cartão</option>${cartoes.map(c=>`<option value="${c.id}" ${cartao&&String(cartao.id)===String(c.id)?'selected':''}>${escaparHtml(c.nome||c.banco||'Cartão')}</option>`).join('')}</select>${cartao?'<span class="recorrente-tag">Entra na fatura</span>':''}</div></div><button class="btn-excluir" onclick="excluirAssinatura('${a.id}')">✕</button></div></div>`}).join('');
  };

  const style=document.createElement('style');
  style.textContent=`
    .assinatura-ajuda{font-size:11px;color:var(--ink-soft);margin-top:6px;line-height:1.35}
    .assinatura-pagamento{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-top:8px}
    .assinatura-pagamento>span:first-child{font-size:11px;color:var(--ink-soft)}
    .assinatura-pagamento select{min-height:34px!important;padding:5px 9px!important;border-radius:10px!important;font-size:12px!important;width:auto!important;max-width:180px}
    .recorrente-tag{display:inline-block;background:var(--sage-soft);color:var(--sage);border-radius:999px;padding:3px 7px;font-size:9.5px;font-weight:800;margin-left:6px}
    .assinaturas-no-cartao{border-top:1px solid var(--line);margin-top:12px;padding-top:14px}
    .assinaturas-no-cartao h3{margin:0 0 8px;font-family:var(--sans);font-size:14px;color:var(--ink)}
  `;
  document.head.appendChild(style);

  function enhance(){
    addBrand();modernizeTabs();injetarCampoCartao();
    const header=document.querySelector('#tela-resumo .top-header');if(header)header.classList.add('compact-management-card');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance);else enhance();
  setTimeout(enhance,250);setTimeout(enhance,800);
})();