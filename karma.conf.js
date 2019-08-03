// Karma configuration
// Generated on Wed Jul 31 2019 22:08:39 GMT-0600 (Mountain Daylight Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',
    // basePath: '/',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      //** Local Dependencies
      'public/js/libs/angular.min.js',

      //** Node Dependencies
      'node_modules/angular-mocks/angular-mocks.js',

      //** Controller/Service Files
      'public/js/app.module.js',
      // 'public/js/*.js',
      // 'public/js/**/*.js',
      'public/js/filters/app.filters.js',
      'public/js/services/game.service.js',
      'public/js/services/player.service.js',

      //** Test Files Folder
      // 'tests/js/*.js'
      // 'tests/js/game.service.Spec.js',
      'tests/js/player.service.Spec.js',
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    // browsers: ['Chrome'],
    browsers: ['ChromeHeadless'],
    // browsers: [],

    plugins: [
      // Karma will require() these plugins
      'karma-jasmine',
      // 'karma-chrome-launcher'
    
      // // inlined plugins
      // {'framework:xyz': ['factory', factoryFn]},
      // require('./plugin-required-from-config')
    ],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    // singleRun: false,
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
