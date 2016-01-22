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

CDCommunity.post = function(post, callback) {
    var that = this;
    Meteor.call('post', CDUser.token(), post, callback);
};

CDCommunity.comment = function(post, callback) {
    Meteor.call('comment', CDUser.token(), post, callback);
};

CDCommunity.pin = function(id, callback) {
    Meteor.call('pin', CDUser.token(), id, callback);
};