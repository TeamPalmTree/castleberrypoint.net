Template.post.helpers({

    postPinnedClass: function() {
       if (this.pinned) {
           return 'pinned';
       }
    },

    authorName: function() {
        return CDUser.users.findOne(this.authorId).username;
    },

    authorImage: function() {
        return CDUser.image(this.authorId);
    },

    comments: function() {
        return CDCommunity.posts.find({ postId: this._id });
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
    }

});