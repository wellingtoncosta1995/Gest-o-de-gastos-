// Melhorias da versão 2 — sem apagar os dados existentes.
(function () {
  'use strict';

  const KEY_ENTRADAS = 'gestao-gastos-entradas-v2';
  const KEY_MES = 'gestao-gastos-mes-v2';

  function moeda(v) {
    return Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
  function valor(v) {
    const s = String(v || '').trim().replace(/R\$|\s/g, '');
    const n = s.includes(',') ? Number(s.replace(/\./g, '').replace(',', '.')) : Number(s);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }
  function lerEntradas() {
    try { return JSON.parse(localStorage.getItem(KEY_ENTRADAS) || '[]'); } catch (_) { return []; }
  }
  function salvarEntradas(lista) { localStorage.setItem(KEY_ENTRADAS, JSON.stringify(lista)); }
  function mesAtual() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  }
  function mesSelecionado() { return localStorage.getItem(KEY_MES) || mesAtual(); }
  function nomeMes(chave) {
    const [ano, mes] = chave.split('-').map(Number);
    return new Date(ano, mes - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }
  function dataGasto(g) {
    if (g.data) return new Date(g.data);
    return null;
  }
  function gastosDoMes() {
    const chave = mesSelecionado();
    return (window.gastos || []).filter(g => {
      const d = dataGasto(g);
      return !d || (d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') === chave);
    });
  }
  function entradasDoMes() {
    return lerEntradas().filter(e => e.mes === mesSelecionado());
  }
  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>'"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[c]));
  }

  function instalarInterface() {
    const resumo = document.getElementById('tela-resumo');
    if (!resumo || document.getElementById('melhorias-v2')) return;

    const bloco = document.createElement('div');
    bloco.id = 'melhorias-v2';
    bloco.innerHTML = `
      <div class="card" style="margin-bottom:16px">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
          <div><div style="font-size:12px;color:var(--ink-soft)">Período</div><strong id="mes-v2" style="text-transform:capitalize;color:var(--ink)"></strong></div>
          <div style="display:flex;gap:6px">
            <button id="mes-anterior-v2" type="button" style="border:1px solid var(--paper-dark);background:var(--card);border-radius:8px;padding:7px 10px">‹</button>
            <button id="mes-proximo-v2" type="button" style="border:1px solid var(--paper-dark);background:var(--card);border-radius:8px;padding:7px 10px">›</button>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>Visão financeira</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div style="background:var(--paper-dark);border-radius:10px;padding:12px"><div style="font-size:11px;color:var(--ink-soft)">Entradas</div><strong id="entradas-v2" style="color:var(--credit);font-size:18px">R$ 0,00</strong></div>
          <div style="background:var(--paper-dark);border-radius:10px;padding:12px"><div style="font-size:11px;color:var(--ink-soft)">Saldo</div><strong id="saldo-v2" style="color:var(--ink);font-size:18px">R$ 0,00</strong></div>
        </div>
        <button class="btn-flutuante" type="button" id="nova-entrada-v2" style="margin-top:12px">+ Nova entrada</button>
      </div>
      <div class="card" id="resumo-dividas-v2"><h3>Compromissos</h3><div class="vazio">Calculando...</div></div>`;

    const total = resumo.querySelector('.card-total');
    total.insertAdjacentElement('afterend', bloco);

    const modal = document.createElement('div');
    modal.className = 'modal-fundo';
    modal.id = 'modal-entrada-v2';
    modal.innerHTML = `<div class="modal-cartao"><h3>Nova entrada</h3>
      <div class="campo"><label>Descrição</label><input id="entrada-desc-v2" type="text" placeholder="Ex: Salário"></div>
      <div class="campo"><label>Valor (R$)</label><input id="entrada-valor-v2" type="text" placeholder="0,00" inputmode="decimal"></div>
      <button class="modal-salvar" type="button" id="salvar-entrada-v2">Salvar entrada</button>
      <div class="modal-cancelar" id="cancelar-entrada-v2">Cancelar</div></div>`;
    document.querySelector('.phone').appendChild(modal);

    document.getElementById('nova-entrada-v2').onclick = () => modal.classList.add('aberto');
    document.getElementById('cancelar-entrada-v2').onclick = () => modal.classList.remove('aberto');
    document.getElementById('salvar-entrada-v2').onclick = () => {
      const desc = document.getElementById('entrada-desc-v2').value.trim();
      const val = valor(document.getElementById('entrada-valor-v2').value);
      if (!desc || !val) { alert('Preencha a descrição e um valor válido.'); return; }
      const lista = lerEntradas();
      lista.push({ id: Date.now().toString(), descricao: desc, valor: val, mes: mesSelecionado(), criadoEm: new Date().toISOString() });
      salvarEntradas(lista);
      document.getElementById('entrada-desc-v2').value = '';
      document.getElementById('entrada-valor-v2').value = '';
      modal.classList.remove('aberto');
      renderMelhorias();
    };

    function mudarMes(delta) {
      const [a, m] = mesSelecionado().split('-').map(Number);
      const d = new Date(a, m - 1 + delta, 1);
      localStorage.setItem(KEY_MES, d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'));
      renderMelhorias();
      if (typeof window.renderResumoOriginalV2 === 'function') window.renderResumoOriginalV2();
    }
    document.getElementById('mes-anterior-v2').onclick = () => mudarMes(-1);
    document.getElementById('mes-proximo-v2').onclick = () => mudarMes(1);

    // Mantém uma cópia da função original e passa a usar apenas o mês selecionado no resumo.
    if (!window.renderResumoOriginalV2) window.renderResumoOriginalV2 = window.renderResumo;
    window.renderResumo = function () {
      const listaOriginal = window.gastos;
      const filtrados = gastosDoMes();
      window.gastos = filtrados;
      try { window.renderResumoOriginalV2(); } finally { window.gastos = listaOriginal; }
      renderMelhorias();
    };
  }

  function renderMelhorias() {
    const mes = document.getElementById('mes-v2');
    if (!mes) return;
    const gs = gastosDoMes();
    const es = entradasDoMes();
    const totalSaidas = gs.reduce((s, g) => s + Number(g.valor || 0), 0);
    const totalEntradas = es.reduce((s, e) => s + Number(e.valor || 0), 0);
    mes.textContent = nomeMes(mesSelecionado());
    document.getElementById('entradas-v2').textContent = moeda(totalEntradas);
    const saldo = totalEntradas - totalSaidas;
    const saldoEl = document.getElementById('saldo-v2');
    saldoEl.textContent = moeda(saldo);
    saldoEl.style.color = saldo >= 0 ? 'var(--credit)' : 'var(--debit)';

    const compromissos = document.getElementById('resumo-dividas-v2');
    if (compromissos) {
      const ds = window.dividas || [];
      const pendentes = ds.filter(d => Number(d.parcelas_pagas || 0) < Number(d.parcelas_total || 0));
      const parcelaMensal = pendentes.reduce((s, d) => s + (Number(d.valor_total || 0) / Math.max(Number(d.parcelas_total || 1), 1)), 0);
      compromissos.innerHTML = `<h3>Compromissos</h3><div style="display:flex;justify-content:space-between;gap:10px"><span style="color:var(--ink-soft);font-size:13px">Parcelas pendentes</span><strong style="color:var(--brass-dark)">${pendentes.length}</strong></div><div style="display:flex;justify-content:space-between;gap:10px;margin-top:6px"><span style="color:var(--ink-soft);font-size:13px">Valor estimado das parcelas</span><strong style="color:var(--ink)">${moeda(parcelaMensal)}</strong></div>`;
    }
  }

  function iniciar() {
    instalarInterface();
    renderMelhorias();
    // A função original pode ser chamada antes da melhoria estar instalada; reaplica ao entrar no resumo.
    const antigoMostrarApp = window.mostrarApp;
    if (antigoMostrarApp && !window.mostrarAppV2) {
      window.mostrarAppV2 = antigoMostrarApp;
      window.mostrarApp = async function () { await window.mostrarAppV2(); instalarInterface(); renderMelhorias(); };
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
  setTimeout(iniciar, 700);
  setTimeout(iniciar, 1800);
})();
