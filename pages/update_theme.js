const fs = require('fs');
const path = require('path');

const pagesDir = 'c:/Users/91985/Desktop/oneatlas/pages';
const subdirs = ['blog', 'pricing', 'signin', 'signup', 'support'];

const toggleHTML = `
        <button class="theme-toggle" aria-label="Toggle Dark Mode" title="Toggle Dark Mode" style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:var(--color-bg);border:1px solid var(--color-border);color:var(--color-text-muted);cursor:pointer;transition:all 0.2s ease;margin-left:1rem;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        </button>
      </nav>`;

const scriptHTML = `<script src="../../shared/js/theme.js"></script>\n</body>`;

subdirs.forEach(dir => {
  const file = path.join(pagesDir, dir, 'index.html');
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    if (!content.includes('class="theme-toggle"')) {
      content = content.replace(/<\/nav>/, toggleHTML);
      // Also fix the flex classes of nav so they align centrally
      content = content.replace(/<nav class="nav flex gap-8">/, '<nav class="nav flex gap-8 items-center">');
    }
    
    if (!content.includes('theme.js')) {
      content = content.replace(/<\/body>/, scriptHTML);
    }
    
    fs.writeFileSync(file, content);
    console.log('Updated ' + dir);
  }
});
