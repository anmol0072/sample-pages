document.addEventListener('DOMContentLoaded', () => {
  const toggleBtns = document.querySelectorAll('.toggle-btn');
  const prices = document.querySelectorAll('.price');

  // Hardcoded prices for Monthly / Yearly
  const planPrices = {
    monthly: ['Free', '$29<span>/mo</span>', '$79<span>/mo</span>', '$199<span>/mo</span>'],
    yearly: ['Free', '$288<span>/yr</span>', '$768<span>/yr</span>', '$1908<span>/yr</span>']
  };

  toggleBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      // Remove active class from all
      toggleBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked
      btn.classList.add('active');

      const isYearly = btn.textContent.includes('Yearly');
      
      // Update prices
      prices.forEach((priceEl, idx) => {
        if (idx > 0) { // Skip 'Free' layout adjustment, but index 0 is Free. 
            // Wait, prices array includes Explorer, Builder, Studio, Scale.
            priceEl.innerHTML = isYearly ? planPrices.yearly[idx] : planPrices.monthly[idx];
        }
      });
    });
  });

  // FAQ Toggle
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon');
      
      // Toggle open class on answer
      if (answer) {
        answer.classList.toggle('open');
      }

      if (icon.textContent === '▾') {
        icon.textContent = '▴';
      } else {
        icon.textContent = '▾';
      }
    });
  });

  // Plan Selection Logic
  const table = document.querySelector('.table');
  if (table) {
    const headers = table.querySelectorAll('th');
    // Skip the first column (Features)
    for (let i = 1; i < headers.length; i++) {
      headers[i].classList.add('selectable-col');
      headers[i].addEventListener('click', () => selectPlan(i));
    }
  }

  function selectPlan(colIndex) {
    // Remove selected class from all columns
    const allCells = table.querySelectorAll('th, td');
    allCells.forEach(cell => cell.classList.remove('selected-plan'));

    // Add selected class to the clicked column
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      const cells = row.children;
      if (cells.length > colIndex) {
        cells[colIndex].classList.add('selected-plan');
        cells[colIndex].classList.add('selectable-col');
      }
    });
    
    // Update CTA button text
    const ctaRow = document.querySelector('.cta-row');
    if (ctaRow) {
        const ctaCells = ctaRow.querySelectorAll('td');
        for (let i = 1; i < ctaCells.length; i++) {
            const btn = ctaCells[i].querySelector('a');
            if (btn) {
                // reset text to original if it's not selected
                if (i !== colIndex) {
                    if (btn.dataset.originalText) btn.textContent = btn.dataset.originalText;
                } else {
                    if (!btn.dataset.originalText) btn.dataset.originalText = btn.textContent;
                    btn.textContent = 'Selected ✓';
                }
            }
        }
    }
  }

  // 1. Toast Notification System
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    .toast-container { position: fixed; bottom: 30px; right: 30px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; }
    .toast { background: white; border: 1px solid #e2e8f0; padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); transform: translateY(20px); opacity: 0; transition: all 0.3s ease; font-size: 0.9rem; font-weight: 500; color: #0F172A;}
    .toast.show { transform: translateY(0); opacity: 1; }
    .toast-success { border-left: 4px solid #10B981; }
    .toast-info { border-left: 4px solid #5A32FA; }
  `;
  document.head.appendChild(style);

  // Generic Button Catch
  const actionLinks = document.querySelectorAll('a.btn, a.link-btn, a.nav-link');
  actionLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.getAttribute('href') === '#') {
        e.preventDefault();
        showToast('Action registered. Moving to next step...', 'success');
      }
    });
  });
});
