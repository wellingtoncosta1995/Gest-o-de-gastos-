/* Ajustes visuais seguros, sem alterar dados ou funcionalidades. */
(function () {
  const norm = s => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
  const icons = {
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-4.2v-6.3H8.7V21H4.5A1.5 1.5 0 0 1 3 19.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    card: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 10h18M7 15h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    invest: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5M4 19h16M7 15l4-4 3 2 5-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  function enhance() {
    document.querySelectorAll('.tab').forEach((tab, index) => {
      const text = norm(tab.textContent);
      let type = index === 0 ? 'home' : index === 1 ? 'card' : index === 2 ? 'invest' : null;
      if (text.includes('resumo')) {
        tab.querySelectorAll('*').forEach(el => {
          if (!el.children.length && norm(el.textContent) === 'resumo') el.textContent = 'Home';
        });
        type = 'home';
      }
      const icon = tab.querySelector('.icone');
      if (icon && type && icon.dataset.modernized !== type) {
        icon.innerHTML = icons[type] || icon.innerHTML;
        icon.dataset.modernized = type;
      }
    });

    document.querySelectorAll('.top-header').forEach(header => {
      if (norm(header.textContent).includes('gestão de gastos') || norm(header.textContent).includes('gestao de gastos')) {
        header.classList.add('compact-management-card');
      }
    });

    document.querySelectorAll('.card').forEach(card => {
      const text = norm(card.textContent);
      if (text.includes('orçamento do mês') || text.includes('orcamento do mes')) {
        card.classList.add('budget-modern-card');
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enhance);
  else enhance();
  setTimeout(enhance, 500);
})();
