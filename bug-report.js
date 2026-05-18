(function() {
    // Функция загрузки html2canvas
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
                useCORS: true
            });
            return canvas.toDataURL('image/png');
        } catch (err) {
            console.error('Скриншот не удался:', err);
            return null;
        }
    }

    // Скачивание отчёта
    function downloadReport(description, screenshot, pageInfo) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `bugreport_adel_${timestamp}.html`;
        const report = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Баг-репорт Адель</title>
<style>
body { font-family: system-ui; background: #f5f0ff; padding: 2rem; margin:0; }
.card { background: white; border-radius: 20px; padding: 2rem; max-width: 1000px; margin: 0 auto; box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
img { max-width: 100%; border-radius: 16px; border: 1px solid #ddd; margin: 1rem 0; }
hr { margin: 1.5rem 0; border: none; border-top: 2px solid #e9e0f5; }
h1 { color: #9b59b6; }
.small { color: #6b5b7e; font-size: 0.85rem; }
</style>
</head>
<body>
<div class="card">
<h1>🐞 Баг-репорт / Ошибка на сайте Адель</h1>
<p><strong>Страница:</strong> <a href="${pageInfo.url}">${pageInfo.url}</a></p>
<p><strong>Время:</strong> ${new Date().toLocaleString()}</p>
<p><strong>Браузер:</strong> ${navigator.userAgent}</p>
<p><strong>Размер экрана:</strong> ${window.innerWidth}×${window.innerHeight}</p>
<hr>
<h3>📝 Описание проблемы:</h3>
<p style="background:#f9f5ff; padding:1rem; border-radius:16px;">${escapeHtml(description)}</p>
<h3>📸 Скриншот в момент ошибки:</h3>
<img src="${screenshot}" alt="Скриншот страницы">
<hr>
<p class="small">📧 Отправьте этот файл на почту: <strong>adel.angel2026@gmail.com</strong> или <strong>tehno_adel@sendapp.uk</strong></p>
<p class="small">✨ Спасибо, что помогаете улучшить сайт!</p>
</div>
<script>
function escapeHtml(s) {
    if (!s) return '';
    return s.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}
</script>
</body>
</html>`;
        const blob = new Blob([report], { type: 'text/html' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
        alert(`✅ Отчёт сохранён: ${filename}\n\nОтправьте его на почту Адель`);
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

    // Инициализация виджета
    function initBugWidget() {
        const btn = document.getElementById('bugWidget');
        const box = document.getElementById('bugWidgetContent');
        if (!btn || !box) return;

        // Открытие/закрытие при клике на жука
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            box.classList.toggle('active');
        });

        // Закрытие при клике вне виджета
        document.addEventListener('click', (e) => {
            if (!box.contains(e.target) && !btn.contains(e.target)) {
                box.classList.remove('active');
            }
        });

        const sendBtn = box.querySelector('button');
        const textarea = box.querySelector('textarea');
        
        if (sendBtn) {
            sendBtn.addEventListener('click', async () => {
                const desc = textarea ? textarea.value : '';
                if (!desc.trim()) {
                    alert('Пожалуйста, опишите проблему');
                    return;
                }
                
                sendBtn.disabled = true;
                sendBtn.textContent = '📸 Делаю скриншот...';
                
                const screenshot = await captureScreenshot();
                
                sendBtn.textContent = '📄 Создаю отчёт...';
                downloadReport(desc, screenshot, { url: window.location.href });
                
                sendBtn.disabled = false;
                sendBtn.textContent = '📸 Сделать скриншот и скачать отчёт';
                if (textarea) textarea.value = '';
                box.classList.remove('active');
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBugWidget);
    } else {
        initBugWidget();
    }
})();
