Meteor.startup(function() {
    Meteor.subscribe('users');
    Session.set('user.id', localStorage.getItem('user.id'));
    Session.set('user.token', localStorage.getItem('user.token'));
});