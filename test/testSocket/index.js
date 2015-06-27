/*jshint eqnull: true, browser: false */
/*global module, require */

'use strict';

var WebSocketServer = require('ws').Server;
var port = 4014;
var testSocket;

function start () {
   testSocket = new WebSocketServer({port : port});
   testSocket.on('connection', function connected (socket) {
      socket.send('hello');
    });
}

function stop () {
  testSocket.close();
}

module.exports = {
  start: start,
  stop: stop
};