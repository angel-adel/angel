// menu.js — бургер-меню для телефонов
(function() {
    function initMenu() {
        const toggle = document.getElementById('menuToggle');
        const nav = document.querySelector('nav');
        
        if (!toggle || !nav) {
            // Если элементов нет — пробуем ещё раз через 0.2 секунды
            setTimeout(initMenu, 200);
            return;
        }
        
        // Защита от двойной инициализации
        if (toggle._initDone) return;
        toggle._initDone = true;
        
        // Открыть/закрыть меню
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            nav.classList.toggle('open');
            toggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
        });
        
        // Закрыть меню при клике на ссылку
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                if (toggle) toggle.textContent = '☰';
            });
        });
    }
    
    // Запускаем после загрузки DOM и ещё раз чуть позже
    document.addEventListener('DOMContentLoaded', initMenu);
    setTimeout(initMenu, 300);
})();
