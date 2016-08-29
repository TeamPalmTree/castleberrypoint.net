Meteor.publish('notifications', function (token) {
    var userId = CDUser.id(token);
    var $eq = {};
    $eq["receipts." + userId + ".received"] = false;
    return CDNotifications.notifications.find($eq, { fields: {
        message: 1,
        routeName: 1,
        notifierId: 1,
        created: 1
    }});
});