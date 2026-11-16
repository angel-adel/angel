// vk-widget.js
document.addEventListener("DOMContentLoaded", function() {
    // Проверяем, загрузилась ли библиотека ВК
    if (typeof VK === 'undefined') {
        console.error("Библиотека VK OpenAPI не загрузилась. Проверь подключение в <head>.");
        return;
    }

    // Инициализируем виджет
    const vkWidget = VK.Widgets.CommunityMessages("vk_community_messages", 235899061, {
        welcomeScreen: 1,
        expanded: 0,
        widgetPosition: "right", // Кнопка справа
        tooltipButtonText: "Напишите нам!",
        disableNewMessagesSound: 0,
        disableTitleChange: 0
    });

    // Находим твою кнопку (по ID), чтобы открывать виджет по клику
    const customBtn = document.getElementById("open-vk-chat");
    if (customBtn) {
        customBtn.addEventListener("click", function(e) {
            e.preventDefault();
            if (vkWidget && typeof vkWidget.expand === 'function') {
                vkWidget.expand();
            }
        });
    }
});
