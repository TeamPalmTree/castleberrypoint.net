CDCommunity.post = function(token, post) {

    var userId = CDUser.id(token);
    if (!userId)
        throw new Meteor.Error(401, "You need to login to post new stories");
    if (!post.title)
        throw new Meteor.Error(422, 'Please fill in a headline');
    // populate post object
    post.authorId = userId;
    post.created = Date.now();
    post.pinned = false;
    var postId = CDCommunity.posts.insert(post);

    // associate images with post
    CDCommunity.images.update({
        uploaderId: CDUser.id(token),
        postId: { $exists: false }
    }, {$set: {postId: postId}}, {multi: 1});

    // get all users
    var recipientIds = CDUser.users.find({}, {_id:1}).map(function(user) { return user._id; });
    // remove our own id
    var recipientUserIdIndex = recipientIds.indexOf(userId);
    recipientIds.splice(recipientUserIdIndex, 1);
    // notify all other users
    CDNotifications.notify(token, {
        recipientIds: recipientIds,
        message: post.title,
        routeName: 'community'
    });

    return postId;

};

CDCommunity.like = function(token, id) {
    var increment = CDUser.react(token, 'post', id, 'like');
    if (increment != 0) {
        CDCommunity.posts.update(id, {$inc: {likes: increment}});
    }
};

CDCommunity.comment = function(token, post) {
    var userId = CDUser.id(token);
    if (!userId)
        throw new Meteor.Error(401, "You need to login to comment");
    post.authorId = userId;
    post.created = Date.now();
    var postId = CDCommunity.posts.insert(post);

    // get the the parent post's user
    // get the user ids of everyone who has commented so far
    // get the user ids of everyone who has liked this post
    var recipientIds = CDUser.users.find({}, {_id:1}).map(function(user) { return user._id; });
    // remove our own id
    var recipientUserIdIndex = recipientIds.indexOf(userId);
    recipientIds.splice(recipientUserIdIndex, 1);
    // notify all other users
    CDNotifications.notify(token, {
        recipientIds: recipientIds,
        message: post.title,
        routeName: 'community'
    });

    return postId;
};

CDCommunity.pin = function(token, id) {
    var admin = CDUser.user(token);
    if (!admin)
        throw new Meteor.Error(401, "You need to login to administrate users");
    if (!admin.admin)
        throw new Meteor.Error(401, "You need to be an admin to administrate");
    var post = CDCommunity.posts.findOne(id);
    if (!post)
        throw new Meteor.Error(401, "Post not found");
    CDCommunity.posts.update(id, {$set: {pinned: !post.pinned}});
};

CDCommunity.uploadImage = function(token, image) {

    var userId = CDUser.id(token);
    if (!userId)
        throw new Meteor.Error(401, "You need to login to upload images");

    image.order = 0;
    var lastImage;
    // find max sort
    if (image.postId) {
        lastImage = CDCommunity.images.findOne({
                postId: image.postId
            },
            {sort: {order: -1}, fields: {order: 1}}
        );
    } else {
        lastImage = CDCommunity.images.findOne({
                uploaderId: CDUser.id(token),
                postId: { $exists: false }
            },
            {sort: {order: -1}, fields: {order: 1}}
        );
    }

    if (lastImage) {
        image.order = lastImage.order + 1;
    }

    image.uploaderId = userId;
    image.uploaded = Date.now();
    var imageId = CDCommunity.images.insert(image);
    return imageId;

};

CDCommunity.deleteImage = function(token, id) {

    var userId = CDUser.id(token);
    if (!userId)
        throw new Meteor.Error(401, "You need to login to delete images");

    // find the image
    var image = CDCommunity.images.findOne(id, {fields: {order: 1, postId: 1}});
    // decrement successive image orders
    if (image.postId) {
        CDCommunity.images.update({
            postId: image.postId,
            order: { $gt: image.order }
        }, {$inc: {order: -1}}, {multi: 1});
    } else {
        CDCommunity.images.update({
            uploaderId: CDUser.id(token),
            postId: { $exists: false },
            order: { $gt: image.order }
        }, {$inc: {order: -1}}, {multi: 1});
    }

    // delete the image
    CDCommunity.images.remove(id);

};

CDCommunity.upImage = function(token, id) {

    var userId = CDUser.id(token);
    if (!userId)
        throw new Meteor.Error(401, "You need to login to up images");

    // get the image
    var image = CDCommunity.images.findOne(id, {fields: {order: 1, postId: 1}});

    var nextImage;
    // get the image above us
    if (image.postId) {
        nextImage = CDCommunity.images.findOne({
            postId: image.postId,
            order: image.order + 1
        },
            {fields: {order: 1}}
        );
    } else {
        nextImage = CDCommunity.images.findOne({
            uploaderId: CDUser.id(token),
            postId: { $exists: false },
            order: image.order + 1
        },
            {fields: {order: 1}}
        );
    }

    if (!nextImage) {
        return;
    }

    // swap orders
    CDCommunity.images.update(image._id, {$inc: {order: 1}});
    CDCommunity.images.update(nextImage._id, {$inc: {order: -1}});

};

CDCommunity.downImage = function(token, id) {

    var userId = CDUser.id(token);
    if (!userId)
        throw new Meteor.Error(401, "You need to login to up images");

    // get the image
    var image = CDCommunity.images.findOne(id, {fields: {order: 1, postId: 1}});
    // if we are at zero, done
    if (image.order == 0) {
        return;
    }

    var previousImage;
    // get the image below us
    if (image.postId) {
        previousImage = CDCommunity.images.findOne({
                postId: image.postId,
                order: image.order - 1
            },
            {fields: {order: 1}}
        );
    } else {
        previousImage = CDCommunity.images.findOne({
                uploaderId: CDUser.id(token),
                postId: { $exists: false },
                order: image.order - 1
            },
            {fields: {order: 1}}
        );
    }

    if (!previousImage) {
        return;
    }

    // swap orders
    CDCommunity.images.update(image._id, {$inc: {order: -1}});
    CDCommunity.images.update(previousImage._id, {$inc: {order: 1}});

};

CDCommunity.cancel = function(token) {
    var userId = CDUser.id(token);
    if (!userId)
        throw new Meteor.Error(401, "You need to login to upload images");
    CDCommunity.images.remove({ uploaderId: userId, postId: { $exists: false }});
};
