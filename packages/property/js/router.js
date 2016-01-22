FlowRouter.route('/directory', {
    name: 'directory',
    action: function() {
        BlazeLayout.render("page", { section: "directory" });
    }
});

FlowRouter.route('/retail', {
    name: 'retail',
    action: function() {
        BlazeLayout.render("page", { section: "retail" });
    }
});
