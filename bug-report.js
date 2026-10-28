(function() {
    // ==========================================
    // 1. ЗАГРУЗКА HTML2CANVAS (для скриншотов)
    // ==========================================
    function loadHtml2Canvas() {
        return new Promise((resolve, reject) => {
            if (typeof html2canvas !== 'undefined') {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async function captureScreenshot() {
        await loadHtml2Canvas();
        try {
            const canvas = await html2canvas(document.body, {
                scale: 1.5,
                backgroundColor: '#f5f0ff',
                logging: false,
                useCORS: true,
                allowTaint: false
            });
            return canvas.toDataURL('image/png');
        } catch (err) {
            console.error('Ошибка скриншота:', err);
            return null;
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    function generateReportHTML(description, screenshotDataUrl, pageInfo) {
        return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Баг-репорт — Адель</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f0ff; padding: 2rem; line-height: 1.5; }
        .report { max-width: 1000px; margin: 0 auto; background: white; border-radius: 24px; padding: 2rem; box-shadow: 0 8px 28px rgba(0,0,0,0.08); border: 1px solid #e9e0f5; }
        h1 { color: #9b59b6; font-size: 1.8rem; margin-bottom: 1rem; }
        .meta { background: #f9f5ff; padding: 1rem; border-radius: 16px; margin: 1rem 0; }
        .description { background: #fff9e8; padding: 1rem; border-radius: 16px; margin: 1rem 0; border-left: 4px solid #9b59b6; }
        img { max-width: 100%; border-radius: 16px; border: 1px solid #e9e0f5; margin: 1rem 0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        hr { margin: 1.5rem 0; border: none; border-top: 1px solid #e9e0f5; }
        .footer { text-align: center; color: #6b5b7e; font-size: 0.85rem; margin-top: 1.5rem; }
    </style>
</head>
<body>
<div class="report">
    <h1>🐞 Баг-репорт / Ошибка на сайте</h1>
    <p><strong>Сайт:</strong> Ádel — Ангел Поэзии</p>
    <p><strong>Страница:</strong> <a href="${pageInfo.url}">${escapeHtml(pageInfo.url)}</a></p>
    <p><strong>Время:</strong> ${new Date().toLocaleString()}</p>
    <div class="meta">
        <strong>📱 Техническая информация:</strong><br>
        Браузер: ${navigator.userAgent}<br>
        Разрешение экрана: ${window.innerWidth}×${window.innerHeight}<br>
        ОС: ${navigator.platform}
    </div>
    <div class="description">
        <strong>📝 Описание проблемы:</strong><br>
        ${escapeHtml(description) || 'Не указано'}
    </div>
    <strong>📸 Скриншот страницы:</strong><br>
    <img src="${screenshotDataUrl}" alt="Скриншот страницы с ошибкой">
    <hr>
    <div class="footer">
        📧 Отправьте этот файл на почту: <strong>adel.angel2026@gmail.com</strong><br>
        ✨ Спасибо, что помогаете сделать сайт лучше!
    </div>
</div>
</body>
</html>`;
    }

    function downloadReport(description, screenshotDataUrl, pageInfo) {
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `bugreport_adel_${timestamp}.html`;
        const htmlContent = generateReportHTML(description, screenshotDataUrl, pageInfo);
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return filename;
    }

    // ==========================================
    // 2. ЛОГИКА ТЕМЫ
    // ==========================================
    function initTheme() {
        const htmlEl = document.documentElement;
        const savedTheme = localStorage.getItem('theme') || 'light';
        htmlEl.setAttribute('data-theme', savedTheme);

        // Возвращаем иконку для кнопки темы
        return savedTheme;
    }

    function toggleTheme() {
        const htmlEl = document.documentElement;
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        return newTheme;
    }

    // ==========================================
    // 3. СОЗДАНИЕ ИНТЕРФЕЙСА ВИДЖЕТА
    // ==========================================
    function createWidget() {
        // Проверяем, нет ли уже виджета на странице
        if (document.getElementById('universalWidget')) return;

        // HTML-структура виджета
        const widgetHtml = `
            <div id="universalWidget">
                <!-- Главная кнопка -->
                <div class="uw-main-btn" id="uwMainBtn">⚙️</div>
                
                <!-- Меню -->
                <div class="uw-menu" id="uwMenu">
                    <button class="uw-menu-item" id="uwThemeBtn">🌙 Сменить тему</button>
                    <button class="uw-menu-item" id="uwBugBtn">🐞 Баг-репорт</button>
                </div>

                <!-- Окно баг-репорта -->
                <div class="uw-bug-box" id="uwBugBox">
                    <h3>🐞 Сообщить о проблеме</h3>
                    <textarea id="uwBugText" placeholder="Опишите, что пошло не так..." rows="3"></textarea>
                    <button id="uwScreenshotBtn">📸 Сделать скриншот и скачать отчёт</button>
                    <small>Файл отправьте на adel.angel2026@gmail.com</small>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', widgetHtml);

        // --- Стили (добавляем прямо в head) ---
        const style = document.createElement('style');
        style.textContent = `
            #universalWidget { position: fixed; bottom: 20px; right: 20px; z-index: 10000; font-family: system-ui, sans-serif; }
            .uw-main-btn { width: 50px; height: 50px; border-radius: 50%; background: var(--accent, #7c3a8c); color: white; display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: transform 0.2s; }
            .uw-main-btn:hover { transform: scale(1.1); }
            .uw-menu { display: none; position: absolute; bottom: 60px; right: 0; background: var(--bg-card, white); border: 1px solid var(--border, #ddd); border-radius: 12px; padding: 5px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); flex-direction: column; gap: 5px; min-width: 180px; }
            .uw-menu.active { display: flex; }
            .uw-menu-item { background: transparent; border: none; text-align: left; padding: 10px 15px; cursor: pointer; border-radius: 8px; font-size: 14px; color: var(--text-primary, #333); transition: background 0.2s; }
            .uw-menu-item:hover { background: rgba(0,0,0,0.05); }
            .uw-bug-box { display: none; position: absolute; bottom: 60px; right: 0; background: var(--bg-card, white); border: 1px solid var(--border, #ddd); border-radius: 12px; padding: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); width: 280px; flex-direction: column; gap: 10px; }
            .uw-bug-box.active { display: flex; }
            .uw-bug-box h3 { margin: 0; font-size: 16px; color: var(--text-primary, #333); }
            .uw-bug-box textarea { width: 100%; padding: 8px; border-radius: 8px; border: 1px solid var(--border, #ccc); resize: vertical; font-family: inherit; background: var(--bg-primary, #fff); color: var(--text-primary, #333); }
            .uw-bug-box button { padding: 8px; border-radius: 8px; border: none; background: var(--accent, #7c3a8c); color: white; cursor: pointer; font-weight: bold; }
            .uw-bug-box small { color: var(--text-muted, #888); font-size: 11px; text-align: center; }
        `;
        document.head.appendChild(style);

        // --- Элементы ---
        const mainBtn = document.getElementById('uwMainBtn');
        const menu = document.getElementById('uwMenu');
        const themeBtn = document.getElementById('uwThemeBtn');
        const bugBtn = document.getElementById('uwBugBtn');
        const bugBox = document.getElementById('uwBugBox');
        const screenshotBtn = document.getElementById('uwScreenshotBtn');
        const bugText = document.getElementById('uwBugText');

        // --- Начальное состояние темы ---
        let currentTheme = initTheme();
        themeBtn.textContent = currentTheme === 'dark' ? '☀️ Светлая тема' : '🌙 Тёмная тема';

        // --- Логика кнопок ---
        mainBtn.onclick = (e) => {
            e.stopPropagation();
            menu.classList.toggle('active');
            bugBox.classList.remove('active');
        };

        // Переключение темы
        themeBtn.onclick = () => {
            currentTheme = toggleTheme();
            themeBtn.textContent = currentTheme === 'dark' ? '☀️ Светлая тема' : '🌙 Тёмная тема';
            menu.classList.remove('active');
        };

        // Открытие баг-репорта
        bugBtn.onclick = () => {
            menu.classList.remove('active');
            bugBox.classList.add('active');
        };

        // Закрытие по клику вне
        document.addEventListener('click', (e) => {
            if (!document.getElementById('universalWidget').contains(e.target)) {
                menu.classList.remove('active');
                bugBox.classList.remove('active');
            }
        });

        // --- Логика отправки баг-репорта ---
        screenshotBtn.onclick = async (e) => {
            e.preventDefault();
            const description = bugText.value.trim();
            if (!description) {
                alert('✏️ Пожалуйста, опишите проблему.');
                return;
            }

            const originalText = screenshotBtn.textContent;
            screenshotBtn.disabled = true;
            screenshotBtn.textContent = '📸 Делаю скриншот...';

            const screenshotDataUrl = await captureScreenshot();
            screenshotBtn.textContent = '📄 Создаю отчёт...';

            const filename = downloadReport(description, screenshotDataUrl || '', { url: window.location.href });

            screenshotBtn.disabled = false;
            screenshotBtn.textContent = originalText;
            bugText.value = '';
            bugBox.classList.remove('active');

            alert(`✅ Отчёт сохранён как "${filename}"\n\n📧 Отправьте этот файл на почту: adel.angel2026@gmail.com`);
        };
    }

    // Запуск при загрузке страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createWidget);
    } else {
        createWidget();
    }
})();
