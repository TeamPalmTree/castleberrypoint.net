CDUser = {};

CDUser.users = new Mongo.Collection('users');

var usernameField = { 'name': 'username', placeholder: 'Username', icon: 'user', required: true, order: 1 };
var emailField = { 'name': 'email', placeholder: 'Email', icon: 'envelope-o', required: true, order: 2 };
var passwordField = { 'name': 'password', placeholder: 'Password', icon: 'key', type: 'password', required: true, order: 3 };
var confirmPasswordField = { 'name': 'confirmPassword', placeholder: 'Confirm Password', icon: 'key', type: 'password', required: true, same: 'password', order: 4 };
var currentPasswordField = { 'name': 'currentPassword', placeholder: 'Current Password', icon: 'key', type: 'password', required: true, order: 5 };
var newPasswordField = { 'name': 'newPassword', placeholder: 'New Password', icon: 'key', type: 'password', order: 6 };
var confirmNewPasswordField = { 'name': 'confirmNewPassword', placeholder: 'Confirm New Password', icon: 'key', type: 'password', required: true, same: 'newPassword', order: 7 };
var imageField = { 'name': 'image', placeholder: 'Upload your profile image', icon: 'picture-o', type: 'file', order: 999 };

// forms
CDUser.forms = {
    login: {
        fields: [
            usernameField,
            passwordField
        ],
        completePath: null
    },
    join: {
        fields: [
            usernameField,
            emailField,
            passwordField,
            confirmPasswordField,
            imageField
        ],
        completePath: null
    },
    modify: {
        fields: [
            usernameField,
            emailField,
            currentPasswordField,
            newPasswordField,
            confirmNewPasswordField,
            imageField
        ],
        completePath: 'user'
    }
};

CDUser.forms.fieldSorter = function(a, b) {
    if (a.order < b.order) {
        return -1;
    } else if (a.order > b.order) {
        return 1;
    } else {
        return 0;
    }
}

CDUser.getMongoFields = function() {
    var mongoFields = {admin:1};
    this.forms.join.fields.forEach(function(field) {
        if (!_.has(field, 'same')) {
            mongoFields[field.name] = 1;
        }
    });
    return mongoFields;
};