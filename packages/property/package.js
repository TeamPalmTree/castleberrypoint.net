Package.describe({
    name: 'chaindaemons:property',
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
    api.use('reactive-var');
    api.use('blaze-html-templates');
    api.use('kadira:flow-router');
    api.use('kadira:blaze-layout');
    //api.use('arillo:flow-router-helpers');
    api.use('momentjs:moment');
    api.use('chaindaemons:ui');
    api.use('chaindaemons:user');
    api.use('mongo');
    api.use('webtempest:animate');

    // templates
    api.addFiles([
        'templates/directory.html',
        'templates/retail.html'
    ], 'client');

    // styles
    api.addFiles([
        'styles/unit.less',
        'styles/retail.less'
    ], 'client');

    api.addFiles([
        'js/bootstrap.js',
    ]);

    // client js
    api.addFiles([
        'js/router.js',
        'js/directory.js',
        'js/retail.js'
    ], 'client');

});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('chaindaemons:blog');
});