Package.describe({
    name: 'chaindaemons:community',
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
    api.use('chaindaemons:user');
    api.use('mongo');
    api.use('momentjs:moment');
    api.use('ccorcos:clientside-image-manipulation');

    // templates
    api.addFiles([
        'templates/community.html',
        'templates/post.html',
        'templates/new-post.html',
        'templates/comment.html',
        'templates/post-image.html'
    ], 'client');

    // styles
    api.addFiles([
        'styles/post.less',
        'styles/post-image.less'
    ], 'client');

    // js
    api.addFiles([
        'js/bootstrap.js',
        'js/cdcommunity.global.js',
        'js/queries.js'
    ]);

    // server js
    api.addFiles([
        'js/cdcommunity.server.js',
        'js/publish.js',
        'js/methods.js'
    ], 'server');

    // client js
    api.addFiles([
        'js/cdcommunity.client.js',
        'js/router.js',
        'js/community.js',
        'js/post.js',
        'js/new-post.js',
        'js/post-image.js',
        'js/comment.js'
    ], 'client');

    api.export([
        'CDCommunity'
    ], ['client', 'server']);

});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('chaindaemons:blog');
});