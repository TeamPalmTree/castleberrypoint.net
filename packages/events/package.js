Package.describe({
    name: 'chaindaemons:events',
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

    api.versionsFrom('1.2.0.2');

    api.use('ecmascript');
    api.use('less');
    api.use('blaze-html-templates');
    api.use('kadira:flow-router');
    api.use('kadira:blaze-layout');
    //api.use('arillo:flow-router-helpers');
    api.use('rzymek:fullcalendar');
    api.use('momentjs:moment');
    api.use('chaindaemons:ui');
    api.use('mongo');
    api.use('momentjs:moment');

    // templates
    api.addFiles([
        'templates/events.html',
    ], 'client');

    // styles
    api.addFiles([
        'styles/events.less',
    ], 'client');

    // js
    api.addFiles([
        'js/bootstrap.js',
    ]);

    // client js
    api.addFiles([
        'js/events.js',
    ], 'client');

});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
});