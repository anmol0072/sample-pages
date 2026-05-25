document.addEventListener('DOMContentLoaded', () => {
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

  // 2. Mock Search Suggestion
  const searchInput = document.querySelector('.search-box input');
  if (searchInput) {
    const suggestionBox = document.createElement('div');
    suggestionBox.className = 'search-suggestions';
    suggestionBox.style.display = 'none';
    searchInput.parentNode.appendChild(suggestionBox);

    searchInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (val.length > 1) {
        suggestionBox.style.display = 'block';
        suggestionBox.innerHTML = `
          <div class="suggestion-item">How to deploy <strong>${val}</strong></div>
          <div class="suggestion-item">Troubleshooting <strong>${val}</strong> errors</div>
          <div class="suggestion-item">Billing for <strong>${val}</strong></div>
        `;

        const items = suggestionBox.querySelectorAll('.suggestion-item');
        items.forEach(item => {
          item.addEventListener('click', () => {
            searchInput.value = item.textContent;
            suggestionBox.style.display = 'none';
            showToast(`Loading article: ${item.textContent}`, 'success');
          });
        });
      } else {
        suggestionBox.style.display = 'none';
      }
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.parentNode.contains(e.target)) {
        suggestionBox.style.display = 'none';
      }
    });
  }

  // 3. Fake navigation for all cards and links
  const clickableCards = document.querySelectorAll('.action-card, .topic-card, .article-item, .link-primary');
  clickableCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const title = card.querySelector('h3, h4, span') ? (card.querySelector('h3, h4, span').textContent.trim() || 'Topic') : 'Link';
      showToast(`Navigating to: ${title}...`, 'info');
      
      // small scale animation
      card.style.transform = 'scale(0.98)';
      setTimeout(() => card.style.transform = '', 150);
    });
  });

  // 4. Contact Support Button
  const submitRequestBtn = document.querySelector('.help-card .btn-primary');
  if (submitRequestBtn) {
    submitRequestBtn.addEventListener('click', () => {
      const originalText = submitRequestBtn.textContent;
      submitRequestBtn.textContent = 'Opening portal...';
      submitRequestBtn.style.opacity = '0.7';
      
      setTimeout(() => {
        showToast('Support portal opened in a new window.', 'success');
        submitRequestBtn.textContent = originalText;
        submitRequestBtn.style.opacity = '1';
      }, 1000);
    });
  }

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    .toast-container { position: fixed; bottom: 30px; right: 30px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; }
    .toast { background: white; border: 1px solid #e2e8f0; padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); transform: translateY(20px); opacity: 0; transition: all 0.3s ease; font-size: 0.9rem; font-weight: 500; color: #0F172A;}
    .toast.show { transform: translateY(0); opacity: 1; }
    .toast-success { border-left: 4px solid #10B981; }
    .toast-info { border-left: 4px solid #5A32FA; }

    .search-box { position: relative; }
    .search-suggestions { position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); z-index: 100; margin-top: 10px; overflow: hidden; text-align: left;}
    .suggestion-item { padding: 12px 20px; cursor: pointer; border-bottom: 1px solid #f1f5f9; color: var(--color-text); font-size: 0.95rem; transition: background 0.2s;}
    .suggestion-item:last-child { border-bottom: none; }
    .suggestion-item:hover { background: #f8fafc; color: var(--color-primary); }
    .suggestion-item strong { color: var(--color-primary); }
  `;
  document.head.appendChild(style);
});
