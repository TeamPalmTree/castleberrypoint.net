FlowRouter.route('/login', {
    name: 'login',
    action: function() {
        BlazeLayout.render("page", { section: "login" });
    }
});

FlowRouter.route('/join', {
    name: 'join',
    action: function() {
        BlazeLayout.render("page", { section: "join" });
    }
});

FlowRouter.route('/user', {
    name: 'user',
    action: function() {
        BlazeLayout.render("page", { section: "user" });
    }
});

FlowRouter.route('/users', {
    name: 'users',
    action: function() {
        BlazeLayout.render("page", { section: "users" });
    }
});

FlowRouter.route('/logout', {
    name: 'logout',
    action: function() {
        CDUser.logout();
        BlazeLayout.render("page", { section: "login" });
    }
})