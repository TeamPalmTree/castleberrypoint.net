Meteor.publish('users', function () {
    return CDUser.users.find({}, { fields: CDUser.getMongoFields() });
});