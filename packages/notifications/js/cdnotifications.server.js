var nodemailer = Npm.require('nodemailer');

CDNotifications.emailTransporter = 'smtps://agroleau%40teampalmtree.com:ralkxqptvkfmubmr@smtp.gmail.com';
CDNotifications.fromEmail = '"Castleberry Point" <notifications@castleberrypoint.net>';

CDNotifications.notify = function(token, notification) {
    var userId = CDUser.id(token);
    if (!userId)
        throw new Meteor.Error(401, "You need to login to notify users");
    if (!notification.message)
        throw new Meteor.Error(422, 'A message is required');
    notification.notifierId = userId;
    notification.created = Date.now();
    notification.receipts = {};
    // translate recipient ids (user ids) to receipt objects
    notification.recipientIds.forEach(function(receipientId) {
        notification.receipts[receipientId] = {
            received: false
        };
    });

    // get all email addresses for the list of recipient ids
    var toEmails = CDUser.users.find({_id: {$in: notification.recipientIds}}, {email:1}).map(function(user) { return user.email; });
    // create reusable transporter object using the default SMTP transport
    var emailTransporter = nodemailer.createTransport(this.emailTransporter);

    // create email data
    var notificationData = {
        message: notification.message,
        notifier: CDUser.user(userId),
        created: notification.created,
        URL: FlowRouter.url(notification.routeName)
    }
    // render email html
    SSR.compileTemplate('notification', Assets.getText('templates/notification.html'));
    var emailHTML = SSR.render("notification", notificationData);
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: this.fromEmail,
        to: toEmails,
        subject: notification.message,
        text: notification.message,
        html: emailHTML
    };
    // send mail with defined transport object
    emailTransporter.sendMail(mailOptions, function(error){
        if (error){
            throw new Meteor.Error(422, "Failed to email out notification");
        }
    });

    // remove the recipient ids node
    delete notification.recipientIds;
    CDNotifications.notifications.insert(notification);
};

CDNotifications.clear = function(token, routeName) {
    var userId = CDUser.id(token);
    if (!userId)
        throw new Meteor.Info(422, "Failed to email out notification");
    var params = {};
    if (routeName) {
        params.routeName = routeName;
    }
    // set notifications for this user (and possibly menu item) to received
    var $set = {};
    $set["receipts." + userId + ".received"] = true;
    CDNotifications.notifications.update(params, {$set: $set}, {multi: true});
};
