// Melhorias visuais e financeiras — versão 2.1
(function () {
  'use strict';

  const KEY_ENTRADAS = 'gestao-gastos-entradas-v2';
  const KEY_MES = 'gestao-gastos-mes-v2';
  const VERSAO = 'v2.1.0';

  const moeda = v => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const valor = v => {
    const s = String(v || '').trim().replace(/R\$|\s/g, '');
    const n = s.includes(',') ? Number(s.replace(/\./g, '').replace(',', '.')) : Number(s);
    return Number.isFinite(n) && n > 0 ? n : 0;
  };
  const esc = s => String(s ?? '').replace(/[&<>'"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[c]));
  const lerEntradas = () => { try { return JSON.parse(localStorage.getItem(KEY_ENTRADAS) || '[]'); } catch (_) { return []; } };
  const salvarEntradas = lista => localStorage.setItem(KEY_ENTRADAS, JSON.stringify(lista));
  const mesAtual = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); };
  const mesSelecionado = () => localStorage.getItem(KEY_MES) || mesAtual();
  const nomeMes = chave => { const [a,m] = chave.split('-').map(Number); return new Date(a,m-1,1).toLocaleDateString('pt-BR',{month:'long',year:'numeric'}); };
  const chaveMesData = d => d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0');
  const gastosDoMes = () => (window.gastos || []).filter(g => {
    if (!g.data) return true;
    const d = new Date(g.data);
    return chaveMesData(d) === mesSelecionado();
  });
  const entradasDoMes = () => lerEntradas().filter(e => e.mes === mesSelecionado());

  function instalarEstilo() {
    if (document.getElementById('estilo-v21')) return;
    const style = document.createElement('style');
    style.id = 'estilo-v21';
    style.textContent = `
      .cabecalho-versao-v21{display:flex;justify-content:space-between;align-items:center;margin:-8px 0 14px;color:var(--ink-soft);font-size:10px;letter-spacing:.2px}
      .versao-v21{background:var(--ink);color:var(--paper);padding:5px 8px;border-radius:999px;font-weight:700;font-size:10px}
      .resumo-hero-v21{background:linear-gradient(135deg,var(--ink),#354566);border-radius:18px;padding:18px;box-shadow:0 10px 25px rgba(31,42,68,.16);color:var(--paper);margin-bottom:14px}
      .resumo-hero-v21 .rotulo{font-size:12px;opacity:.78}.resumo-hero-v21 .valor{font-size:30px;font-weight:800;margin:3px 0 12px}
      .mini-fin-v21{display:grid;grid-template-columns:1fr 1fr;gap:8px}.mini-fin-v21>div{background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.12);border-radius:11px;padding:9px}.mini-fin-v21 small{display:block;opacity:.72;font-size:10px}.mini-fin-v21 strong{display:block;margin-top:2px;font-size:14px}
      .grafico-v21{background:var(--card);border:1px solid var(--paper-dark);border-radius:16px;padding:15px;margin-bottom:14px;box-shadow:0 5px 18px rgba(31,42,68,.05)}
      .grafico-v21 h3{margin:0 0 10px;font-size:15px;color:var(--ink)}
      .grafico-area-v21{position:relative;min-height:190px}.grafico-area-v21 svg{width:100%;height:190px;display:block;overflow:visible}
      .grafico-tooltip-v21{position:absolute;display:none;pointer-events:none;background:var(--ink);color:var(--paper);padding:7px 9px;border-radius:8px;font-size:11px;box-shadow:0 5px 15px rgba(0,0,0,.2);z-index:4;white-space:nowrap}
      .legenda-v21{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.legenda-v21 button{border:1px solid var(--paper-dark);background:var(--paper);color:var(--ink);border-radius:999px;padding:5px 8px;font-size:10px;cursor:pointer}.legenda-v21 button.ativo{background:var(--ink);color:var(--paper)}
      .periodo-v21{background:var(--card);border:1px solid var(--paper-dark);border-radius:14px;padding:12px;margin-bottom:14px}.periodo-linha-v21{display:flex;justify-content:space-between;align-items:center;gap:8px}.periodo-linha-v21 button{border:1px solid var(--paper-dark);background:var(--paper);color:var(--ink);border-radius:9px;padding:7px 11px;font-size:17px;cursor:pointer}.periodo-titulo-v21{font-weight:800;color:var(--ink);font-size:14px;text-transform:capitalize;text-align:center;flex:1}
      .entrada-row-v21{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--paper-dark)}
      .entrada-row-v21:last-child{border-bottom:0}.entrada-row-v21 strong{color:var(--credit);font-size:13px}
      @media(max-width:480px){.resumo-hero-v21 .valor{font-size:28px}.grafico-v21{padding:13px}}
    `;
    document.head.appendChild(style);
  }

  function criarInterface() {
    const resumo = document.getElementById('tela-resumo');
    if (!resumo || document.getElementById('melhorias-v21')) return;

    const versao = document.createElement('div');
    versao.className = 'cabecalho-versao-v21';
    versao.innerHTML = `<span>Gestão de Gastos</span><span class="versao-v21">${VERSAO}</span>`;
    resumo.insertBefore(versao, resumo.firstElementChild);

    const totalOriginal = resumo.querySelector('.card-total');
    const hero = document.createElement('div');
    hero.id = 'melhorias-v21';
    hero.innerHTML = `
      <div class="resumo-hero-v21">
        <div class="rotulo">Saídas no período</div>
        <div class="valor" id="saida-v21">R$ 0,00</div>
        <div class="mini-fin-v21"><div><small>Entradas</small><strong id="entrada-v21">R$ 0,00</strong></div><div><small>Saldo</small><strong id="saldo-v21">R$ 0,00</strong></div></div>
      </div>
      <div class="periodo-v21"><div class="periodo-linha-v21"><button id="mes-ant-v21" aria-label="Mês anterior">‹</button><div class="periodo-titulo-v21" id="mes-v21"></div><button id="mes-prox-v21" aria-label="Próximo mês">›</button></div></div>
      <div class="grafico-v21"><h3>Gastos por categoria</h3><div class="grafico-area-v21" id="grafico-categorias-v21"><div class="vazio">Sem dados para este período.</div></div><div class="legenda-v21" id="legenda-categorias-v21"></div></div>
      <div class="grafico-v21"><h3>Gastos dos últimos 6 meses</h3><div class="grafico-area-v21" id="grafico-meses-v21"><div class="vazio">Sem dados suficientes.</div></div></div>
      <div class="grafico-v21"><h3>Entradas do período</h3><div id="lista-entradas-v21" class="vazio">Nenhuma entrada cadastrada.</div><button class="btn-flutuante" id="nova-entrada-v21">+ Nova entrada</button></div>`;
    if (totalOriginal) totalOriginal.replaceWith(hero);
    else resumo.insertBefore(hero, resumo.firstElementChild);

    const modal = document.createElement('div');
    modal.className='modal-fundo'; modal.id='modal-entrada-v21';
    modal.innerHTML=`<div class="modal-cartao"><h3>Nova entrada</h3><div class="campo"><label>Descrição</label><input id="entrada-desc-v21" type="text" placeholder="Ex: Salário"></div><div class="campo"><label>Valor (R$)</label><input id="entrada-valor-v21" type="text" placeholder="R$ 0,00" inputmode="decimal"></div><button class="modal-salvar" id="salvar-entrada-v21">Salvar entrada</button><div class="modal-cancelar" id="cancelar-entrada-v21">Cancelar</div></div>`;
    document.querySelector('.phone').appendChild(modal);

    document.getElementById('nova-entrada-v21').onclick=()=>modal.classList.add('aberto');
    document.getElementById('cancelar-entrada-v21').onclick=()=>modal.classList.remove('aberto');
    document.getElementById('salvar-entrada-v21').onclick=()=>{
      const desc=document.getElementById('entrada-desc-v21').value.trim();
      const val=valor(document.getElementById('entrada-valor-v21').value);
      if(!desc||!val){alert('Preencha a descrição e um valor válido.');return;}
      const lista=lerEntradas(); lista.push({id:Date.now().toString(),descricao:desc,valor:val,mes:mesSelecionado(),criadoEm:new Date().toISOString()}); salvarEntradas(lista);
      document.getElementById('entrada-desc-v21').value=''; document.getElementById('entrada-valor-v21').value=''; modal.classList.remove('aberto'); renderTudo();
    };
    document.getElementById('mes-ant-v21').onclick=()=>mudarMes(-1);
    document.getElementById('mes-prox-v21').onclick=()=>mudarMes(1);

    // Formata valores monetários digitados nos novos campos.
    const inputMoeda=document.getElementById('entrada-valor-v21');
    inputMoeda.addEventListener('blur',()=>{const n=valor(inputMoeda.value);inputMoeda.value=n?moeda(n):'';});

    // Garante que os valores monetários das telas antigas continuem sempre em BRL.
    document.querySelectorAll('#tela-dividas input, #tela-metas input, #tela-gasto input, #modal-gasto input, #modal-divida input, #modal-meta input').forEach(i=>{
      if(/valor|renda/i.test(i.id||'') || /Valor|R\$/i.test(i.placeholder||'')) i.addEventListener('blur',()=>{const n=valor(i.value);if(n)i.value=moeda(n);});
    });
  }

  function mudarMes(delta){
    const [a,m]=mesSelecionado().split('-').map(Number); const d=new Date(a,m-1+delta,1); localStorage.setItem(KEY_MES,chaveMesData(d)); renderTudo();
  }

  function renderCategorias(gs){
    const box=document.getElementById('grafico-categorias-v21'), leg=document.getElementById('legenda-categorias-v21'); if(!box||!leg)return;
    const dados={}; gs.forEach(g=>{dados[g.categoria||'Outros']=(dados[g.categoria||'Outros']||0)+Number(g.valor||0)});
    const arr=Object.entries(dados).sort((a,b)=>b[1]-a[1]);
    if(!arr.length){box.innerHTML='<div class="vazio">Sem gastos para este período.</div>';leg.innerHTML='';return;}
    const total=arr.reduce((s,x)=>s+x[1],0); const w=300,h=190,cx=150,cy=95,r=61,ri=39;
    let start=-Math.PI/2, paths='';
    arr.forEach(([nome,v],i)=>{
      const ang=v/total*Math.PI*2, end=start+ang, x1=cx+r*Math.cos(start),y1=cy+r*Math.sin(start),x2=cx+r*Math.cos(end),y2=cy+r*Math.sin(end),ix1=cx+ri*Math.cos(start),iy1=cy+ri*Math.sin(start),ix2=cx+ri*Math.cos(end),iy2=cy+ri*Math.sin(end),large=ang>Math.PI?1:0;
      paths+=`<path data-cat="${esc(nome)}" d="M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${ri} ${ri} 0 ${large} 0 ${ix1} ${iy1} Z" fill="var(--brass)" opacity="${i===0?1:.78}" stroke="var(--paper)" stroke-width="2"><title>${esc(nome)} — ${moeda(v)} (${Math.round(v/total*100)}%)</title></path>`;
      start=end;
    });
    box.innerHTML=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Gastos por categoria">${paths}<text x="150" y="91" text-anchor="middle" fill="var(--ink)" font-size="12" font-weight="700">Total</text><text x="150" y="108" text-anchor="middle" fill="var(--ink)" font-size="12">${moeda(total)}</text></svg>`;
    leg.innerHTML=arr.map(([nome,v],i)=>`<button class="${i===0?'ativo':''}" data-cat-btn="${esc(nome)}">${esc(nome)} · ${moeda(v)}</button>`).join('');
    const pathsEls=[...box.querySelectorAll('path')]; const btns=[...leg.querySelectorAll('button')];
    const ativar=i=>{pathsEls.forEach((p,j)=>p.setAttribute('opacity',j===i?'1':'.22'));btns.forEach((b,j)=>b.classList.toggle('ativo',j===i));};
    pathsEls.forEach((p,i)=>{p.addEventListener('mouseenter',()=>ativar(i));p.addEventListener('click',()=>ativar(i));}); btns.forEach((b,i)=>b.onclick=()=>ativar(i));
  }

  function renderLinha(){
    const box=document.getElementById('grafico-meses-v21'); if(!box)return;
    const base=mesSelecionado(); const [a,m]=base.split('-').map(Number); const meses=[]; for(let i=5;i>=0;i--){const d=new Date(a,m-1-i,1);meses.push({chave:chaveMesData(d),rotulo:d.toLocaleDateString('pt-BR',{month:'short'}).replace('.','')});}
    const gs=window.gastos||[]; const vals=meses.map(x=>gs.filter(g=>{if(!g.data)return false;return chaveMesData(new Date(g.data))===x.chave}).reduce((s,g)=>s+Number(g.valor||0),0));
    if(!vals.some(v=>v>0)){box.innerHTML='<div class="vazio">Cadastre gastos com data para visualizar a evolução.</div>';return;}
    const w=330,h=190,pad=28,max=Math.max(...vals,1),step=(w-pad*2)/(vals.length-1); let pts=''; vals.forEach((v,i)=>{const x=pad+i*step,y=h-pad-(v/max)*(h-pad*2);pts+=`${x},${y} `});
    const dots=vals.map((v,i)=>{const x=pad+i*step,y=h-pad-(v/max)*(h-pad*2);return `<circle cx="${x}" cy="${y}" r="5" fill="var(--ink)" tabindex="0"><title>${meses[i].rotulo} — ${moeda(v)}</title></circle><text x="${x}" y="${h-8}" text-anchor="middle" fill="var(--ink-soft)" font-size="10">${meses[i].rotulo}</text>`}).join('');
    box.innerHTML=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Evolução dos gastos"><polyline points="${pts}" fill="none" stroke="var(--brass)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${dots}</svg>`;
  }

  function renderTudo(){
    const gs=gastosDoMes(), es=entradasDoMes(); const saidas=gs.reduce((s,g)=>s+Number(g.valor||0),0), entradas=es.reduce((s,e)=>s+Number(e.valor||0),0), saldo=entradas-saidas;
    const el=id=>document.getElementById(id); if(el('mes-v21'))el('mes-v21').textContent=nomeMes(mesSelecionado()); if(el('saida-v21'))el('saida-v21').textContent=moeda(saidas); if(el('entrada-v21'))el('entrada-v21').textContent=moeda(entradas); if(el('saldo-v21')){el('saldo-v21').textContent=moeda(saldo);el('saldo-v21').style.color=saldo>=0?'var(--paper)':'#ffb3b3';}
    const lista=el('lista-entradas-v21'); if(lista){lista.innerHTML=es.length?es.slice().reverse().map(e=>`<div class="entrada-row-v21"><span><strong>${esc(e.descricao)}</strong></span><strong>${moeda(e.valor)}</strong></div>`).join(''):'<div class="vazio">Nenhuma entrada cadastrada.</div>';}
    renderCategorias(gs); renderLinha();
  }

  function instalarHooks(){
    if(!window.renderResumoOriginalV21 && typeof window.renderResumo==='function'){
      window.renderResumoOriginalV21=window.renderResumo;
      window.renderResumo=function(){
        const original=window.gastos, filtrados=gastosDoMes(); window.gastos=filtrados;
        try{window.renderResumoOriginalV21();}finally{window.gastos=original;}
        renderTudo();
      };
    }
    const mostrar=window.mostrarApp;
    if(mostrar && !window.mostrarAppOriginalV21){
      window.mostrarAppOriginalV21=mostrar;
      window.mostrarApp=async function(){await window.mostrarAppOriginalV21();criarInterface();renderTudo();};
    }
  }

  function iniciar(){instalarEstilo();criarInterface();instalarHooks();renderTudo();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
  setTimeout(iniciar,500); setTimeout(iniciar,1500); setTimeout(iniciar,3000);
})();
