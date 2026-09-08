/* Ajustes visuais e de navegação sem alterar dados ou funcionalidades do app. */
(function () {
  const norm = s => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();

  const icons = {
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-4.2v-6.3H8.7V21H4.5A1.5 1.5 0 0 1 3 19.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    card: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 10h18M7 15h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    invest: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5M4 19h16M7 15l4-4 3 2 5-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  function closestContainer(el) {
    return el.closest('.card,.top-header,.dashboard-card,.section-card,.panel') || el.parentElement;
  }

  function enhance() {
    document.querySelectorAll('.tab').forEach((tab, index) => {
      const original = norm(tab.textContent);
      let type = index === 0 ? 'home' : index === 1 ? 'card' : index === 2 ? 'invest' : null;
      if (original.includes('resumo')) {
        tab.querySelectorAll('*').forEach(child => {
          if (child.children.length === 0 && norm(child.textContent) === 'resumo') child.textContent = 'Home';
        });
        if (norm(tab.textContent).includes('resumo')) {
          tab.childNodes.forEach(node => { if (node.nodeType === 3 && norm(node.textContent) === 'resumo') node.textContent = 'Home'; });
        }
        type = 'home';
      }
      const icon = tab.querySelector('.icone');
      if (icon && type && !icon.dataset.modernized) {
        icon.innerHTML = icons[type];
        icon.dataset.modernized = 'true';
      }
    });

    document.querySelectorAll('h1,h2,h3,h4,h5,p,span,strong,b,div').forEach(el => {
      if (el.children.length > 2) return;
      const text = norm(el.textContent);
      if (text === 'gestão de gastos' || text === 'gestao de gastos') {
        closestContainer(el)?.classList.add('compact-management-card');
      }
      if (text === 'orçamento do mês' || text === 'orcamento do mes') {
        const card = closestContainer(el);
        if (card) card.classList.add('budget-modern-card');
      }
    });

    document.querySelectorAll('.card,.budget-modern-card').forEach(card => {
      if (norm(card.textContent).includes('orçamento do mês') || norm(card.textContent).includes('orcamento do mes')) {
        card.classList.add('budget-modern-card');
      }
    });
  }

  const start = () => {
    enhance();
    const observer = new MutationObserver(() => enhance());
    observer.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
