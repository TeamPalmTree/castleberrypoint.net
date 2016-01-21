var userErrorsKey = 'userErrors';

Template.user.helpers({

    errors: function () {
        return _.values(Session.get(userErrorsKey));
    },

    errorClass: function (key) {
        return Session.get(userErrorsKey)[key] && 'error';
    },

    firstName: function() {
        var user = CDUser.user();
        if (user) {
            return user.firstName;
        }
    },

    fields: function() {
        return CDUser.forms.modify.fields.sort(CDUser.forms.fieldSorter);
    },

    fieldType: CDUser.getFieldType,

    fieldValue: CDUser.getFieldValue,

    isFieldFile: CDUser.isFieldFile

});

Template.user.onCreated(function () {
    Session.set(userErrorsKey, {});
});

Template.user.events({

    'submit form': function (event) {
        event.preventDefault();

        // process form
        var result = CDUser.process(event.target, CDUser.forms.modify.fields);

        var errors = result.errors;
        Session.set(userErrorsKey, errors);
        // if we have errors, don't create user
        if (_.keys(errors).length) {
            return;
        }

        CDUser.modify(result.user, function(error) {
            Session.set(userErrorsKey, {none: error.reason});
        });

    }

});