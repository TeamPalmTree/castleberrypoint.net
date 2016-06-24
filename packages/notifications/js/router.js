FlowRouter.route('/notifications', {
    name: 'notifications',
    action: function() {
        BlazeLayout.render("page", { section: "notifications" });
    }
});