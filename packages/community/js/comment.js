Template.comment.helpers({

    authorName: function() {
        return CDUser.users.findOne(this.authorId).username;
    },

    authorImage: function() {
        return CDUser.getUserImageSrc(this.authorId);
    }

});