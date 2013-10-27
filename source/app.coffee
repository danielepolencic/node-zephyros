wrap = require './wrapper'
preload = require './preload'

class App

  _index:
    title: 'getTitle'
    hidden: 'isHidden'
    all: 'allWindows'
    visible: 'visibleWindows'

  constructor: (@id) ->
    @client = wrap @id

  allWindows: =>
    Window = require('./window')._model
    @client('all_windows').then (windows) ->
      @all = windows.map (id) -> new Window(id)

  visibleWindows: =>
    Window = require('./window')._model
    @client('visible_windows').then (windows) ->
      @visible = windows.map (id) -> new Window(id)

  getTitle: =>
    @client('title').then (@title) => @title

  isHidden: =>
    @client('hidden?').then (@hidden) => @hidden

  show: =>
    @client 'show'

  hide: =>
    @client 'hide'

  kill: =>
    @client 'kil'

  kill9: =>
    @client 'kill9'

  preload: preload.extend


client = wrap 0

Api =

  _model: App

  all: (attrs) ->
    client('running_apps').then (apps) ->
      preload attrs, apps.map (id) -> new App(id)

module.exports = Api