/*global require, __dirname, process */

'use strict';

var path = require('path');
var root = path.join(__dirname, '../..');
var gulp = require('gulp');
var coveralls = require('gulp-coveralls');
var gutil = require('gulp-util');
var Server = require('karma').Server;
var testSocket = require(path.join(root,'test/testSocket/'));
var env = process.env.NODE_ENV || 'development';

function reportCoverageToCoveralls () {
  gutil.log('Sending LCOV data to Coveralls.io');
  gulp.src('test/coverage/**/lcov.info')
    .pipe(coveralls());
}

gulp.task('test', function (done) {
  var server;
  testSocket.start();

  server = new Server({
    configFile: path.join(root, 'karma.conf.js'),
    singleRun: true
  }, function () {
    testSocket.stop();
    if ('ci' === env) {
      reportCoverageToCoveralls();
    }
    done();
  });

  server.start();
});
