net = require 'net'

class Server

  constructor: (port) ->
    @stack = []
    @server = net.createServer (connection) =>
      @socket = connection
    @server.listen(port)
    @server.on 'connection', (socket) =>
      @socket = socket

  replyWith: (messages) =>
    messages = if Array.isArray messages then messages else [messages]

    @stack.push (socket) ->
      return (data) ->
        message = JSON.parse data.toString('utf-8').split('\n')[0]
        id = message.shift()
        messages.forEach (message, index) ->
          setTimeout =>
            output = JSON.stringify [id].concat message
            socket.write output
          , index * 100

    nextItemFromStack = (data) =>
      if @stack.length
        reply = @stack.shift()
        reply(@socket)(data)
      @socket.once 'data', nextItemFromStack

    waitForConnection = =>
      if @socket
        @socket.once 'data', nextItemFromStack
      else
        setTimeout waitForConnection, 50

    waitForConnection()

  destroy: (callback) =>
    @server.close callback

module.exports = Server