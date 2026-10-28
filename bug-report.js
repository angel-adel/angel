(function() {
    // ==========================================
    // 1. ЛОГИКА ТЕМЫ (Жесткая привязка к body)
    // ==========================================
    function initTheme() {
        const htmlEl = document.documentElement;
        const bodyEl = document.body;
        const savedTheme = localStorage.getItem('theme') || 'light';
        
        htmlEl.setAttribute('data-theme', savedTheme);

        if (savedTheme === 'dark') {
            bodyEl.style.backgroundColor = '#130a1e';
            bodyEl.style.color = '#f3e8ff';
        } else {
            bodyEl.style.backgroundColor = '';
            bodyEl.style.color = '';
        }
        return savedTheme;
    }

    function toggleTheme() {
        const htmlEl = document.documentElement;
        const bodyEl = document.body;
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Принудительно перекрашиваем body
        if (newTheme === 'dark') {
            bodyEl.style.backgroundColor = '#130a1e';
            bodyEl.style.color = '#f3e8ff';
        } else {
            bodyEl.style.backgroundColor = '';
            bodyEl.style.color = '';
        }
        return newTheme;
    }

    // ==========================================
    // 2. ЛОГИКА БАГ-РЕПОРТА (Скриншоты и отчеты)
    // ==========================================
    function loadHtml2Canvas() {
        return new Promise((resolve, reject) => {
            if (typeof html2canvas !== 'undefined') return resolve();
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
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const canvas = await html2canvas(document.body, {
                scale: 1.5,
                backgroundColor: isDark ? '#130a1e' : '#f5f0ff',
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
        return `<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><title>Баг-репорт</title><style>body{font-family:sans-serif;background:#f5f0ff;padding:2rem}.report{max-width:1000px;margin:0 auto;background:#fff;border-radius:24px;padding:2rem;box-shadow:0 8px 28px rgba(0,0,0,.08)}h1{color:#9b59b6}.meta,.description{background:#f9f5ff;padding:1rem;border-radius:16px;margin:1rem 0}.description{background:#fff9e8;border-left:4px solid #9b59b6}img{max-width:100%;border-radius:16px;margin:1rem 0}</style></head><body><div class="report"><h1>🐞 Баг-репорт</h1><p><strong>Страница:</strong> ${escapeHtml(pageInfo.url)}</p><p><strong>Время:</strong> ${new Date().toLocaleString()}</p><div class="meta"><strong>Браузер:</strong> ${navigator.userAgent}<br><strong>Экран:</strong> ${window.innerWidth}×${window.innerHeight}</div><div class="description"><strong>Описание:</strong><br>${escapeHtml(description)}</div><strong>Скриншот:</strong><br><img src="${screenshotDataUrl}"></div></body></html>`;
    }

    function downloadReport(description, screenshotDataUrl, pageInfo) {
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `bugreport_${timestamp}.html`;
        const htmlContent = generateReportHTML(description, screenshotDataUrl, pageInfo);
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        return filename;
    }

    // ==========================================
    // 3. СОЗДАНИЕ ВИДЖЕТА (HTML + CSS)
    // ==========================================
    function createWidget() {
        if (document.getElementById('universalWidget')) return;

        const widgetHtml = `
            <div id="universalWidget">
                <div class="uw-main-btn" id="uwMainBtn">⚙️</div>
                <div class="uw-menu" id="uwMenu">
                    <button class="uw-menu-item" id="uwThemeBtn">🌙 Сменить тему</button>
                    <button class="uw-menu-item" id="uwBugBtn">🐞 Баг-репорт</button>
                </div>
                <div class="uw-bug-box" id="uwBugBox">
                    <h3>🐞 Сообщить о проблеме</h3>
                    <textarea id="uwBugText" placeholder="Опишите, что пошло не так..." rows="3"></textarea>
                    <button id="uwScreenshotBtn">📸 Сделать скриншот и скачать отчёт</button>
                    <small>Отправьте на adel.angel2026@gmail.com</small>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', widgetHtml);

        const style = document.createElement('style');
        style.textContent = `
            #universalWidget { position: fixed; bottom: 20px; right: 20px; z-index: 10000; font-family: system-ui, sans-serif; }
            .uw-main-btn { width: 50px; height: 50px; border-radius: 50%; background: #7c3a8c; color: white; display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3); transition: transform 0.2s; }
            .uw-main-btn:hover { transform: scale(1.1); }
            
            .uw-menu, .uw-bug-box { display: none; position: absolute; bottom: 60px; right: 0; background: #fff; border: 1px solid #ddd; border-radius: 12px; padding: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); flex-direction: column; gap: 5px; }
            .uw-menu { min-width: 180px; }
            .uw-bug-box { width: 280px; }
            
            [data-theme="dark"] .uw-menu, [data-theme="dark"] .uw-bug-box { background: #1c112b; border-color: #2d1b4e; color: #f3e8ff; }
            
            .uw-menu.active, .uw-bug-box.active { display: flex; }
            
            .uw-menu-item { background: transparent; border: none; text-align: left; padding: 10px; cursor: pointer; border-radius: 8px; font-size: 14px; color: #333; font-weight: 500; }
            .uw-menu-item:hover { background: rgba(0,0,0,0.05); }
            [data-theme="dark"] .uw-menu-item { color: #f3e8ff; }
            [data-theme="dark"] .uw-menu-item:hover { background: rgba(255,255,255,0.1); }
            
            .uw-bug-box h3 { margin: 0 0 5px 0; font-size: 16px; }
            .uw-bug-box textarea { width: 100%; padding: 8px; border-radius: 8px; border: 1px solid #ccc; resize: vertical; font-family: inherit; margin-bottom: 5px; }
            [data-theme="dark"] .uw-bug-box textarea { background: #130a1e; color: #f3e8ff; border-color: #2d1b4e; }
            
            .uw-bug-box button { padding: 10px; border-radius: 8px; border: none; background: #7c3a8c; color: white; cursor: pointer; font-weight: bold; }
            .uw-bug-box button:hover { background: #5a2a67; }
            .uw-bug-box small { color: #888; font-size: 11px; text-align: center; margin-top: 5px; }
        `;
        document.head.appendChild(style);

        const mainBtn = document.getElementById('uwMainBtn');
        const menu = document.getElementById('uwMenu');
        const themeBtn = document.getElementById('uwThemeBtn');
        const bugBtn = document.getElementById('uwBugBtn');
        const bugBox = document.getElementById('uwBugBox');
        const screenshotBtn = document.getElementById('uwScreenshotBtn');
        const bugText = document.getElementById('uwBugText');

        let currentTheme = initTheme();
        themeBtn.textContent = currentTheme === 'dark' ? '☀️ Светлая тема' : '🌙 Тёмная тема';

        mainBtn.onclick = (e) => {
            e.stopPropagation();
            menu.classList.toggle('active');
            bugBox.classList.remove('active');
        };

        themeBtn.onclick = () => {
            currentTheme = toggleTheme();
            themeBtn.textContent = currentTheme === 'dark' ? '☀️ Светлая тема' : '🌙 Тёмная тема';
            menu.classList.remove('active');
        };

        bugBtn.onclick = () => {
            menu.classList.remove('active');
            bugBox.classList.add('active');
        };

        document.addEventListener('click', (e) => {
            if (!document.getElementById('universalWidget').contains(e.target)) {
                menu.classList.remove('active');
                bugBox.classList.remove('active');
            }
        });

        screenshotBtn.onclick = async (e) => {
            e.preventDefault();
            const description = bugText.value.trim();
            if (!description) { alert('✏️ Пожалуйста, опишите проблему.'); return; }

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

            alert(`✅ Отчёт сохранён: "${filename}"\n\n📧 Отправьте файл на adel.angel2026@gmail.com`);
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createWidget);
    } else {
        createWidget();
    }
})();
