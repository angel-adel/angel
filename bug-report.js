(async function() {
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
                useCORS: true
            });
            return canvas.toDataURL('image/png');
        } catch (err) {
            console.error('Скриншот не удался:', err);
            return null;
        }
    }

    function downloadReport(description, screenshot, pageInfo) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `bugreport_adel_${timestamp}.html`;
        const report = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Баг-репорт Адель</title>
<style>
body { font-family: system-ui; background: #f5f0ff; padding: 2rem; }
.card { background: white; border-radius: 20px; padding: 2rem; max-width: 1000px; margin: 0 auto; }
img { max-width: 100%; border-radius: 16px; border: 1px solid #ddd; }
hr { margin: 1rem 0; }
</style>
</head>
<body>
<div class="card">
<h1>🐞 Баг-репорт Адель</h1>
<p><strong>Страница:</strong> ${pageInfo.url}</p>
<p><strong>Время:</strong> ${new Date().toLocaleString()}</p>
<p><strong>Браузер:</strong> ${navigator.userAgent}</p>
<hr>
<h3>📝 Описание:</h3>
<p>${escapeHtml(description)}</p>
<h3>📸 Скриншот:</h3>
<img src="${screenshot}" alt="screenshot">
<hr>
<p>📧 Отправьте этот файл на <strong>adel.angel2026@gmail.com</strong> или <strong>tehno_adel@sendapp.uk</strong></p>
</div>
<script>function escapeHtml(t){return t?t.replace(/[&<>]/g,function(m){return m==='&'?'&amp;':m==='<'?'&lt;':'&gt;'}):''}</script>
</body>
</html>`;
        const blob = new Blob([report], { type: 'text/html' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
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

    function initBugWidget() {
        const btn = document.getElementById('bugWidget');
        const box = document.getElementById('bugWidgetContent');
        if (!btn || !box) return;
        btn.onclick = (e) => {
            e.stopPropagation();
            box.classList.toggle('active');
        };
        document.addEventListener('click', (e) => {
            if (!box.contains(e.target) && !btn.contains(e.target)) box.classList.remove('active');
        });
        const sendBtn = box.querySelector('button');
        const textarea = box.querySelector('textarea');
        if (sendBtn) {
            sendBtn.onclick = async () => {
                const desc = textarea?.value || '';
                if (!desc.trim()) {
                    alert('Опишите проблему');
                    return;
                }
                sendBtn.disabled = true;
                sendBtn.textContent = '📸 Делаю скриншот...';
                const screenshot = await captureScreenshot();
                sendBtn.textContent = '📄 Создаю отчёт...';
                downloadReport(desc, screenshot, { url: window.location.href });
                sendBtn.disabled = false;
                sendBtn.textContent = 'Отправить отчёт';
                if (textarea) textarea.value = '';
                box.classList.remove('active');
            };
        }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initBugWidget);
    else initBugWidget();
})();
