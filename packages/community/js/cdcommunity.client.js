CDCommunity.showNewPost = function() {
    $('#new-post').fadeIn();
    $('#new-post').find('input[name=title]').focus();
    $('#add-new-post').hide();
}

CDCommunity.hideNewPost = function() {
    $('#new-post').hide();
    $('#new-post').find('input[name=title]').val('');
    $('#new-post-content').val('');
    $('#new-post-content').height($('#new-post-content').css('min-height'));
    $('#add-new-post').show();
}

CDCommunity.post = function(post) {
    var that = this;
    Meteor.call('post', CDUser.token(), post, function(error) {
        if (error) {
            alert(error.reason);
        } else {
            that.hideNewPost();
        }
    });
};

CDCommunity.comment = function(post) {
    Meteor.call('comment', CDUser.token(), post, function(error) {
        if (error) {
            alert(error.reason);
        } else {
            $(event.currentTarget).val('');
        }
    });
};

CDCommunity.pin = function(id) {
    Meteor.call('pin', CDUser.token(), id, function (error) {
        if (error) {
            alert(error.reason);
        }
    });
};