/*jshint eqnull: true, browser: true */
/*global define: false*/

/*
  Module Definition pattern from UMD
  https://github.com/umdjs/umd
*/
(function (root, factory) {
  'use strict';
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
      root.SocketWrench = factory();
    }
}(this, function () {
  'use strict';
  // SocketWrench.prototype, set below constructor
  var proto;

  function SocketWrench (options) {
    var
      defaults = {
        heartbeatInterval : 30000,
        heartbeatMessage :  'pong',
        retryAttempts : 5,
        retryTimeout : 2000,
        sendFullMessages : false,
        autoConnect : true
      },
      events = {},
      opts = {},
      socket,
      messageBuffer = [],
      readyStateGiveUp = false,
      isReady,
      heartbeat,
      forceClose,
      attemptedReconnects = 0,
      self = this;

    function isPing (message) {
      return (typeof message === 'string' && message === 'ping') ? true : false;
    }

    function isJson(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    }

    function processMessage (message) {
      // determine if JSON
      return (isJson(message)) ? JSON.parse(message) : message;
    }

    function sendPong () {
      if (isJson(opts.heartbeatMessage)) {
        socket.send(JSON.stringify(opts.heartbeatMessage));
      } else {
        socket.send(opts.heartbeatMessage);
      }
    }

    function sendHeartbeat () {
      sendPong();
      heartbeat = setTimeout(sendHeartbeat, opts.heartbeatInterval);
    }

   function onSocketOpen () {
      self.emit(events, 'open');
      attemptedReconnects = 0;
      sendHeartbeat();
    }

    function onSocketClose () {
      clearTimeout(heartbeat);

      if (!forceClose) {
        attemptedReconnects += 1;
        self.emit(events, 'fail', attemptedReconnects);
        if (attemptedReconnects < opts.retryAttempts) {
          setTimeout(self.open, self.decay(opts.retryTimeout, attemptedReconnects));
        } else {
          self.emit(events, 'error', 'All reconnection attempts have failed');
          readyStateGiveUp = true;
        }
      } else {
        self.emit('close');
      }

      self.emit(events, 'close');
    } // onSocketClose

    function onSocketMessage (e) {
      var
        message,
        eventsToEmit,
        data,
        i,
        l;

      message = processMessage(e.data);

      if (isPing(message)) {
        sendPong();
        message = {
          type: 'ping',
          data: 'ping'
        };
      }

      // determine which events to emit
      if (typeof message.type !== 'undefined') {
        eventsToEmit = [message.type, 'message'];
      } else {
        eventsToEmit = ['message'];
      }

      // determine which data to send
      if (opts.sendFullMessages) {
        data = e;
        data.parsedData = message;
      } else {
        data = message;
      }

      for (i = 0, l = eventsToEmit.length; i < l; i += 1) {
        self.emit(events, eventsToEmit[i], data);
      }
    } // onSocketMessage

    function onSocketError (e) {
      self.emit(events, 'error', e);
    }

    //
    // public api
    //

    this.supported = (typeof window.WebSocket !== 'undefined');

    // if we don't have Web Socket support then just stop
    if (!this.supported) {
      return;
    }

    isReady = function isReady () {
      return socket !== undefined && socket.readyState === 1;
    };

    this.isReady = isReady;

    this.open = function open () {
      var
        connectUrl,
        property,
        connectionData,
        parameters = [],
        self = this;

      connectUrl = opts.socketUrl;

      if (opts.connectionData) {
        connectionData = opts.connectionData;
        connectUrl += '?';

        for (property in connectionData) {
          if (connectionData.hasOwnProperty(property)) {
            parameters.push(property + '=' + connectionData[property]);
          }
        }

        connectUrl += parameters.join('&');
      }

      // create new WebSocket
      socket = new WebSocket(connectUrl);

      // hook up callbacks
      socket.onopen = onSocketOpen;
      socket.onmessage = onSocketMessage;
      socket.onerror = onSocketError;
      socket.onclose = onSocketClose;

      // ready loop
      (function checkReady () {
        if (isReady()) {

//      TODO
//
//      Losing Self because of the setTimeout,
//      need more encapsulation
//

          self.emit(events, 'ready');
          for (var j = 0, length = messageBuffer.length; j < length; j++) {
            socket.send(JSON.stringify(messageBuffer[j]));
          }
          messageBuffer = [];
          readyStateGiveUp = false;

        } else {
          if (!readyStateGiveUp ) {
            setTimeout(checkReady, 300);
          }
        }
      }());
    };

    this.close = function close () {
      forceClose = true;
      socket.close();
    };

    this.on = function on (event, callback) {
      (events[event] = events[event] || []).push(callback);
      return [event, callback];
    };

    this.off = function off (handle) {
      var
         event = handle[0],
         callback = handle[1];

      if (event in events) {
        events[event].splice(events[event].indexOf(callback), 1);
      }
    };

    this.send = function send (msg) {
      if (this.isReady()) {
        socket.send(JSON.stringify(msg));
      } else {
        messageBuffer.push(msg);
      }
    };

    //
    //  init
    //

    if (typeof options === 'string') {
      opts = this.extend({}, defaults, { socketUrl : options});
    }

    if (typeof options === 'object') {
      opts = this.extend({}, defaults, options);
    }

    if (opts.autoConnect) {
      this.open();
    }

///////////////////////////////////////////////
  } // Socket Wrench Constructor
///////////////////////////////////////////////

  proto = SocketWrench.prototype;

  proto.emit = function emit (events, event, args, scope) {
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
  }; // proto.emit

  proto.extend = function extend (obj) {
    var
      i,
      l,
      prop,
      source,
      extentionObjects;

    extentionObjects = Array.prototype.slice.call(arguments, 1);

    for (i = 0, l = extentionObjects.length; i < l; i += 1) {
      source = extentionObjects[i];
      if (source) {
        for (prop in source) {
          obj[prop] = source[prop];
        }
      }
    }

    return obj;
  };

  proto.decay = function decay (timeout, attempts) {
    return timeout * attempts;
  };

  return SocketWrench;

})); // umd
