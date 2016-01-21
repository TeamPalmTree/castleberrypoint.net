var loginErrorsKey = 'loginErrors';

Template.login.onCreated(function () {
    Session.set(loginErrorsKey, {});
});

Template.login.helpers({

    errors: function () {
        return _.values(Session.get(loginErrorsKey));
    },

    errorClass: function (key) {
        return Session.get(loginErrorsKey)[key] && 'error';
    },

    joinPath: function() {
        return FlowRouter.path('join');
    },

    fields: function() {
        return CDUser.forms.login.fields;
    },

    fieldType: CDUser.getFieldType

});

Template.login.events({
    'submit form': function (event) {
        event.preventDefault();

        // process form
        var result = CDUser.process(event.target, CDUser.forms.login.fields);

        Session.set(loginErrorsKey, result.errors);
        if (_.keys(result.errors).length) {
            return;
        }

        CDUser.login(result.user, function(error) {
            Session.set(loginErrorsKey, {none: error.reason});
        });
    }
});
