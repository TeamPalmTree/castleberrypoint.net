FlowRouter.route('/community', {
    name: 'community',
    action: function() {
        BlazeLayout.render("page", { section: "community" });
    }
});

FlowRouter.route('/events', {
    name: 'events',
    action: function() {
        BlazeLayout.render("page", { section: "events" });
    }
});

FlowRouter.route('/documents', {
    name: 'documents',
    action: function() {
        BlazeLayout.render("page", { section: "documents" });
    }
});

FlowRouter.route('/account', {
    name: 'account',
    action: function() {
        BlazeLayout.render("page", { section: "account" });
    }
});