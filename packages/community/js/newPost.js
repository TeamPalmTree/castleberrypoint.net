Template.newPost.helpers({

    username: function() {
        var user = CDUser.user();
        if (user) {
            return user.username;
        }
    },

    authorImage: function() {
        return CDUser.image();
    },

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

        CDCommunity.post(post);

    }

});