Meteor.methods({

    'CDCommunity.post': function(token, post) {
        return CDCommunity.post(token, post);
    },

    'CDCommunity.comment': function(token, post) {
        return CDCommunity.comment(token, post);
    },

    'CDCommunity.pin': function(token, id) {
        CDCommunity.pin(token, id);
    },

    'CDCommunity.cancel': function(token) {
        return CDCommunity.cancel(token);
    },

    'CDCommunity.uploadImage': function(token, image) {
        return CDCommunity.uploadImage(token, image);
    },

    'CDCommunity.deleteImage': function(token, id) {
        return CDCommunity.deleteImage(token, id);
    },

    'CDCommunity.upImage': function(token, id) {
        return CDCommunity.upImage(token, id);
    },

    'CDCommunity.downImage': function(token, id) {
        return CDCommunity.downImage(token, id);
    }

});