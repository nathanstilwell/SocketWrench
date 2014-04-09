/*jshint eqnull: true, browser: true */
/*global
  describe: false,
  it: false,
  runs: false,
  waitsFor: false,
  expect: false,
  beforeEach: false,
  afterEach: false,
  SocketWrench: false,
  window: false
*/

describe('Socket Wrench', function () {
  'use strict';
  beforeEach(function () {
    this.defaults = {
      url : 'ws://localhost:4014',
      autoConnect : false
    };
  });

  it('should be defined', function () {
    var wrench = new SocketWrench( this.defaults );
    expect(typeof wrench).toBe('object');
  });

  // .supported
  describe('.supported', function () {
    describe('detects absence of support', function () {
      it('on a new SocketWrench', function () {
        window.WebSocket = undefined;
        var wrench = new SocketWrench( this.defaults );
        expect(wrench.supported).toBe(false);
      });
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

    beforeEach(function () {
      this.wsValue = window.WebSocket;
    });

    afterEach(function () {
      window.WebSocket = this.wsValue;
    });
  });

  // .isReady
  describe('.isReady', function () {
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
    });
  });

  describe('extend', function () {
    it('should have a function named extend on it\'s prototype', function () {
      var wrench = new SocketWrench(this.defaults);
      expect(typeof wrench.extend).toBe('function');
    });

    it('should extend an object', function () {
      var wrench = new SocketWrench(this.defaults);
      var foo = {
        a: 1,
        b: 'two'
      };
      var bar = {
        c: function three () { return 3; }
      };
      var foobar = {
        a: 1,
        b: 'two',
        c: function three () { return 3; }
      };
      var testFoobar = wrench.extend({}, foo, bar);
      expect(testFoobar.a).toBe(foobar.a);
      expect(testFoobar.b).toBe(foobar.b);
      expect(testFoobar.c()).toBe(foobar.c());
    });
  });
}); // describe Socket Wrench
