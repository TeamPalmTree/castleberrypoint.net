CDUI.menu.filters.push(function(items) {
    var routeName = CDUI.routeName();
    var notifications = CDNotifications.notifications.find().fetch();
    items.forEach(function(item) {
        item.notificationsCount = 0;
        if (routeName !== item.routeName) {
            notifications.forEach(function (notification) {
                if (notification.routeName === item.routeName) {
                    item.notificationsCount += 1;
                }
            });
        } else {
            CDNotifications.clear(routeName);
        }
    });
    return items;
});