CDNotifications.clear = function(menuItemName) {
    Meteor.call('CDNotifications.clear', CDUser.token(), menuItemName);
};