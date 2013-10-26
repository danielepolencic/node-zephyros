_    = require 'lodash'
net  = require 'net'
uuid = require 'node-uuid'
When = require 'when'

class MasterClient

  constructor: (options) ->
    @queue = {}
    @client = net.connect options
    @client.on 'data', @onData

  onData: (data) =>
    packets = data.toString().split /\s*\n(\[.*\])\s*/gm
    packets.map(@parsePacket).forEach (packet) =>
      if packet?.id of @queue
        callback = @queue[packet.id]
        callback?.call(this, packet.response)

  parsePacket: (packet) =>
    if _.isEmpty(packet) then return

    try
      message = JSON.parse packet
      unless _.isArray message then return

      id       = message.shift()
      response = message.shift()

      # Ignore negative numbers
      if ~~response < 0 then return

      return { id: id,  response: response }

    catch e
      return

  once: (args...) =>
    args.unshift 1
    @listen args...

  listen: (times, args...) =>
    id = uuid.v4()

    deferred = When.defer()
    @queue[id] = do (times) =>
      return (response) =>
        if times is 1
          delete @queue[id]
          deferred.resolve response
        else
          deferred.notify response
        times -= 1

    args.unshift id
    message = JSON.stringify args
    @client.write message + '\n'

    return deferred.promise

module.exports = MasterClient