document.addEventListener('DOMContentLoaded', () => {
  const themeToggles = document.querySelectorAll('.theme-toggle');
  
  let isDark = localStorage.getItem('theme') === 'dark';
  
  const applyTheme = (dark) => {
    if(dark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };
  
  // Apply initially
  applyTheme(isDark);
  
  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      isDark = !isDark;
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      applyTheme(isDark);
      
      // If there's a toast function on the page
      if (typeof showToast === 'function') {
        showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled', 'info');
      }
    });
  });
});
