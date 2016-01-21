CDCommunity.post = function(token, post) {
    var userId = CDUser.id(token);
    if (!userId)
        throw new Meteor.Error(401, "You need to login to post new stories");
    if (!post.title)
        throw new Meteor.Error(422, 'Please fill in a headline');
    // pick out the whitelisted keys
    post.authorId = userId;
    post.created = Date.now();
    post.pinned = false;
    var postId = CDCommunity.posts.insert(post);
    return postId;
};

CDCommunity.comment = function(token, post) {
    var userId = CDUser.id(token);
    if (!userId)
        throw new Meteor.Error(401, "You need to login to post new stories");
    post.authorId = userId;
    post.created = Date.now();
    var postId = CDCommunity.posts.insert(post);
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