Template.menu.helpers({

    items: function() {
        return CDUI.menu.filterItems();
    },

    itemActiveClass: function () {
        if (CDUI.currentMenuItemName() === this.name) {
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