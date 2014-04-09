/*jshint eqnull: true, browser: true */
/*global
  describe: false,
  it: false,
  expect: false,
  beforeEach: false,
  afterEach: false,
  SocketWrench: false,
  window: false
*/

describe('Socket Wrench - Supported Property', function () {
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

  // .supported
  it('should detect the absence of support on a new SocketWrench', function () {
    window.WebSocket = undefined;
    var wrench = new SocketWrench( this.defaults );
    expect(wrench.supported).toBe(false);
  });

  describe('detects presence of support', function () {
    it('on the SocketWrench constructor', function () {
      expect(SocketWrench.supported).toBe(true);
    });

    it('on a new SocketWrench', function () {
        var wrench = new SocketWrench( this.defaults );
        expect(wrench.supported).toBe(true);
    });
  });
}); // describe Socket Wrench Supported Spec
