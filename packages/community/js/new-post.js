Template.newPost.helpers({

    username: function() {
        var user = CDUser.user();
        if (user) {
            return user.username;
        }
    },

    authorImage: function() {
        return CDUser.getUserImageSrc();
    },

    images: function() {
        return CDCommunity.images.find({ uploaderId: CDUser.id(), postId: { $exists: false }}, {sort: {order: 1}});
    }

});

Template.newPost.events({

    'keyup #new-post-content': function(event) {
        var target = event.currentTarget;
        var lineHeight = parseFloat($(target).css('line-height'));
        var minHeight = parseFloat($(target).css('min-height'));
        var lines = $(target).val().split(/\r*\n/);
        var height = lines.length * lineHeight + lineHeight;
        if (height > minHeight) {
            target.style.height = height + 'px';
        } else {
            target.style.height = minHeight + 'px';
        }
    },

    "click button[type='submit']": function() {

        var post = {
            title: $('#new-post').find('input[name=title]').val(),
            content: $('#new-post-content').val()
        };

        CDCommunity.post(post, function(error) {
            if (error) {
                alert(error.reason);
            } else {
                CDCommunity.hideNewPost();
            }
        });

    },

    'click #cancel-new-post': CDCommunity.cancel,

    'click #upload-image': function() {
        CDCommunity.uploadImage(function(error) {
            if (error) {
                alert(error.reason);
            }
        });
    }

});

Template.newPost.onRendered(function() {

    this.find('#new-post-images')._uihooks = {
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

Template.newPost.onCreated(function() {
    var self = this;
    this.autorun(function() {
        self.subscribe('newImages', CDUser.token());
    });
})