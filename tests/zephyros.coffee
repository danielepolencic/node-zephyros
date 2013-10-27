assert = require 'assert'
Server = require './server'
Zephyros = require '../source/zephyros'

describe 'Zephyros', ->

  server = null

  options =
    port: 8124
    host: 'localhost'

  beforeEach ->
    server = new Server options.port

  afterEach ->
    server.destroy()

  it 'should bind a key shortcut twice', (done) ->
    z = new Zephyros options
    server.replyWith ['-1', 'null']
    z.bind('t', ['Cmd', 'Shift']).then ->
      done()

  it 'should bind to a key shortcut and execute calls outside of bind', (done) ->
    z = new Zephyros options

    server.replyWith ['-1', 'null']
    server.replyWith 'clip'

    z.bind('r', ['Cmd', 'Shift']).then ->

      z.util.clipboard().then (clip) ->
        assert.equal clip, 'clip'
        done()

  it 'should listen for two events', (done) ->
    z = new Zephyros options

    server.replyWith ['-1', '77']
    z.listen('window_created')
      .then (window) ->
        assert.equal window, 77
      .then ->
        done()