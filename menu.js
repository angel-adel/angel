// menu.js — бургер-меню для телефонов
document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('menuToggle');
    const nav = document.querySelector('nav');
    
    if (toggleBtn && nav) {
        // Убираем возможные дубли
        const newBtn = toggleBtn.cloneNode(true);
        toggleBtn.parentNode.replaceChild(newBtn, toggleBtn);
        
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            nav.classList.toggle('open');
            newBtn.textContent = nav.classList.contains('open') ? '✕' : '☰';
        });
        
        // Закрываем меню при клике на ссылку
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                newBtn.textContent = '☰';
            });
        });
    }
});
