// vk-widget.js
document.addEventListener("DOMContentLoaded", function() {
    if (typeof VK === 'undefined') {
        console.error("Библиотека VK OpenAPI не загрузилась.");
        return;
    }

    // 1. Инициализируем API с РЕАЛЬНЫМ ID приложения
    VK.init({
        apiId: vk1.a.dUN1Q4AEdbYRlRiINItJj4ilRW892C2OXV04nxN3oFUoknHHgF7U5Bl5i1Y1HdVaE-dCBXsRfck2u7XeKx1ku5oXTG42roIU3cchDvTYAnSOwTCpECo9g8x8E6nguI6jJmzgQwFbUpocJcJJF3_RCJJXSgbZ5gXxYz9uiuMEJAlxBuY2DoIzhWEBSkXUVW05e_m_9eaFkgHleOSrqQig-g, // <--- ЗАМЕНИ НА СВОЙ ID ИЗ ШАГА ВЫШЕ
        onlyWidgets: false // Разрешаем полный доступ (включая статистику)
    });

    // 2. Создаем виджет
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

        // Обработка кастомной кнопки
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
