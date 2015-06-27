/*global require, __dirname */

'use strict';

var path = require('path');
var root = path.join(__dirname, '../..');
var gulp = require('gulp');
var karma = require('karma').server;
var testSocket = require(path.join(root,'test/testSocket/'));

gulp.task('test', function (done) {
  testSocket.start();

  karma.start({
    configFile: path.join(root, 'karma.conf.js'),
    singleRun: true
  }, function () {
    testSocket.stop();
    done();
  });
});
