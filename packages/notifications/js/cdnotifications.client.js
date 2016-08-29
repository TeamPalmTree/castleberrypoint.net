CDNotifications.clear = function(routeName) {
    Meteor.call('CDNotifications.clear', CDUser.token(), routeName);
};