Template.community.helpers({

    posts: function() {
        var sort;
        var postsSearch = Session.get('posts-search');
        if (postsSearch && postsSearch != '') {
            sort = {created: -1};
        } else {
            sort = {pinned: -1, created: -1};
        }
        return CDCommunity.posts.find({ postId: { $exists: false }}, {sort: sort});
    }

});

Template.community.events({

    'click #add-new-post': CDCommunity.showNewPost

});

Template.community.onRendered(function() {

    this.find('.scrollable')._uihooks = {
        insertElement: function(node, next) {
            var blah = $(node)
                .hide()
                .insertBefore(next);
            if (Session.get("posts-search") == '') {
                blah.fadeIn();
            } else {
                blah.show();
            }
        }
    };

});

Template.community.events({

    'keyup input[name=search-posts]': function(event) {
        Session.set('posts-search', event.currentTarget.value);
    }

});

Template.community.onCreated(function() {
    Session.set('posts-search', '');
    var self = this;
    this.autorun(function() {
        var postsSearch = Session.get('posts-search');
        if (postsSearch && postsSearch != '') {
            self.subscribe('posts', {search: postsSearch, limit: 20, sort: {created: -1}});
        } else {
            self.subscribe('posts', {limit: 20, sort: {pinned: -1, created: -1}});
        }
    });
});