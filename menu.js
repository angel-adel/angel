const menuItems = [
    { name: "Главная", link: "index.html" },
    { name: "Об авторе", link: "about.html" },
    { name: "Произведения", link: "portfolio.html" },
    { name: "Галерея", link: "gallery.html" },
    { name: "Крылатый юмор", link: "witty_humor.html" },
    { name: "Заказать", link: "order.html" },
    { name: "Гостевая книга", link: "guestbook.html" },
    { name: "Контакты", link: "contacts.html" },
    { name: "Скачать", link: "download.html" },
    { name: "Блог Крылатой", link: "blog.html" }
];

function renderMenu() {
    const container = document.getElementById('navLinks');
    if (!container) return;
    container.innerHTML = menuItems.map(item => 
        `<li><a href="${item.link}">${item.name}</a></li>`
    ).join('');
}

function initBurger() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    if (!burger || !nav) return;

    burger.addEventListener('click', () => {
        nav.classList.toggle('active');
        burger.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            burger.classList.remove('active');
        });
    });
}

function initBugWidget() {
    const btn = document.getElementById('bugWidget');
    const content = document.getElementById('bugWidgetContent');
    if (btn && content) {
        btn.addEventListener('click', () => {
            content.classList.toggle('active');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    initBurger();
    initBugWidget();
});
