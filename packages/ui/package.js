Package.describe({
    name: 'chaindaemons:ui',
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
    api.use('fortawesome:fontawesome@4.5.0');
    api.use('momentjs:moment');
    
    // templates
    api.addFiles([
        'templates/head.html',
        'templates/page.html',
        'templates/app-not-found.html',
        'templates/loading.html',
        'templates/menu.html',
    ], 'client');

    // assets
    api.addAssets([
        'fonts/OpenSans-Light-webfont.eot',
        'fonts/OpenSans-Light-webfont.svg',
        'fonts/OpenSans-Light-webfont.ttf',
        'fonts/OpenSans-Light-webfont.woff',
        'fonts/OpenSans-Regular-webfont.eot',
        'fonts/OpenSans-Regular-webfont.svg',
        'fonts/OpenSans-Regular-webfont.ttf',
        'fonts/OpenSans-Regular-webfont.woff',
    ], 'client');

    // styles
    api.addFiles([
        'styles/app-not-found.import.less',
        'styles/base.import.less',
        'styles/button.import.less',
        'styles/fontface.import.less',
        'styles/form.import.less',
        'styles/helpers.import.less',
        'styles/page.import.less',
        'styles/section.import.less',
        'styles/lesshat.import.less',
        'styles/link.import.less',
        'styles/loading.import.less',
        'styles/menu.import.less',
        'styles/message.import.less',
        'styles/header.import.less',
        'styles/notification.import.less',
        'styles/reset.import.less',
        'styles/text.import.less',
        'styles/typography.import.less',
        'styles/variables.import.less',
    ], 'client');

    // exported style
    api.addFiles([
        'styles/main.less'
    ], 'client', { isImport: true });

    // isomorphic
    api.addFiles([
        'js/cdui.global.js'
    ]);

    // client js
    api.addFiles([
        'js/cdui.client.js',
        'js/router.js',
        'js/page.js',
        'js/touchwipe.js',
        'js/menu.js',
        'js/bootstrap.js'
    ], 'client');

    api.export([
        'CDUI'
    ], ['client', 'server']);

});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('chaindaemons:ui');
    api.addFiles('ui-tests.js');
});
