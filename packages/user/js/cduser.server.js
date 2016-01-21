var crypto = Npm.require('crypto');

CDUser.hash = function(value) {
    var hash = crypto.createHash('sha256');
    hash.update(value);
    return hash.digest('base64');
};

CDUser.random = function() {
    return crypto.randomBytes(48).toString('hex');
};

CDUser.user = function(token) {
    return this.users.findOne({'token.hashed':this.hash(token)});
};

CDUser.id = function(token) {
    return this.user(token)._id;
};

CDUser.login = function(user) {

    // first attempt to find the user
    var user = CDUser.users.findOne({$and: [
        {$or: [
            {username: user.username},
            {email: user.username}
        ]},
        {hashedPassword: this.hash(user.password)}
    ]});
    if (!user) {
        throw new Meteor.Error(400, "User credentials invalid");
    }

    return this.tokenize(user);

};

CDUser.join = function(user) {

    if (!this.check('username', user.username)) {
        throw new Meteor.Error(400, "Username already taken");
    }

    if (!this.check('email', user.email)) {
        throw new Meteor.Error(400, "Email already taken");
    }

    user.hashedPassword = this.hash(user.password);
    delete user.password;
    user._id = this.users.insert(user);
    return this.tokenize(user);
};

CDUser.tokenize = function(user) {
    var token = this.random();
    CDUser.users.update(user._id, {$set: {token: {
        hashed: this.hash(token),
        when: new Date
    }}});
    return {
        id: user._id,
        token: token
    };
}

CDUser.check = function(field, value) {
    var selector = {};
    selector[field] = value;
    return !CDUser.users.findOne(selector);
};

CDUser.modify = function(token, updatedUser) {

    // first get the logged in user
    var currentUser = this.user(token);
    if (!currentUser) {
        throw new Meteor.Error(400, "User token invalid");
    }

    // verify password
    currentUser = CDUser.users.findOne({$and: [
        {username: currentUser.username},
        {hashedPassword: this.hash(updatedUser.currentPassword)}
    ]});
    if (!currentUser) {
        throw new Meteor.Error(400, "Current password invalid");
    }

    if (updatedUser.username !== currentUser.username) {
        if (!this.check('username', updatedUser.username)) {
            throw new Meteor.Error(400, "Username already taken");
        }
    }

    if (updatedUser.email !== currentUser.email) {
        if (!this.check('email', updatedUser.email)) {
            throw new Meteor.Error(400, "Email already taken");
        }
    }

    // update to any new password
    if (updatedUser.newPassword !== '') {
        updatedUser.hashedPassword = this.hash(updatedUser.newPassword);
    }

    // delete fields we don't need
    updatedUser = this.cleanse(updatedUser, this.forms.modify.fields);
    this.users.update(currentUser._id, {$set: updatedUser});

};

CDUser.cleanse = function(user, fields) {

    var cleanFields = ['hashedPassword'];
    fields.forEach(function(field) {
        if (!field.same && (field.type !== 'password')) {
            cleanFields.push(field.name);
        }
    });

    var cleanUser = {};
    for (var property in user) {
        if (cleanFields.indexOf(property) !== -1) {
            cleanUser[property] = user[property];
        }
    }

    return cleanUser;

};

CDUser.administrate = function(token, id) {

    // first get the logged in user
    var currentUser = this.user(token);
    if (!currentUser) {
        throw new Meteor.Error(400, "User token invalid");
    }

    // now verify we are an admin
    if (!currentUser.admin) {
        throw new Meteor.Error(400, "Only administrators can administrate");
    }

    var user = CDUser.users.findOne({_id: id});
    if (!user) {
        throw new Meteor.Error(400, "User not found to administrate");
    }

    CDUser.users.update(id,{$set:{admin: !user.admin}});

};

Meteor.startup(function() {
    Meteor.publish('users', function () {
        return CDUser.users.find({}, { fields: CDUser.getMongoFields() });
    });
});