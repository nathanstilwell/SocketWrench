/*jshint esnext: true, laxcomma: true, eqeqeq: true, bitwise: true, curly: true, latedef: true, strict: true, plusplus: true*/
/*global require: true*/

'use strict';
//
//  require-dir is a module that will look at a directory and call require()
//  on every file in that directory (and all of its subdirectories if recursive
//  is true). So in this gulpfile we are loading ever file in the gulp/task
//  directory. Each of those files contain an individual task. And so to add
//  more tasks just create a file in that folder
//
require('require-dir')('./gulp/tasks', { recurse: true });
