/*jshint eqnull: true, browser: true */
/*global
  describe: false,
  it: false,
  expect: false,
  beforeEach: false,
  runs: false,
  waits: false,
  waitsFor: false,
  SocketWrench: false
*/
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

  it('should emit an error if you close a socket that isn\'t ready', function () {
    var
      wrench = new SocketWrench(this.defaults),
      error;

    wrench.on('error', function (err) {
      error = err;
    });

    wrench.open();
    wrench.close();

    waitsFor(function () {
      return error === 'Tried to close socket before ready';
    }, 4000);

    runs(function () {
      expect(error).toBe('Tried to close socket before ready');
    });
  });

}); // describe