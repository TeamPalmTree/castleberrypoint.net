Meteor.startup(function () {
    // set up a swipe left / right handler
    $(document.body).touchwipe({
        wipeLeft: function () {
            Session.set('menuOpen', false);
        },
        wipeRight: function () {
            Session.set('menuOpen', true);
        },
        preventDefaultEvents: false
    });
});

Template.page.helpers({

    menuOpen: function () {
        return Session.get('menuOpen') && 'menu-open';
    },

    cordova: function () {
        return Meteor.isCordova && 'cordova';
    }

});

Template.page.events({

    'click #menu-toggle': function () {
        Session.set('menuOpen', !Session.get('menuOpen'));
    },

    'click #section-overlay': function (event) {
        Session.set('menuOpen', false);
        event.preventDefault();
    }

});

Template.page.onRendered(function() {

    this.find('#section-container')._uihooks = {
        insertElement: function(node, next) {
            $(node)
                .hide()
                .insertBefore(next)
                .fadeIn();
        },
        removeElement: function(node) {
            $(node).fadeOut(function() {
                $(this).remove();
            });
        }
    };

});