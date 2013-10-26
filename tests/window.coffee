Zephyros = require '../source/zephyros'
assert   = require 'assert'
Server   = require './server'

describe 'Window', ->

  server = null

  options =
    port: 8124
    host: 'localhost'

  beforeEach ->
    server = new Server options.port

  afterEach ->
    server.destroy()

  it 'should get the focused window', (done) ->

    z = new Zephyros options

    server.replyWith '1'

    z.window.active().then (win) ->
      assert.equal win.id, 1
      done()

  it 'should get all the windows', (done) ->

    z = new Zephyros options

    server.replyWith [[[1, 2, 3, 4]]]

    z.window.all().then (windows) ->
      assert.equal windows.length, 4
      done()

  it 'should get the window title', (done) ->

    z = new Zephyros options

    server.replyWith '1',

    z.window.active().then (win) ->
      assert.equal win.id, 1

      server.replyWith 'Window title'

      win.getTitle().then (title) ->
        assert.equal title, 'Window title'
        done()

  it 'should load multiple parameters', (done) ->

    z = new Zephyros options

    server.replyWith '1'
    z.window.active().then (win) ->
      assert.equal win.id, 1

      server.replyWith 'Title'
      server.replyWith no

      win.do('getTitle', 'isNormal').then (win) ->
        console.log win
        done()
