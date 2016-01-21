Meteor.methods({

    'post': function(token, post) {
        return CDCommunity.post(token, post);
    },

    'comment': function(token, post) {
        return CDCommunity.comment(token, post);
    },

    'pin': function(token, id) {
        CDCommunity.pin(token, id);
    }

});