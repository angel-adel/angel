const menuItems = [
    { name: "🏠 Главная", link: "index.html" },
    { name: "📖 Произведения", link: "works.html" },
    { name: "🖼️ Галерея", link: "gallery.html" },
    { name: "😄 Крылатый юмор", link: "humor.html" },
    { name: "📝 Проза", link: "prose.html" },
    { name: "✍️ Блог Крылатой", link: "blog.html" },
    { name: "📋 Гостевая книга", link: "guestbook.html" },
    { name: "📦 Заказать", link: "order.html" },
    { name: "👤 Об авторе", link: "about.html" },
    { name: "📞 Контакты", link: "contacts.html" },
    { name: "💾 Скачать", link: "download.html" }
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

document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    initBurger();
});
