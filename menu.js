// menu.js — мобильное меню
(function() {
    function initMenu() {
        const toggle = document.getElementById('menuToggle');
        const nav = document.querySelector('nav');
        if (!toggle || !nav) return;
        if (toggle._initDone) return;
        toggle._initDone = true;
        
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            nav.classList.toggle('open');
            toggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
        });
        
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                if (toggle) toggle.textContent = '☰';
            });
        });
    }
    
    document.addEventListener('DOMContentLoaded', initMenu);
    setTimeout(initMenu, 200);
})();
