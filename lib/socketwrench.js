/*jshint eqnull: true, browser: true */
/*global define: false*/

/**
 *
 *     SocketWrench 0.5.1
 *     https://github.com/nathanstilwell/socketwrench
 *
 *     Copyright © Nathan Stilwell <nathanstilwell@gmail.com>
 *
 *     This work is free. You can redistribute it and/or modify it under the
 *     terms of the Do What The Fuck You Want To Public License, Version 2,
 *     as published by Sam Hocevar. See the COPYING file for more details.
 *
 */

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
      aSecond = 1000,
      attemptedReconnects = 0,
      checkReadyTimeout,
      defaults = {
        heartbeatInterval : 30000,
        heartbeatMessage :  'pong',
        retryAttempts : 8,
        sendFullMessages : false,
        autoConnect : true
      },
      events = {},
      forceClose,
      heartbeat,
      isReady,
      messageBuffer = [],
      opts = {},
      readyStateGiveUp = false,
      reservedMessageType = [
        'close',
        'error',
        'fail',
        'open',
        'ready'
      ],
      self = this,
      socket;

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

   function onSocketOpen (e) {
      self.emit(events, 'open', e);
      attemptedReconnects = 0;
      self.fibonacci('reset');
      sendHeartbeat();
    }

    function onSocketClose (e) {
      // shut down heartbeat while not connected
      clearTimeout(heartbeat);

      if (!forceClose) {
        attemptedReconnects += 1;
        self.emit(events, 'fail', attemptedReconnects);
        if (attemptedReconnects < opts.retryAttempts) {
          setTimeout(self.open, self.fibonacci() * aSecond);
        } else {
          self.emit(events, 'error', 'All reconnection attempts have failed');
          readyStateGiveUp = true;
        }
      } else {
        self.emit(events, 'close', e);
        return;
      }

      self.emit(events, 'close', e);
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
      if (typeof message.type !== 'undefined' && -1 === reservedMessageType.indexOf(message.type)) {
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

    this.supported = (typeof WebSocket !== 'undefined');

    // if we don't have Web Socket support then just stop
    if (!this.supported) {
      return;
    }

    isReady = function isReady () {
      return socket !== undefined && socket.readyState === WebSocket.OPEN;
    };

    this.isReady = isReady;

    this.open = function open () {
      var
        connectUrl,
        property,
        connectionData,
        parameters = [];

      connectUrl = opts.url;

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

      // stop previous checkReady loops
      clearTimeout(checkReadyTimeout);

      // ready loop
      (function checkReady () {
        if (isReady()) {
          self.emit(events, 'ready');
          for (var j = 0, length = messageBuffer.length; j < length; j++) {
            socket.send(JSON.stringify(messageBuffer[j]));
          }
          messageBuffer = [];
          readyStateGiveUp = false;
        } else {
          if (!readyStateGiveUp ) {
            checkReadyTimeout = setTimeout(checkReady, 300);
          }
        }
      }());
    };

    this.close = function close (code, reason) {
      if (!this.isReady()) {
        self.emit(events, 'error', 'Tried to close socket before ready');
        return;
      }

      forceClose = true;
      if (typeof code !== 'undefined' && !isNaN(code)) {
        socket.close(code, reason || '');
      } else {
        socket.close();
      }
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
      opts = this.extend({}, defaults, { url : options});
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

  proto.fibonacci = (function () {
    var
      count,
      fibonacciNumber;

    function resetNumber () {
      count = 0;
      fibonacciNumber = 0;
    }

    function getFibonacci (n) {
      var number = n || 0;
      return (number < 2) ? 1 : getFibonacci(number -1) + getFibonacci(number - 2);
    }

    resetNumber();

    return function  (reset) {
      if (typeof reset !== 'undefined') {
        resetNumber();
        return;
      }

      count += 1;
      fibonacciNumber = getFibonacci(count);
      return fibonacciNumber;
    };
  }());

  SocketWrench.supported = (typeof WebSocket !== 'undefined');

  return SocketWrench;

})); // umd
