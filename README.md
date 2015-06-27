# SocketWrench

*A tool to use Web Sockets*

**SocketWrench** is a light wrapper around native WebSockets that provides a slightly sexier api and a little more convinience.

## How to use this

### Create a new SocketWrench

    var wrench = new SocketWrench("ws://freefallws.gilt.com/connect");

or

    var wrench = new SocketWrench({
      url : "ws://freefallws.gilt.com/connect"
    });

or

    var wrench = new SocketWrench({
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

### Open SocketWrench Connection Manually

    wrench.open();

The WebSocket will be connected on creation. If you don't want the WebSocket to open automatically, set autoConnect to false.

    wrench = new SocketWrench({
      url : "ws://localhost:4014",
      autoConnect : false
    });

    // when you're ready

    wrench.open();

### On Connection

    wrench.on('open', function () {
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

    wrench.on('messageType', function (messageData) {
      // do stuff with message
    });

    wrench.on('PriceChange', priceController.setPriceChange);
    wrench.on('Time', clocks.setTime);
    wrench.on('inventoryStatus', inventoryStatus.update)

If your app doesn't follow this convention and leaves off
a 'type' property on MessageEvent.data, SocketWrench will emit
a generic 'message' messageType and pass Message.data to the callback

    wrench.on('message', function myMessageHandler (data) {
      // stuff with message data
    });

If you need to receive the entire MessageEvent and not just the data, set `sendFullMessages` to true in the configuration

    wrench = new SocketWrench({
      url : "ws://localhost:4014",
      sendFullMessages: true
    });

## Closing WebSocket Connection

If your WebSocket connection is closed, SocketWrench will attempt to reconnect the number of times specified by `retryAttempts` in the configuration. If you want to explicitly close the WebSocket connection you can do so by calling `wrench.close()`.

### On Close

A 'close' message is published so you can respond once the WebSocket
connection is closed.

    wrench.on(`close`, function () {
      // do something on close
    });

### Respond to failure

If the WebSocket connection is closed without you requesting it, a `fail`
event will be published along with the number of times the SocketWrench has
attempted to reconnect.

    wrench.on('fail', function (retryCount) {
      // respond to failure
    });

When the connection is lost SocketWrench will attempt to reconnect the number of times specified by the `retryAttempts` options. The default is 8. The retryAttempts will "decay" (using fibonacci numbers) or will wait longer each time it tries to reconnect until it runs out of retryAttempts.

If SocketWrench has attempted reconnect the maximum number of times, an
`error` event is emitted.

    wrench.on('error', function (err) {
      // All attempts to reconnect failed
    });

## Heartbeats

To give your server the opportunity to close abandoned connections, SocketWrench will send a heartbeat at the configured interval. By default SocketWrench will send a "pong" to the server every 30 seconds as well as repond to a "ping" message with a "pong".

You may override what this message looks like (as JSON if you like) and the interval by passing in config options.

    var wrench = new SocketWrench({
      url: 'ws://my-socket-server.com',
      heartbeatInterval: 60000, // in milliseconds
      heartbeatMessage : {
        status : 'still alive',
        currentMood : 'happy',
        outlookOnLife : 'good'
      }
    });

## Contributing

If you would like to help work on SocketWrench, please see the [Contributing](CONTRIBUTING.md) documentation.