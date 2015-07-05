/*jshint eqnull: true, browser: true */
/*global describe, it, expect, beforeEach, afterEach, SocketWrench, window*/

  // .isReady
describe('.isReady', function () {
  'use strict';

  beforeEach(function () {
    this.defaults = {
      url : 'ws://localhost:4014',
      autoConnect : false
    };
    this.wsValue = window.WebSocket;
  });

  afterEach(function () {
    window.WebSocket = this.wsValue;
  });

  it('should be a function', function () {
    var wrench = new SocketWrench(this.defaults);
    expect(typeof wrench.isReady).toBe('function');
  });

  it('returns false when the socket does not exist', function () {
    window.WebSocket = null;
    var wrench = new SocketWrench(this.defaults);
    expect(wrench.isReady()).toBe(false);
  });

  it('returns false when the socket is not ready', function () {
    var wrench = new SocketWrench(this.defaults);
    expect(wrench.isReady()).toBe(false);
  });

 it('returns true when the socket is ready', function (done) {
   var wrench = new SocketWrench(this.defaults);
   wrench.open();

   wrench.on('ready', function () {
     expect(wrench.isReady()).toBe(true);
     done();
   });
 });
});
