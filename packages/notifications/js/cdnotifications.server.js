Meteor.startup(function() {
    Meteor.publish('notifications', function () {
        var userId = CDUser.id(token);
        return CDUser.notifications.find({
            $exists: {}
        }, { fields: CDUser.getMongoFields() });
    });
});