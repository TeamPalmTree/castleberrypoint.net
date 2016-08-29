Template.post.helpers({

    postPinnedClass: function() {
       if (this.pinned) {
           return 'pinned';
       }
    },

    currentUserLikedClass: function() {
      var like = CDUser.reactions.findOne({ $and: [ {postId: this._id}, {userId: CDUser.id()}, {emotion: 'like'} ]});
      if (like) {
         return 'liked';
      }
    },

    authorName: function() {
        return CDUser.users.findOne(this.authorId).username;
    },

    authorImage: function() {
        return CDUser.getUserImageSrc(this.authorId);
    },

    comments: function() {
        return CDCommunity.posts.find({ postId: this._id });
    },

    images: function() {
        return CDCommunity.images.find({ postId: this._id }, {sort: {order: 1}});
    }

});

Template.post.onRendered(function() {

    this.find('.comments')._uihooks = {
        insertElement: function(node, next) {
            $(node)
                .hide()
                .insertBefore(next)
                .fadeIn();
        },
        removeElement: function(node) {
            $(node).fadeOut(function() {
                $(this).remove();
            });
        }
    };

});

Template.post.events({

    // comment
    'keypress input[name=comment]': function(event) {

        if (event.keyCode != 13) {
            return;
        }

        var post = {
            postId: this._id,
            content: $(event.currentTarget).val()
        };

        CDCommunity.comment(post, function(error) {
            if (error) {
                alert(error.reason);
            } else {
                $(event.currentTarget).val('');
                event.target.scrollIntoView(false);
            }
        });

    },

    'click .pin': function() {
        CDCommunity.pin(this._id, function (error) {
            if (error) {
                alert(error.reason);
            }
        });
    },

    'click .like': function() {
        CDCommunity.like(this._id, function (error) {
            if (error) {
                alert(error.reason);
            }
        });
    }

});
