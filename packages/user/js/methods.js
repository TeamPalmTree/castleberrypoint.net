Meteor.methods({

    'CDUser.join': function(user) {
        return CDUser.join(user);
    },

    'CDUser.login': function(user) {
        return CDUser.login(user);
    },

    'CDUser.modify': function(token, user) {
        CDUser.modify(token, user);
    },

    'CDUser.administrate': function(token, id) {
        CDUser.administrate(token, id);
    },

    'CDUser.upload': function(buffer) {
        CDUser.upload(buffer);
    }

});