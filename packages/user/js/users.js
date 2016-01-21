Template.users.helpers({

    users: function() {
        var usersSearch = Session.get("users-search").toLowerCase();
        // filter on username, firstName, and lastName
        if (usersSearch && (usersSearch != '')) {

            var filteredUsers = [];
            var users = CDUser.users.find({}, {sort: { username: 1 }});
            users.forEach(function(user) {
                if (user.firstName.toLowerCase().indexOf(usersSearch) !== -1) {
                    filteredUsers.push(user);
                } else if (user.lastName.toLowerCase().indexOf(usersSearch) !== -1) {
                    filteredUsers.push(user);
                } else if (user.username.toLowerCase().indexOf(usersSearch) !== -1) {
                    filteredUsers.push(user);
                }
            });
            return filteredUsers;
        } else {
            return CDUser.users.find({}, {sort: { admin: -1, username: 1 }});
        }
    },

    userAdminClass: function() {
        if (this.admin) {
            return 'enabled';
        }
    }

});

Template.users.onCreated(function() {
    Session.set('users-search', '');
});

Template.users.events({

    'click .administrate': function() {
        CDUser.administrate(this._id);
    }

});

Template.users.events({

    'keyup input[name=search-users]': function(event) {
        Session.set('users-search', event.currentTarget.value);
    }

});