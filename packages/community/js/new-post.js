import Quill from 'quill';

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

    "click button[type='submit']": function() {

        var post = {
            title: $('#new-post').find('input[name=title]').val(),
            content: $('#new-post-content').find('.ql-editor').html()
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

    new Quill('#new-post-content', {
        theme: 'snow',
        placeholder: 'Post content',
    });

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
