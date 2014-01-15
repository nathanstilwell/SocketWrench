/*global
  describe: false,
  it: false,
  expect: false,
  beforeEach: false,
  afterEach: false,
  SocketWrench: false,
  window: false
*/

describe('Socket Wrench', function () {
	beforeEach(function () {
		this.defaults = {
      socketUrl : 'ws://localhost:4014',
      autoConnect : false
    };
	});

  it('should be defined', function () {
    var wrench = new SocketWrench( this.defaults );

    expect(typeof wrench).toBe('object');
    expect(typeof sinon).toBe('object');
  });

  // .supported
  describe('.supported', function () {

    it('detects absence of support', function () {
      window.WebSocket = undefined;
      var wrench = new SocketWrench( this.defaults );
      expect( wrench.supported ).toBe( false );
    });

    it('detects presence of support', function () {
        window.WebSocket = true;
        var wrench = new SocketWrench( this.defaults );
        expect( wrench.supported ).toBe( true );
    });

    beforeEach(function () {
      this.wsValue = window.WebSocket;
    });

    afterEach(function () {
      window.WebSocket = this.wsValue;
    });
  });


  // .isReady
  describe('.isReady', function () {

    it('returns false when the socket does not exist', function () {
      var wrench = new SocketWrench({ autoConnect: false });
      expect( wrench.isReady() ).toBe( false );
    });

    it('returns false when the socket is not ready', function () {
      var wrench = new SocketWrench({ autoConnect: false });
      expect( wrench.isReady() ).toBe( false );
    });

  });

}); // describe Socket Wrench
