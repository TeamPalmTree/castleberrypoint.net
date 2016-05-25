Package.describe({
    name: 'chaindaemons:notifications',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: '',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function (api) {

    api.versionsFrom('1.2.1');

    // imports
    api.use('ecmascript');
    api.use('less');
    api.use('blaze-html-templates');
    api.use('mongo');
    api.use('kadira:flow-router');
    api.use('kadira:blaze-layout');
    api.use('arillo:flow-router-helpers');
    //api.use('arillo:flow-router-helpers');
    api.use('mobile-experience');
    api.use('session');
    api.use('jquery');
    api.use('tracker');
    api.use('underscore');
    api.use('fortawesome:fontawesome@4.5.0');
    api.use('ccorcos:clientside-image-manipulation');
    api.use('momentjs:moment');
    api.use('chaindaemons:ui');
    api.use('mongo');

});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('chaindaemons:ui');
    api.addFiles('ui-tests.js');
});
