// Мобильное меню — бургер
document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('menuToggle');
    const nav = document.querySelector('nav');
    
    // Проверяем, существуют ли элементы
    if (toggleBtn && nav) {
        // Убираем возможные старые обработчики
        const newToggle = toggleBtn.cloneNode(true);
        toggleBtn.parentNode.replaceChild(newToggle, toggleBtn);
        
        newToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            nav.classList.toggle('open');
            
            // Меняем иконку (☰ → ✕)
            if (nav.classList.contains('open')) {
                newToggle.textContent = '✕';
                newToggle.style.fontSize = '28px';
            } else {
                newToggle.textContent = '☰';
            }
        });
    }
    
    // Закрываем меню при клике на ссылку
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const nav = document.querySelector('nav');
            const toggleBtn = document.getElementById('menuToggle');
            if (nav && nav.classList.contains('open')) {
                nav.classList.remove('open');
                if (toggleBtn) toggleBtn.textContent = '☰';
            }
        });
    });
});
