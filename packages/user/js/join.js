var joinErrorsKey = 'joinErrors';

Template.join.onCreated(function () {
    Session.set(joinErrorsKey, {});
});

Template.join.helpers({

    errors: function () {
        return _.values(Session.get(joinErrorsKey));
    },

    errorClass: function (key) {
        return Session.get(joinErrorsKey)[key] && 'error';
    },

    loginPath: function() {
        return FlowRouter.path('login');
    },

    fields: function() {
        return CDUser.forms.join.fields.sort(CDUser.forms.fieldSorter);
    },

    fieldType: CDUser.getFieldType,

    isFieldFile: CDUser.isFieldFile

});

Template.join.events({

    'submit form': function (event) {
        event.preventDefault();

        // process form
        var result = CDUser.process(event.target, CDUser.forms.join.fields);

        Session.set(joinErrorsKey, result.errors);
        // if we have errors, don't create user
        if (_.keys(result.errors).length) {
            return;
        }

        CDUser.join(result.user, function(error) {
            Session.set(joinErrorsKey, {none: error.reason});
        });

    },

    'change input[type=file]': CDUser.upload

});
