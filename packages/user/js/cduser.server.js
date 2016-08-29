var crypto = Npm.require('crypto');

CDUser.hash = function(value) {
    if (!value)
      return;
    var hash = crypto.createHash('sha256');
    hash.update(value);
    return hash.digest('base64');
};

CDUser.random = function() {
    return crypto.randomBytes(48).toString('hex');
};

CDUser.user = function(token) {
    return this.users.findOne({'token.hashed': this.hash(token)});
};

CDUser.id = function(token) {
    var user = this.user(token);
    if (!user) {
        throw new Meteor.Error(400, "User credentials invalid");
    }
    return user._id;
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
    var user = this.user(token);
    if (!user) {
        throw new Meteor.Error(400, "User token invalid");
    }

    // verify password
    user = CDUser.users.findOne({$and: [
        {username: user.username},
        {hashedPassword: this.hash(updatedUser.currentPassword)}
    ]});
    if (!user) {
        throw new Meteor.Error(400, "Current password invalid");
    }

    if (updatedUser.username !== user.username) {
        if (!this.check('username', updatedUser.username)) {
            throw new Meteor.Error(400, "Username already taken");
        }
    }

    if (updatedUser.email !== user.email) {
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
    this.users.update(user._id, {$set: updatedUser});

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
    var user = this.user(token);
    if (!user) {
        throw new Meteor.Error(400, "User token invalid");
    }

    // now verify we are an admin
    if (!user.admin) {
        throw new Meteor.Error(400, "Only administrators can administrate");
    }

    var user = CDUser.users.findOne({_id: id});
    if (!user) {
        throw new Meteor.Error(400, "User not found to administrate");
    }

    CDUser.users.update(id,{$set: {admin: !user.admin}});

};

CDUser.react = function(token, type, id, emotion) {

    // first get the logged in user
    var user = this.user(token);
    if (!user) {
        throw new Meteor.Error(400, "User token invalid");
    }

    var objectComparison = {};
    objectComparison[type + "Id"] = id;
    var reaction = CDUser.reactions.findOne({$and: [{ userId: user._id }, objectComparison]});

    if (reaction) {
        if (reaction.emotion == emotion) {
            CDUser.reactions.remove(reaction._id);
            return -1;
        }
        CDUser.reactions.update(reaction._id, {$set: {emotion: emotion}});
        return 0;
    }

    reaction = { userId: user._id, emotion: emotion };
    reaction[type + "Id"] = id;
    CDUser.reactions.insert(reaction);
    return 1;

};
