/*jshint eqnull: true, browser: true */
/*global
  describe: false,
  it: false,
  expect: false,
  waits: false,
  beforeEach: false,
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

  describe('emit prototype function', function () {
    it('should have a function named emit on it\'s prototype', function () {
      var wrench = new SocketWrench(this.defaults);
      expect(typeof wrench.emit).toBe('function');
    });

    it('should call all registered callbacks when event was emitted', function () {
      var
        wrench = new SocketWrench(this.defauls),
        events = {},
        testEmitted = false;

      this.on = function on (event, callback) {
        (events[event] = events[event] || []).push(callback);
        return [event, callback];
      };
      this.whenTestIsEmitted = function  () {
        testEmitted = true;
      };

      // register callbacks
      this.on('test', this.whenTestIsEmitted);

      expect(events.test.length).toBe(1);
      expect(typeof events.test[0]).toBe('function');
      wrench.emit(events, 'test');
      waits(1000);
      expect(testEmitted).toBe(true);
    });
  });

  describe('extend prototype function', function () {
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
  }); // extends

  describe('fibonacci prototype function', function () {
    var wrench = new SocketWrench(this.defaults);
    it('should have a function named fibonacci on it\'s prototype', function () {
      expect(typeof wrench.fibonacci).toBe('function');
    });

    it('should return fibonacci numbers', function () {
      var num;

      num = wrench.fibonacci();
      expect(num).toBe(1);
      num = wrench.fibonacci();
      expect(num).toBe(2);
      num = wrench.fibonacci();
      expect(num).toBe(3);
      num = wrench.fibonacci();
      expect(num).toBe(5);
      num = wrench.fibonacci();
      expect(num).toBe(8);
      num = wrench.fibonacci();
      expect(num).toBe(13);
    });

    it('should reset the fibonacci when an argument is passed', function () {
      wrench.fibonacci('reset');
      expect(wrench.fibonacci()).toBe(1);
    });
  });
}); // describe Socket Wrench Prototype Functions
