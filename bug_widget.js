// bug_widget.js — скриншот только видимой области (оптимизировано для больших страниц)
(function() {
  // ========== СТИЛИ (без изменений) ==========
  const styles = `
    #bug-report-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #ff4444;
      color: white;
      border: none;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      font-size: 30px;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      font-family: sans-serif;
    }
    #bug-report-btn:hover {
      background-color: #cc0000;
      transform: scale(1.05);
    }
    #bug-form-container {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 320px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 5px 25px rgba(0,0,0,0.2);
      z-index: 10000;
      display: none;
      flex-direction: column;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #333;
    }
    #bug-form-container strong {
      font-size: 18px;
      margin-bottom: 15px;
      color: #c0392b;
    }
    #bug-description {
      width: 100%;
      min-height: 100px;
      margin: 10px 0;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-family: inherit;
      font-size: 14px;
      resize: vertical;
      box-sizing: border-box;
    }
    #bug-description:focus {
      outline: none;
      border-color: #c0392b;
    }
    .bug-form-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 5px;
    }
    .bug-form-buttons button {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }
    #bug-cancel {
      background: #e0e0e0;
      color: #333;
    }
    #bug-cancel:hover {
      background: #ccc;
    }
    #bug-send {
      background: #c0392b;
      color: white;
    }
    #bug-send:hover {
      background: #a93226;
    }
    #bug-send:disabled {
      background: #999;
      cursor: not-allowed;
    }
    #bug-status {
      font-size: 13px;
      margin-top: 12px;
      text-align: center;
      padding: 5px;
      border-radius: 6px;
    }
    .bug-loading {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid #fff;
      border-radius: 50%;
      border-top-color: transparent;
      animation: spin 0.6s linear infinite;
      margin-right: 6px;
      vertical-align: middle;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // ========== СОЗДАНИЕ КНОПКИ И ФОРМЫ ==========
  const btn = document.createElement('div');
  btn.id = 'bug-report-btn';
  btn.title = 'Сообщить о проблеме на сайте';
  btn.innerHTML = '🐞';
  document.body.appendChild(btn);

  const formContainer = document.createElement('div');
  formContainer.id = 'bug-form-container';
  formContainer.innerHTML = `
    <strong>Сообщить о проблеме</strong>
    <textarea id="bug-description" placeholder="Опишите, что пошло не так..."></textarea>
    <div class="bug-form-buttons">
      <button id="bug-cancel">Отмена</button>
      <button id="bug-send">Отправить</button>
    </div>
    <div id="bug-status"></div>
  `;
  document.body.appendChild(formContainer);

  // ========== ОСНОВНАЯ ЛОГИКА ==========
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
  script.onload = () => {
    const cancelBtn = document.getElementById('bug-cancel');
    const sendBtn = document.getElementById('bug-send');
    const descriptionField = document.getElementById('bug-description');
    const statusDiv = document.getElementById('bug-status');

    btn.addEventListener('click', () => {
      formContainer.style.display = 'flex';
      descriptionField.value = '';
      statusDiv.innerHTML = '';
    });

    cancelBtn.addEventListener('click', () => {
      formContainer.style.display = 'none';
    });

    sendBtn.addEventListener('click', async () => {
      const description = descriptionField.value.trim();
      if (!description) {
        statusDiv.innerHTML = '❌ Пожалуйста, опишите проблему.';
        statusDiv.style.background = '#ffe0e0';
        return;
      }

      statusDiv.innerHTML = '<span class="bug-loading"></span> Подготовка...';
      statusDiv.style.background = '#e8f0fe';
      sendBtn.disabled = true;

      try {
        // Определяем устройство
        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const scale = isMobile ? 0.8 : 1.0;
        
        statusDiv.innerHTML = '<span class="bug-loading"></span> Делаю скриншот видимой области...';
        
        // СКРИНШОТ ТОЛЬКО ВИДИМОЙ ОБЛАСТИ (быстро и точно)
        const canvas = await html2canvas(document.body, {
          scale: scale,
          logging: false,
          useCORS: true,
          height: window.innerHeight,      // только высота экрана
          width: window.innerWidth,        // только ширина экрана
          y: window.scrollY,               // текущая позиция прокрутки
          x: window.scrollX,
          backgroundColor: '#ffffff'
        });
        
        const screenshotDataURL = canvas.toDataURL('image/png');
        
        statusDiv.innerHTML = '<span class="bug-loading"></span> Формирую отчёт...';
        
        // Текстовый отчёт
        const reportText = `=== ОТЧЁТ О ПРОБЛЕМЕ ===

ОПИСАНИЕ:
${description}

--- ТЕХНИЧЕСКИЕ ДАННЫЕ ---
URL: ${window.location.href}
Заголовок страницы: ${document.title}
Браузер: ${navigator.userAgent}
Разрешение экрана: ${window.screen.width}x${window.screen.height}
Видимая область: ${window.innerWidth}x${window.innerHeight}
Позиция прокрутки: ${window.scrollY}px
Язык браузера: ${navigator.language}
Устройство: ${isMobile ? 'Мобильное' : 'Компьютер'}
Время: ${new Date().toLocaleString()}

--- ИНФОРМАЦИЯ О САЙТЕ ---
Хост: ${window.location.host}
Путь: ${window.location.pathname}
`;

        // HTML-отчёт
        const reportHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Bug Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { color: #c0392b; margin-top: 0; }
        h2 { color: #333; font-size: 18px; margin: 20px 0 10px; }
        .info { background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 15px 0; word-break: break-word; }
        .screenshot { margin: 20px 0; text-align: center; }
        .screenshot img { max-width: 100%; border: 1px solid #ddd; border-radius: 8px; }
        hr { margin: 20px 0; border: none; border-top: 1px solid #eee; }
        .note { background: #e8f0fe; padding: 10px; border-radius: 8px; margin: 15px 0; font-size: 13px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🐞 Отчёт о проблеме</h1>
        
        <h2>📝 Описание</h2>
        <div class="info">${description.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        
        <h2>💻 Технические данные</h2>
        <div class="info">
            <strong>URL:</strong> ${window.location.href}<br>
            <strong>Страница:</strong> ${document.title}<br>
            <strong>Браузер:</strong> ${navigator.userAgent}<br>
            <strong>Разрешение экрана:</strong> ${window.screen.width}x${window.screen.height}<br>
            <strong>Видимая область:</strong> ${window.innerWidth}x${window.innerHeight}<br>
            <strong>Позиция прокрутки:</strong> ${window.scrollY}px<br>
            <strong>Устройство:</strong> ${isMobile ? 'Мобильное' : 'Компьютер'}<br>
            <strong>Время:</strong> ${new Date().toLocaleString()}
        </div>
        
        <h2>📸 Скриншот (видимая область)</h2>
        <div class="note">ℹ️ На скриншоте только то, что было видно на экране в момент отправки. Если проблема не попала в кадр — прокрутите страницу к ошибке и отправьте отчёт заново.</div>
        <div class="screenshot">
            <img src="${screenshotDataURL}" alt="Скриншот видимой области">
        </div>
        
        <hr>
        <p style="color: #666; font-size: 12px; text-align: center;">
            📧 Отправьте этот файл на почту: <strong>adel.angel2026@gmail.com</strong>
        </p>
    </div>
</body>
</html>`;
        
        // Скачиваем
        const blob = new Blob([reportHTML], {type: 'text/html'});
        const link = document.createElement('a');
        link.download = `bug_report_${Date.now()}.html`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
        
        statusDiv.innerHTML = '✅ Отчёт готов! Файл .html скачан. Отправьте его на почту: adel.angel2026@gmail.com';
        statusDiv.style.background = '#e0ffe0';
        
        setTimeout(() => {
          formContainer.style.display = 'none';
          statusDiv.innerHTML = '';
        }, 8000);
        
      } catch (error) {
        console.error(error);
        statusDiv.innerHTML = '❌ Ошибка. Попробуйте позже или отправьте скриншот вручную.';
        statusDiv.style.background = '#ffe0e0';
      } finally {
        sendBtn.disabled = false;
      }
    });
  };
  document.head.appendChild(script);
})();
