// vk-widget.js
document.addEventListener("DOMContentLoaded", function() {
    if (typeof VK === 'undefined') {
        console.error("Библиотека VK OpenAPI не загрузилась.");
        return;
    }

    // Инициализация с твоим ID
    VK.init({
        apiId: 54902403, // <--- Твой ID
        onlyWidgets: true // Для виджета сообщений этого достаточно
    });

    try {
        const vkWidget = VK.Widgets.CommunityMessages("vk_community_messages", 235899061, {
            welcomeScreen: 1,
            expanded: 0,
            widgetPosition: "right",
            tooltipButtonText: "Напишите нам!",
            disableNewMessagesSound: 0,
            disableTitleChange: 0
        });

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
