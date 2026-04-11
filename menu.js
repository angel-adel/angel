// Загрузка шапки и настройка гамбургера
fetch('header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('mainHeader').innerHTML = data;
        
        const menuToggle = document.getElementById('menuToggle');
        const mainMenu = document.getElementById('mainMenu');
        
        if (menuToggle && mainMenu) {
            menuToggle.addEventListener('click', () => mainMenu.classList.toggle('show'));
            mainMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 768) mainMenu.classList.remove('show');
                });
            });
        }
    })
    .catch(error => console.error('Ошибка загрузки шапки:', error));
