CDNotifications.notify = function(token, notification) {
    var userId = CDUser.id(token);
    if (!userId)
        throw new Meteor.Error(401, "You need to login to notify users");
    if (!notification.message)
        throw new Meteor.Error(422, 'Please fill in a headline');
    notification.notifierId = userId;
    notification.created = Date.now();
    notification.receipts = {};
    // translate recipient ids (user ids) to receipt objects
    notification.recipientIds.forEach(function(receipientId) {
        notification.receipts[receipientId] = {
            received: false
        };
    });
    // remove the recipient ids node
    delete notification.recipientIds;
    CDNotifications.notifications.insert(notification);
};

CDNotifications.clear = function(token, menuItemName) {
    var userId = CDUser.id(token);
    var params = {};
    if (menuItemName) {
        params.menuItemName = menuItemName;
    }
    // set notifications for this user (and possibly menu item) to received
    var $set = {};
    $set["receipts." + userId + ".received"] = true;
    CDNotifications.notifications.update(params, {$set: $set}, {multi: true});
};