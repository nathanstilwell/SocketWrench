/*global describe: false, it: false, expect: false, beforeEach: false, SocketWrench: false */

describe('Socket Wrench', function () {
  beforeEach(function () {
    this.wrench = new SocketWrench({
      socketUrl : 'ws://localhost:4014',
      autoConnect : false
    });
  });// beforeEach

  it('should be defined', function () {
    expect(typeof this.wrench).toBe('object');
    expect(typeof sinon).toBe('object');
  });
}); // describe Socket Wrench
