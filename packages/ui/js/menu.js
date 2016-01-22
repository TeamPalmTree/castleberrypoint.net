Template.menu.helpers({

    items: CDUI.menu.filterItems,

    itemActiveClass: function () {
        if (FlowRouter.getRouteName() === this.name) {
            return 'active';
        }
    },

    itemUrl: function() {
        return this.url;
    },

    itemPath: function () {
        return FlowRouter.path(this.name);
    }

});

Template.menu.events({

    'click a': function() {
        Session.set('menuOpen', false);
    }

});