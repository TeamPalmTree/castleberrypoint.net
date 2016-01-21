Meteor.methods({

    'join': function(user) {
        return CDUser.join(user);
    },

    'login': function(user) {
        return CDUser.login(user);
    },

    'modify': function(token, user) {
        CDUser.modify(token, user);
    },

    'administrate': function(token, id) {
        CDUser.administrate(token, id);
    },

    'upload': function(buffer) {
        CDUser.upload(buffer);
    }

})