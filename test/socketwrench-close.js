/*jshint eqnull: true, browser: true */
/*global describe, it, expect, beforeEach, SocketWrench */
describe('Socket Wrench - Prototype Functions', function () {
  'use strict';

  beforeEach(function () {
    this.defaults = {
      url : 'ws://localhost:4014',
      autoConnect : false
    };
  });

  it('should have a close function', function () {
    var wrench = new SocketWrench(this.defaults);

    expect(wrench.close).toBeDefined();
    expect(typeof wrench.close).toBe('function');
  });

  it('should emit an error if you close a socket that isn\'t ready', function (done) {
    var
      wrench = new SocketWrench(this.defaults),
      error;

    wrench.on('error', function (err) {
      error = err;
    });

    wrench.open();
    wrench.close();

    setTimeout(function () {
      expect(error).toBe('Tried to close socket before ready');
      done();
    }, 4000);
  });

}); // describe
