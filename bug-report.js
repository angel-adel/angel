(function() {
    // Загрузка html2canvas
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

    // Скриншот
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

    // Экранирование HTML
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    // Формирование отчёта
    function generateReportHTML(description, screenshotDataUrl, pageInfo) {
        return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Баг-репорт — Адель</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f0ff;
            padding: 2rem;
            line-height: 1.5;
        }
        .report {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 24px;
            padding: 2rem;
            box-shadow: 0 8px 28px rgba(0,0,0,0.08);
            border: 1px solid #e9e0f5;
        }
        h1 {
            color: #9b59b6;
            font-size: 1.8rem;
            margin-bottom: 1rem;
        }
        .meta {
            background: #f9f5ff;
            padding: 1rem;
            border-radius: 16px;
            margin: 1rem 0;
        }
        .description {
            background: #fff9e8;
            padding: 1rem;
            border-radius: 16px;
            margin: 1rem 0;
            border-left: 4px solid #9b59b6;
        }
        img {
            max-width: 100%;
            border-radius: 16px;
            border: 1px solid #e9e0f5;
            margin: 1rem 0;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        hr {
            margin: 1.5rem 0;
            border: none;
            border-top: 1px solid #e9e0f5;
        }
        .footer {
            text-align: center;
            color: #6b5b7e;
            font-size: 0.85rem;
            margin-top: 1.5rem;
        }
        code {
            background: #f0f0f0;
            padding: 0.2rem 0.4rem;
            border-radius: 8px;
            font-size: 0.85rem;
        }
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

    // Скачивание файла (гарантированно работает)
    function downloadReport(description, screenshotDataUrl, pageInfo) {
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `bugreport_adel_${timestamp}.html`;
        
        const htmlContent = generateReportHTML(description, screenshotDataUrl, pageInfo);
        const blob = new Blob([htmlContent], { type: 'text/html' });
        
        // Создаём временную ссылку и имитируем клик
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

    // Инициализация виджета
    function initBugWidget() {
        const btn = document.getElementById('bugWidget');
        const box = document.getElementById('bugWidgetContent');
        
        if (!btn || !box) {
            console.warn('Элементы виджета не найдены');
            return;
        }
        
        // Открытие/закрытие
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            box.classList.toggle('active');
        });
        
        // Закрытие по клику вне
        document.addEventListener('click', (e) => {
            if (!box.contains(e.target) && !btn.contains(e.target)) {
                box.classList.remove('active');
            }
        });
        
        // Кнопка отправки
        const sendBtn = box.querySelector('button');
        const textarea = box.querySelector('textarea');
        
        if (sendBtn) {
            sendBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                
                const description = textarea ? textarea.value.trim() : '';
                if (!description) {
                    alert('✏️ Пожалуйста, опишите проблему перед отправкой отчёта.');
                    return;
                }
                
                // Блокируем кнопку на время
                const originalText = sendBtn.textContent;
                sendBtn.disabled = true;
                sendBtn.textContent = '📸 Делаю скриншот...';
                
                const screenshotDataUrl = await captureScreenshot();
                
                sendBtn.textContent = '📄 Создаю отчёт...';
                
                const filename = downloadReport(
                    description, 
                    screenshotDataUrl || '', 
                    { url: window.location.href }
                );
                
                // Сбрасываем форму
                sendBtn.disabled = false;
                sendBtn.textContent = originalText;
                if (textarea) textarea.value = '';
                box.classList.remove('active');
                
                alert(`✅ Отчёт сохранён как "${filename}"\n\n📧 Отправьте этот файл на почту: adel.angel2026@gmail.com`);
            });
        }
    }
    
    // Запуск
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBugWidget);
    } else {
        initBugWidget();
    }
})();
