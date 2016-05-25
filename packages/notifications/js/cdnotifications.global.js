CDNotifications = {};

CDCommunity.notifications = new Mongo.Collection('notifications');

CDNotifications.notify = function(token, notification) {
    var userId = CDUser.id(token);
    if (!userId)
        throw new Meteor.Error(401, "You need to login to notify users");
    if (!post.title)
        throw new Meteor.Error(422, 'Please fill in a headline');
    notification.notifierId = userId;
    notification.created = Date.now();
    notification.receipts = {};
    notification.recipientIds.forEach(function(receipientId) {
        notification.receipts[receipientId] = {
            received: false
        };
    });
    delete notification.recipientIds;
    CDCommunity.notifications.insert(notification);
};

CDNotifications.clear = function(token, menuItemName) {
    var userId = CDUser.id(token);
    var params = { userId: userId };
    if (menuItemName) {
        params.menuItemName = menuItemName;
    }
    // set notifications for this user (and possibly menu item) to received
    var $set = {};
    $set["receipts." + userId + ".received"] = true;
    CDCommunity.notifications.update(params, {$set: $set});
};