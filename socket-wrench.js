define([], function () {

  function SocketWrench (addr) {
    var self = this;







    function emit (event, args, scope) {
      scope = scope || window;
      args  = args  || [];

      if ('[object Array]' !== Object.prototype.toString.call(args)) {
        args = [args];
      }

      var i, l;

      if (events[event]) {
        for (i = 0, l = events[event].length; i < l; i += 1) {
          events[event][i].apply(scope, args);
        }
      }
    }

    function listen (event, callback) {
      // if we don't have an array of callbacks for events[event], create one
      (events[event] = events[event] || []).push(callback);
      return [event, callback];
    }

    function unlisten (handle) {
      var
        event = handle[0],
        callback = handle[1];

      if (event in events) {
        events[event].splice(events[event].indexOf(callback), 1);
      }
    }






    function onSocketOpen () {
      emit('open');
    }

    function onSocketMessage (e) {
      var
        message = JSON.parse(e.data),
        events,
        data,
        i,
        l;

      // determine which events to emit
      if (message.type) {
        events = [message.type, 'message'];
      } else {
        events = ['message'];
      }

      // determine which data to send
      if (self.opts.sendFullMessages) {
        data = e;
        data.parsedData = JSON.parse(e.data);
      } else {
        data = message;
      }

      for (i = 0, l = events.length; i < l; i += 1) {
        emit(events[i], data);
      }
    } // onSocketMessage


    function start () {
      var connectUrl = addr;

      self.socket = new WebSocket(connectUrl);

      // hook up callbacks
      self.socket.onopen = onSocketOpen;
      self.socket.onmessage = onSocketMessage;


      (function whenReady(){
        if (self.isReady()) {
          emit('ready');
        } else {
          // what if we're never ready?
          setTimeout(whenReady, 10);
        }
      }());
    } // start


    if (typeof options === undefined) {
      return;
    }

    this.events = {};

    this.attemptedReconnects = 0;
    this.forceClose = false;
    this.opts = {};


    start();


  } // Socket Wrench


  SocketWrench.prototype.isReady = function isReady () {
    return this.socket !== undefined && this.socket.readyState === 1;
  };

  SocketWrench.prototype.on = function on (key, callback) {
    // how?
    listen(key, callback);
  };


  SocketWrench.prototype.off = function off (handle) {
    // how?
    unlisten(handle);
  };


  SocketWrench.prototype.open = function open () {
    // how?
    start();
  };






  return SocketWrench;
});
























