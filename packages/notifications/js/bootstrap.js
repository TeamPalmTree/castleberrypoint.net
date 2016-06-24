CDUI.menu.filters.push(function(items) {
    var currentMenuItemName = CDUI.currentMenuItemName();
    var notifications = CDNotifications.notifications.find().fetch();
    items.forEach(function(item) {
        item.notificationCount = 0;
        if (currentMenuItemName !== item.name) {
            notifications.forEach(function (notification) {
                if (notification.menuItemName === item.name) {
                    item.notificationCount += 1;
                }
            });
        } else {
            CDNotifications.clear(currentMenuItemName);
        }
    });
    return items;
});









