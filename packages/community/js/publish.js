Meteor.publish('posts', function(options) {

    var sub = this;
    var commentHandles = [];
    var postHandles = [];
    var userHandles = [];
    var imageHandles = [];

    // send over the top two comments attached to a single post
    function publishPostUser(post) {
        var users = CDUser.users.find({_id: post.authorId}, {fields: {username: 1, image: 1}});
        userHandles[post.authorId] = users.observe({
            added: function(user) {
                sub.added('users', user._id, user);
            }
        });
    }

    // send over the top two comments attached to a single post
    function publishPostImages(post) {
        var images = CDCommunity.images.find({postId: post._id});
        imageHandles[post._id] = images.observe({
            added: function(image) {
                sub.added('images', image._id, image);
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
                sub.added('posts', comment._id, comment);
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
    postHandles = posts.observe({
        added: function(post) {
            publishPostUser(post);
            publishPostImages(post);
            publishPostComments(post);
            sub.added('posts', post._id, post);
        },
        removed: function(post) {
            commentHandles[post._id] && commentHandles[post._id].stop();
            sub.removed('posts', post._id);
        },
        changed: function(newPost, oldPost) {
            sub.changed('posts', oldPost._id, newPost);
        }
    });

    sub.ready();

    // make sure we clean everything up
    sub.onStop(function() {
        postHandles.stop();
        commentHandles.forEach(function(comment) {
            comment.stop();
        });
        imageHandles.forEach(function(image) {
            image.stop();
        });
        userHandles.forEach(function(user) {
            user.stop();
        });
    });

});

Meteor.publish('newImages', function(token) {
    return CDCommunity.images.find({ uploaderId: CDUser.id(token), postId: { $exists: false }}, {sort: {order: 1}});
});