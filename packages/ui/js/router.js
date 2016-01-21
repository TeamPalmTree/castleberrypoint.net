FlowRouter.route('/', {
    name: 'home',
    action: function() {
        FlowRouter.go(CDUI.homePath());
    }
});