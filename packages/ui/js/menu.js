Template.menu.helpers({

    items: function() {
        return CDUI.menu.filterItems();
    },

    itemActiveClass: function () {
        if (CDUI.routeName() === this.routeName) {
            return 'active';
        }
    },

    itemUrl: function() {
        return this.url;
    },

    itemPath: function () {
        return FlowRouter.path(this.routeName);
    }

});

Template.menu.events({

    'click a': function() {
        Session.set('menuOpen', false);
    }

});