/*jshint eqnull: true, browser: true */
/*global
  describe: false,
  it: false,
  runs: false,
  waitsFor: false,
  expect: false,
  beforeEach: false,
  SocketWrench: false,
  window: false
*/

  // .isReady
describe('.isReady', function () {
  'use strict';

  beforeEach(function () {
    this.defaults = {
      url : 'ws://localhost:4014',
      autoConnect : false
    };
  });

  it('should be a function', function () {
    var wrench = new SocketWrench(this.defaults);
    expect(typeof wrench.isReady).toBe('function');
  });

  it('returns false when the socket does not exist', function () {
    this.wsValue = window.WebSocket;
    window.WebSocket = null;
    var wrench = new SocketWrench(this.defaults);
    expect(wrench.isReady()).toBe(false);
    window.WebSocket = this.wsValue;
  });

  it('returns false when the socket is not ready', function () {
    var wrench = new SocketWrench(this.defaults);
    expect(wrench.isReady()).toBe(false);
  });

  it('returns true when the socket is ready', function () {
    var wrench = new SocketWrench(this.defaults);
    wrench.open();

    waitsFor(function () {
      return wrench.isReady();
    }, 4000);

    runs(function () {
      expect(wrench.isReady()).toBe(true);
    });

    runs(function () {
      wrench.close();
    });
  });
});
