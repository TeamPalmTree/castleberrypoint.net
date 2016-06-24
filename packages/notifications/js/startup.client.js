Meteor.startup(function() {
    Meteor.subscribe('notifications', CDUser.token());
});