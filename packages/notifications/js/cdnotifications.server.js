var nodemailer = Npm.require('nodemailer');

CDNotifications.emailTransporter = 'smtps://agroleau%40teampalmtree.com:ralkxqptvkfmubmr@smtp.gmail.com';
CDNotifications.fromEmail = '"Castleberry Point" <notifications@castleberrypoint.net>';

CDNotifications.notify = function(token, notification) {

    var userId = CDUser.id(token);
    if (!userId)
        throw new Meteor.Error(401, "You need to login to notify users");
    if (!notification.header)
        throw new Meteor.Error(422, 'Notification title is required');
    if (!notification.message)
        throw new Meteor.Error(422, 'Notification message is required');
    if (!notification.recipientIds)
        throw new Meteor.Error(422, 'Notification receipients required');

    notification.notifierId = userId;
    notification.created = Date.now();
    notification.receipts = {};
    // translate recipient ids (user ids) to receipt objects
    notification.recipientIds.forEach(function(receipientId) {
        notification.receipts[receipientId] = {
            received: false
        };
    });

    var notificationId = CDNotifications.notifications.insert(notification);

    sendNotificationEmails(notification, Meteor.bindEnvironment((info) => {
            if (info) {
                CDNotifications.notifications.update(notificationId, {$set: {messageId: info.messageId}, $unset: {recipientIds: ""}});
            }
        }), (error) => {
            throw new Meteor.Error(500, error);
        }
    );

    return notificationId;

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

function sendNotificationEmails(notification, success, failed) {

    if (notification.recipientIds.length === 0) {
        success();
        return;
    }

    // get all email addresses for the list of recipient ids
    var users = CDUser.users.find({_id: {$in: notification.recipientIds}}, {email : 1});
    var toEmails = [];
    users.forEach(function(user) {
        if (validateEmail(user.email)) {
            toEmails.push(user.email);
        }
    });

    if (toEmails.length === 0) {
        success();
        return;
    }

    // create reusable transporter object using the default SMTP transport
    var emailTransporter = nodemailer.createTransport(CDNotifications.emailTransporter);

    // create email data
    var notificationData = {
        header: notification.header,
        message: notification.message,
        notifier: CDUser.user(notification.notifierId),
        created: notification.created,
        URL: FlowRouter.url(notification.routeName)
    }
    // render email html
    SSR.compileTemplate('notification', Assets.getText('templates/notification.html'));
    var emailHTML = SSR.render("notification", notificationData);
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: CDNotifications.fromEmail,
        to: toEmails,
        subject: notification.header,
        text: notification.message,
        html: emailHTML
    };

    // add reply to message if
    if (_.has(notification, 'replyToMessageId')) {
        mailOptions['inReplyTo'] = notification.replyToMessageId;
    }

    // send mail with defined transport object
    emailTransporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            failed(error);
        }
        success(info);
    });
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
