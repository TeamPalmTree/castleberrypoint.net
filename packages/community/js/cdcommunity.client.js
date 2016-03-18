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
    Meteor.call('CDCommunity.post', CDUser.token(), post, callback);
};

CDCommunity.comment = function(post, callback) {
    Meteor.call('CDCommunity.comment', CDUser.token(), post, callback);
};

CDCommunity.pin = function(id, callback) {
    Meteor.call('CDCommunity.pin', CDUser.token(), id, callback);
};

CDCommunity.uploadImage = function(callback) {
    var input = $(document.createElement('input'));
    input.attr("type", "file");
    $(input).on('change', function(event) {
        var file = event.target.files[0]; //assuming 1 file only
        if (!file) { return; }
        processImage(file, 600, 600, function(data) {
            Meteor.call('CDCommunity.uploadImage', CDUser.token(), { data: data }, function(error) {
                callback(error);
            });
        });
    });
    input.trigger('click');
};

CDCommunity.deleteImage = function(id, callback) {
    Meteor.call('CDCommunity.deleteImage', CDUser.token(), id, callback);
};

CDCommunity.upImage = function(id, callback) {
    Meteor.call('CDCommunity.upImage', CDUser.token(), id, callback);
};

CDCommunity.downImage = function(id, callback) {
    Meteor.call('CDCommunity.downImage', CDUser.token(), id, callback);
};

CDCommunity.showImage = function(event) {

    var fullscreen = $('<div id="post-image-fullscreen"></div>');
    var close = $('<div class="close"><i class="fa fa-times"></i></div>');
    close.click(CDCommunity.hideImage);
    close.appendTo(fullscreen);
    var image = $(event.target).parent('.post-image').find('img').clone();
    image.appendTo(fullscreen);
    fullscreen.appendTo('body');

    $('#post-image-fullscreen').animate({
        opacity: 1
    }, 'fast');

};

CDCommunity.hideImage = function() {
    $('#post-image-fullscreen').animate({
        opacity: 0
    }, 'fast', function() {
        $('#post-image-fullscreen').remove();
    });
};

CDCommunity.cancel = function(callback) {
    Meteor.call('CDCommunity.cancel', CDUser.token(), function() {
        CDCommunity.hideNewPost();
    });
};