// vk-widget.js
document.addEventListener("DOMContentLoaded", function() {
    // 1. Проверяем, загрузилась ли библиотека ВК
    if (typeof VK === 'undefined') {
        console.error("Библиотека VK OpenAPI не загрузилась. Проверь подключение в <head>.");
        return;
    }

    // 2. Инициализируем API (обязательно для современных версий ВК)
    VK.init({
        apiId: 0, // Оставляем 0, если работаем только с виджетами
        onlyWidgets: true // Говорим ВК, что нам нужны только виджеты, а не полный доступ
    });

    // 3. Инициализируем виджет
    // (Код внутри функции-колбэка VK.init не обязателен, но так безопаснее)
    try {
        const vkWidget = VK.Widgets.CommunityMessages("vk_community_messages", 235899061, {
            welcomeScreen: 1,
            expanded: 0,
            widgetPosition: "right",
            tooltipButtonText: "Напишите нам!",
            disableNewMessagesSound: 0,
            disableTitleChange: 0,
            onCanNotWrite: function(reason) {
                console.log("ВК не даёт отправить сообщение. Причина: " + reason);
            }
        });

        // 4. Обработка твоей кастомной кнопки (если она есть)
        const customBtn = document.getElementById("open-vk-chat");
        if (customBtn) {
            customBtn.addEventListener("click", function(e) {
                e.preventDefault();
                if (vkWidget && typeof vkWidget.expand === 'function') {
                    vkWidget.expand();
                }
            });
        }
    } catch (error) {
        console.error("Ошибка при создании виджета ВК:", error);
    }
});
