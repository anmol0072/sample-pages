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

  // 2. Password Toggle
  const togglePasswordBtn = document.querySelector('.toggle-password');
  const passwordInput = document.querySelector('input[type="password"]');

  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      
      // Toggle icon visually (slash vs no slash)
      if (type === 'text') {
        togglePasswordBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
      } else {
        togglePasswordBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
      }
    });
  }

  // 3. Form Validation and Mock Submit
  const authForm = document.querySelector('.auth-form');
  const submitBtn = document.querySelector('.submit-btn');

  if (authForm && submitBtn) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.querySelector('#email')?.value || '';
      const pwd = document.querySelector('#password')?.value || '';
      const name = document.querySelector('#name')?.value; // for signup

      if (!email.includes('@')) {
        showToast('Please enter a valid email address.', 'error');
        return;
      }
      if (pwd.length < 6) {
        showToast('Password must be at least 6 characters.', 'error');
        return;
      }

      // Simulate loading
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Processing...';
      submitBtn.style.opacity = '0.7';
      submitBtn.disabled = true;

      setTimeout(() => {
        showToast('Authentication successful! Redirecting...', 'success');
        setTimeout(() => {
          // Fake redirect back to index or docs
          window.location.href = '../docs/index.html';
        }, 1500);
      }, 1500);
    });
  }

  // 4. Social Buttons
  const socialBtns = document.querySelectorAll('.social-btn');
  socialBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      let provider = 'provider';
      if (btn.querySelector('img')) {
         provider = btn.querySelector('img').alt;
      } else if (btn.querySelector('span')) {
         provider = btn.querySelector('span').textContent;
      }
      
      showToast(`Redirecting to ${provider} authentication...`, 'info');
    });
  });

  // Inject styles for toasts
  const style = document.createElement('style');
  style.textContent = `
    .toast-container { position: fixed; top: 30px; right: 30px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; }
    .toast { background: white; border: 1px solid #e2e8f0; padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); transform: translateY(-20px); opacity: 0; transition: all 0.3s ease; font-size: 0.9rem; font-weight: 500; color: #0F172A;}
    .toast.show { transform: translateY(0); opacity: 1; }
    .toast-success { border-left: 4px solid #10B981; }
    .toast-error { border-left: 4px solid #EF4444; }
    .toast-info { border-left: 4px solid #5A32FA; }
  `;
  document.head.appendChild(style);
});
