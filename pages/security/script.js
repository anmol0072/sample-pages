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

  // 2. Interactive Flow Diagram
  const flowSteps = document.querySelectorAll('.flow-step');
  const stepMessages = {
    'Client': 'Client request initiated over TLS 1.3.',
    'Edge': 'Request received at edge location. WAF rules evaluated.',
    'Routing': 'Intelligent routing determines optimal isolated runtime.',
    'Runtime': 'Request executed inside a microVM with strict network boundaries.',
    'Datastore': 'Data accessed via encrypted connection with Row-Level Security.',
    'Observability': 'Execution logged to secure audit trail.'
  };

  flowSteps.forEach(step => {
    step.style.cursor = 'pointer';
    step.addEventListener('click', () => {
      // Remove active from all
      flowSteps.forEach(s => {
        s.classList.remove('active-step');
        const icon = s.querySelector('.flow-icon');
        if (icon) {
          icon.classList.remove('bg-primary', 'text-white');
        }
      });
      
      // Add active to clicked
      step.classList.add('active-step');
      const icon = step.querySelector('.flow-icon');
      if (icon) {
        icon.classList.add('bg-primary', 'text-white');
      }

      // Show toast
      const stepName = step.querySelector('span').textContent.trim();
      if (stepMessages[stepName]) {
        showToast(stepMessages[stepName], 'success');
      }
    });
  });

  // 3. Badges and Features
  const features = document.querySelectorAll('.f-box, .f-card, .badge-outline');
  features.forEach(feature => {
    feature.style.cursor = 'pointer';
    feature.addEventListener('click', () => {
      let name = feature.querySelector('h4') || feature.querySelector('strong') || feature;
      showToast(`More info on: ${name.textContent.trim()} coming soon.`, 'info');
    });
  });

  // 4. Action Buttons
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.tagName === 'A' && btn.getAttribute('href') === '#') {
        e.preventDefault();
        showToast('Redirecting to secure signup portal...', 'success');
      }
    });
  });

  // Inject toast styles
  const style = document.createElement('style');
  style.textContent = `
    .toast-container { position: fixed; bottom: 30px; right: 30px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; }
    .toast { background: white; border: 1px solid #e2e8f0; padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); transform: translateY(20px); opacity: 0; transition: all 0.3s ease; font-size: 0.9rem; font-weight: 500; color: #0F172A;}
    .toast.show { transform: translateY(0); opacity: 1; }
    .toast-success { border-left: 4px solid #10B981; }
    .toast-info { border-left: 4px solid #5A32FA; }
  `;
  document.head.appendChild(style);
});
