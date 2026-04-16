// bug_widget.js — полный код виджета
(function() {
  // Добавляем стили
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

  // Добавляем стили на страницу
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // Создаём HTML-элементы
  const btn = document.createElement('div');
  btn.id = 'bug-report-btn';
  btn.title = 'Сообщить о проблеме на сайте';
  btn.innerHTML = '🐞';
  document.body.appendChild(btn);

  const formContainer = document.createElement('div');
  formContainer.id = 'bug-form-container';
  formContainer.innerHTML = `
    <strong>Сообщить о проблеме</strong>
    <textarea id="bug-description" placeholder="Опишите, что пошло не так... Например: 'Не загружается стихотворение' или 'Сломался переход по категориям'"></textarea>
    <div class="bug-form-buttons">
      <button id="bug-cancel">Отмена</button>
      <button id="bug-send">Отправить</button>
    </div>
    <div id="bug-status"></div>
  `;
  document.body.appendChild(formContainer);

  // Добавляем скрипт html2canvas
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
  script.onload = () => {
    // Инициализация после загрузки библиотеки
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

      statusDiv.innerHTML = '<span class="bug-loading"></span> Делаю скриншот...';
      statusDiv.style.background = '#e8f0fe';
      sendBtn.disabled = true;

      try {
        const canvas = await html2canvas(document.body, {
          scale: 1,
          logging: false,
          useCORS: true,
          windowWidth: document.documentElement.scrollWidth,
          windowHeight: document.documentElement.scrollHeight
        });
        const screenshotData = canvas.toDataURL('image/png');

        statusDiv.innerHTML = '<span class="bug-loading"></span> Отправляю...';

        const formData = new FormData();
        formData.append('description', description);
        formData.append('screenshot', screenshotData);
        formData.append('user_agent', navigator.userAgent);
        formData.append('resolution', `${window.screen.width}x${window.screen.height}`);
        formData.append('url', window.location.href);

        // Укажите ваш URL на Byet.Host
        const response = await fetch('http://angel-adel.byethost12.com/bug_report.php', {
          method: 'POST',
          body: formData
        });

        const result = await response.text();
        if (result === 'OK') {
          statusDiv.innerHTML = '✅ Спасибо! Отправлено.';
          statusDiv.style.background = '#e0ffe0';
          setTimeout(() => formContainer.style.display = 'none', 2000);
        } else {
          throw new Error(result || 'Server error');
        }
      } catch (error) {
        console.error(error);
        statusDiv.innerHTML = '❌ Ошибка отправки. Попробуйте позже.';
        statusDiv.style.background = '#ffe0e0';
      } finally {
        sendBtn.disabled = false;
      }
    });
  };
  document.head.appendChild(script);
})();
