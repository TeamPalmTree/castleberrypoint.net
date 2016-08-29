Meteor.publish('posts', function(token, options) {

    var subscription = this;

    var postHandle;
    var userHandles = [];
    var reactionHandles = [];
    var imageHandles = [];
    var commentHandles = [];

    // send over the top two comments attached to a single post
    function publishPostUser(post) {
        var users = CDUser.users.find({_id: post.authorId}, {fields: {username: 1, image: 1}});
        userHandles[post._id] = users.observe({
            added: function(user) {
                subscription.added('users', user._id, user);
            }
        });
    }

    // send over the top two comments attached to a single post
    function publishPostReactions(post) {
        var userId = CDUser.id(token);
        var reactions = CDUser.reactions.find({$and: [{postId: post._id}, {userId: userId}]}, {fields: {postId: 1, userId: 1, emotion: 1}});
        reactionHandles[post._id] = reactions.observe({
            added: function(reaction) {
                subscription.added('reactions', reaction._id, reaction);
            },
            removed: function(reaction) {
                subscription.removed('reactions', reaction._id);
            },
            changed: function(newPost, oldReaction) {
                subscription.changed('reactions', oldReaction._id, newReaction);
            }
        });
    }

    // send over the top two comments attached to a single post
    function publishPostImages(post) {
        var images = CDCommunity.images.find({postId: post._id});
        imageHandles[post._id] = images.observe({
            added: function(image) {
                subscription.added('images', image._id, image);
            }
        });
    }

    // send over the top two comments attached to a single post
    function publishPostComments(post) {
        var comments = CDCommunity.posts.find({postId: post._id}, {
            fields: {
                content: 1,
                postId: 1,
                authorId: 1,
                created: 1
            },
            sort: {created: -1}
        });
        commentHandles[post._id] = comments.observe({
            added: function(comment) {
                publishPostUser(comment);
                subscription.added('posts', comment._id, comment);
            }
        });

    }

    // get authors given username
    var authorIds = CDUser.users.find({
        username: { $regex: ".*" + options.search + ".*", '$options' : 'i'}
    }, {fields: {_id: 1}}).map(function(user) {
        return user._id;
    });

    var postsSelector = { postId: { $exists: false }};
    // check for a search
    if (options.search) {
        postsSelector.$or = [
            { title: { $regex: ".*" + options.search + ".*", '$options' : 'i'}},
            { content: { $regex: ".*" + options.search + ".*", '$options' : 'i'}},
            { authorId: { $in: authorIds }}
        ];
    }

    var posts = CDCommunity.posts.find(postsSelector, {
        limit: options.limit,
        sort: options.sort,
        fields: {
            title: 1,
            content: 1,
            authorId: 1,
            created: 1,
            pinned: 1
        }
    });

    postHandle = posts.observe({
        added: function(post) {
            publishPostUser(post);
            publishPostReactions(post);
            publishPostImages(post);
            publishPostComments(post);
            subscription.added('posts', post._id, post);
        },
        removed: function(post) {
            userHandles[post._id].stop();
            reactionHandles[post._id].stop();
            imageHandles[post._id].stop();
            commentHandles[post._id].stop();
            subscription.removed('posts', post._id);
        },
        changed: function(newPost, oldPost) {
            subscription.changed('posts', oldPost._id, newPost);
        }
    });

    subscription.ready();

    // make sure we clean everything up
    subscription.onStop(function() {
        postHandle.stop();
        userHandles.forEach(function(userHandle) {
            userHandle.stop();
        });
        reactionHandles.forEach(function(reactionHandle) {
            reactionHandle.stop();
        });
        imageHandles.forEach(function(imageHandle) {
            imageHandle.stop();
        });
        commentHandles.forEach(function(commentHandle) {
            commentHandle.stop();
        });
    });

});

Meteor.publish('newImages', function(token) {
    return CDCommunity.images.find({ uploaderId: CDUser.id(token), postId: { $exists: false }}, {sort: {order: 1}});
});
