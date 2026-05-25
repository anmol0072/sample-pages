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

  // 2. Category Filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  const articleCards = document.querySelectorAll('.article-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterType = btn.textContent.trim().toUpperCase();

      // Filter articles
      articleCards.forEach(card => {
        const categoryLabel = card.querySelector('.category').textContent.trim().toUpperCase();
        if (filterType === 'ALL' || categoryLabel === filterType) {
          card.style.display = 'flex';
          // Little animation reset
          card.style.animation = 'none';
          card.offsetHeight; /* trigger reflow */
          card.style.animation = null; 
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Sidebar Topics acting as filters
  const topicLinks = document.querySelectorAll('.topic-list a');
  topicLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const textNode = Array.from(link.querySelector('span.flex').childNodes).find(n => n.nodeType === Node.TEXT_NODE);
      if (textNode) {
        const topicName = textNode.textContent.trim().toUpperCase();
        
        // Find matching filter button
        const matchedBtn = Array.from(filterBtns).find(btn => btn.textContent.trim().toUpperCase() === topicName || (topicName === 'AI AGENTS' && btn.textContent === 'Product'));
        if (matchedBtn) {
          matchedBtn.click();
          // Scroll up to filters
          document.querySelector('.filters-section').scrollIntoView({ behavior: 'smooth' });
        } else {
          showToast(`Filtered by ${topicName}`, 'info');
        }
      }
    });
  });

  // 3. Search Button
  const searchBtn = document.querySelector('.search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const existingInput = document.querySelector('.search-popup');
      if (existingInput) {
        existingInput.remove();
      } else {
        const popup = document.createElement('div');
        popup.className = 'search-popup';
        popup.innerHTML = `<input type="text" placeholder="Search blog..." class="search-input">`;
        
        // Positioning it below the header
        popup.style.position = 'absolute';
        popup.style.top = '70px';
        popup.style.right = '20px';
        popup.style.background = 'white';
        popup.style.padding = '10px';
        popup.style.borderRadius = '8px';
        popup.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
        popup.style.zIndex = '1000';
        
        document.body.appendChild(popup);
        const input = popup.querySelector('input');
        input.focus();

        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            showToast(`Searching for "${input.value}"...`, 'info');
            popup.remove();
          }
        });

        // Close on click outside
        document.addEventListener('click', function closePopup(e) {
          if (!searchBtn.contains(e.target) && !popup.contains(e.target)) {
            popup.remove();
            document.removeEventListener('click', closePopup);
          }
        });
      }
    });
  }

  // 4. Newsletter Subscription
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (input.value) {
        showToast('Successfully subscribed to the newsletter!', 'success');
        input.value = '';
      }
    });
  }

  // 5. Load More Button
  const loadMoreBtn = document.querySelector('.load-more .btn');
  const articleList = document.querySelector('.article-list');
  if (loadMoreBtn && articleList) {
    loadMoreBtn.addEventListener('click', () => {
      const originalText = loadMoreBtn.textContent;
      loadMoreBtn.textContent = 'Loading...';
      loadMoreBtn.style.opacity = '0.7';

      setTimeout(() => {
        // Clone first two articles to simulate loading
        if (articleCards.length >= 2) {
          const clone1 = articleCards[0].cloneNode(true);
          const clone2 = articleCards[1].cloneNode(true);
          articleList.appendChild(clone1);
          articleList.appendChild(clone2);
          showToast('Loaded more articles', 'success');
        }
        loadMoreBtn.textContent = originalText;
        loadMoreBtn.style.opacity = '1';
      }, 1000);
    });
  }

  // Injecting styles for toasts and search so we don't need to mess with style.css heavily
  const style = document.createElement('style');
  style.textContent = `
    .toast-container { position: fixed; bottom: 30px; right: 30px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; }
    .toast { background: white; border: 1px solid #e2e8f0; padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); transform: translateY(20px); opacity: 0; transition: all 0.3s ease; font-size: 0.9rem; font-weight: 500; }
    .toast.show { transform: translateY(0); opacity: 1; }
    .toast-success { border-left: 4px solid #10B981; }
    .toast-info { border-left: 4px solid #5A32FA; }
    .search-input { border: 1px solid #e2e8f0; padding: 10px 15px; border-radius: 6px; outline: none; width: 250px; }
    .search-input:focus { border-color: #5A32FA; }
  `;
  document.head.appendChild(style);

  // Generic Button Catch
  const actionLinks = document.querySelectorAll('a.btn, a.nav-link, a.featured-article, a.article-card');
  actionLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.getAttribute('href') === '#') {
        e.preventDefault();
        showToast('Navigating to content...', 'success');
      }
    });
  });
});
