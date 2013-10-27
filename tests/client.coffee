assert = require 'assert'
Server = require './server'
Client = require '../source/client'

describe 'Client', ->

  server = null

  options =
    port: 8124
    host: 'localhost'

  beforeEach ->
    server = new Server options.port

  afterEach ->
    server.destroy()

  it 'should send a json message correctly formatted', (done) ->

    client = new Client options

    server.replyWith 'OK'

    client.once(0, 'random_command').then (response) ->
      assert.equal response, 'OK'
      assert.equal Object.keys(client.queue).length, 0
      done()

  it 'should send a JSON message and wait for other JSON messages to come', (done) ->

    client = new Client options

    i = 0
    server.replyWith ['-1', 'null', 'null']
    client.listen(0, 2, 'another_command').then undefined, undefined, ->
      i += 1
      if i > 1
        assert.equal i, 2
        done()

  it 'should listen for three events and unbind', (done) ->

    client = new Client options

    i = 0

    server.replyWith ['-1', 'null', 'null', 'null', 'null']

    client.listen(3, 0, 'random').then( ->
      assert.equal i, 2
    , undefined, ->
      i += 1
    ).then done, done

