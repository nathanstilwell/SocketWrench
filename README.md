# SocketWrench

*A tool to use Web Sockets*

**SocketWrench** is a light wrapper around native WebSockets that provides a slightly sexier api and a little more convinience.

## How to use this

### Create a new SocketWrench

    var socket = new SocketWrench("ws://freefallws.gilt.com/connect");

or

    var socket = new SocketWrench({
      url : "ws://freefallws.gilt.com/connect"
    });

or

    var socket = new SocketWrench({
      url : "ws://freefallws.gilt.com/connect",
      connectionData: {
        eventId : id,
        historySize : size
      },
      heartbeatInterval: 30000,
      retryAttempts: 5,
    });


Options and Defaults

    connectionData : {},
    heartbeatInterval : 30000,
    heartbeatMessage : { "heartbeat" : "beat" },
    retryAttempts : 5,
    retryTimeout : 2000,
    sendFullMessages : false,
    autoConnect : true

### SocketWrench API

    var wrench = new SocketWrench('ws://some-web-socket.com');

    wrench.open();
      // Open WebSocket explicitly
    wrench.close();
      // Close WebSocket explicitly
    wrench.isReady();
      // Check WebSocket ReadyState
    wrench.on(event, callback);
      // Add a callback to an event. returns handle
    wrench.off(handle);
      // Remove a callback from an event
    wrench.send(message);
      // Send a message to the server
    wrench.supported;
    SocketWrench.supported;
      // Check to see if WebSocket is supported. This is a Boolean

## Get Started

### Test for Websocket Support

Make sure you check if Websockets are supported.

    if (SocketWrench.supported) { // Boolean
      // have fun!
    } else {
      // provide a fallback
    }

### Open Socket Connection Manually

    socket.open();

The websocket will be connected on creation. If you don't want the socket to open automatically, set autoConnect to false.

    socket = new SocketWrench({
      url : "ws://localhost:4014",
      autoConnect : false
    });

    // when you're ready

    socket.open();

### On Connection

    socket.on('open', function () {
      console.log("it's connected");
    });

## Responding to Socket Messages

Messages in WebSocket use the [MessageEvent](http://www.w3.org/TR/2008/WD-html5-20080610/comms.html#messageevent) API. In previous WebSocket projects, I have found it convenient to give the message a "type" by adding a `type` property to the message data.

    // WebSocket Message
    MessageEvent {
      data: {
        type : "aMessageType"
        /* other message data here */
      },
      lastEventId: "",
      origin: "ws://localhost:4014",
      ports: Array[0],
      timeStamp: 1367596284302
      type: "message"
    }

SocketWrench will look for this property, and if found will emit an event of that type and pass MessageEvent.data to the callback

    socket.on('messageType', function (messageData) {
      // do stuff with message
    });

    socket.on('PriceChange', priceController.setPriceChange);
    socket.on('Time', clocks.setTime);
    socket.on('inventoryStatus', inventoryStatus.update)

If your app doesn't follow this convention and leaves off
a 'type' property on MessageEvent.data, SocketWrench will emit
a generic 'message' messageType and pass Message.data to the callback

    socket.on('message', function myMessageHandler (data) {
      // stuff with message data
    });

If you need to receive the entire MessageEvent and not just the data, set `sendFullMessages` to true in the configuration

    socket = new SocketWrench({
      url : "ws://localhost:4014",
      sendFullMessages: true
    });

## Closing WebSocket Connection

If your socket connection is closed, SocketWrench will attempt to reconnect the number of times specified by `retryAttempts` in the configuration. If you would to explicitly close the socket connection you can do so by calling `socket.close()`.

### On Close

A 'close' message is published so you can respond once the socket
connection is closed.

    socket.on(`close`, function () {
      // do something on close
    });

### Respond to failure

If the socket connection is closed without you requesting it, a `fail`
event will be published along with the number of times the socket has
attempted to reconnect.

    socket.on('fail', function (retryCount) {
      // respond to failure
    });

When the connection is lost the socket will attempt to reconnect the
number of times specified by the `retryAttempts` options. The default is 5. The retryAttempts will "decay" or will wait longer each time it tries to reconnect until it runs out of retryAttempts.

If the socket has attempted reconnect the maximum number of times, an
`error` event is emitted.

    socket.on('error', function (err) {
      // All attempts to reconnect failed
    });

## Heartbeats

To give your server the opportunity to close abandoned connections, SocketWrench will send a heartbeat at the configured interval. By default SocketWrench will send a "pong" to the server every 30 seconds as well as repond to a "ping" message with a "pong".

You may override what this message looks like (as JSON if you like) and the interval by passing in config options.

    var socket = new SocketWrench({
      url: 'ws://my-socket-server.com',
      heartbeatInterval: 60000, // in milliseconds
      heartbeatMessage : {
        status : 'still alive',
        currentMood : 'happy',
        outlookOnLife : 'good'
      }
    });