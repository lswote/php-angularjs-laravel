// Karma configuration
// Generated on Sat Jun 18 2016 11:05:09 GMT-0400 (Eastern Daylight Time)

module.exports = function(config){
  config.set({

    // Base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // Frameworks to use
    // Available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // List of files / patterns to load in the browser
    files: [
        'js/vendor/jquery-1.11.1.min.js',
        'js/vendor/angular.js',
        'js/vendor/angular-route.js',
		'js/vendor/angular-mocks.js',
		'js/vendor/ng-picker.js',
        'js/app/app.js',
        'js/app/services/**/',
        'js/app/controllers/**/',
        'js/app/tests/**/'
    ],


    // List of files to exclude
    exclude: [
    ],


    // Preprocess matching files before serving them to the browser
    // Available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // Test results reporter to use
    // Possible values: 'dots', 'progress'
    // Available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // Web server port
    port: 9876,


    // Enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // Possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // Enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers
    // Available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // How many browser should be started simultanous
    concurrency: Infinity
  })
};