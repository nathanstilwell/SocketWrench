/*global describe: false, it: false, expect: false, waits: false, beforeEach: false, runs: false */
/*global loadFixtures: false, $: false, spyOn: false, define: false */

define(['lib/socket-wrench'], function (SocketWrench) {
  describe('Socket Wrench', function () {
    beforeEach(function () {
      this.wrench = new SocketWrench({
        socketUrl : 'ws://localhost:4014',
        autoConnect : false
      });
    });// beforeEach

    it('should be defined', function () {
      expect(typeof this.wrench).toBe('object');
    });
  }); // describe Socket Wrench
}); // define
