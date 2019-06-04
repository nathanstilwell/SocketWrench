/*global module */
// Karma configuration
// Generated on Fri Jun 26 2015 20:02:37 GMT-0400 (EDT)
const puppeteer = require('puppeteer');

process.env.CHROME_BIN = puppeteer.executablePath();

module.exports = function(config) {
  'use strict';
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'lib/socketwrench.js',
      'test/*.js'
    ],
    exclude: [],
    preprocessors: {
      'lib/*.js': ['coverage'],
    },
    reporters: ['dots','coverage'],
    coverageReporter: {
      type: 'lcov',
      dir: 'test/coverage/'
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox'],
      },
    },
  });
};
