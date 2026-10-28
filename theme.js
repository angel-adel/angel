// theme.js
const toggleBtn = document.getElementById('themeToggle');
const htmlEl = document.documentElement;

// Проверяем сохраненную тему
const savedTheme = localStorage.getItem('theme') || 'light';
htmlEl.setAttribute('data-theme', savedTheme);
if (toggleBtn) toggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

// Переключение
if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        toggleBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
}
