wrap = require './wrapper'

class App

  constructor: (@id) ->
    @client = wrap @id

  allWindows: =>
    Window = require('./window')._model
    @client('all_windows').then (windows) ->
      windows.map (id) -> new Window(id)

  visibleWindows: =>
    Window = require('./window')._model
    @client('visible_windows').then (windows) ->
      windows.map (id) -> new Window(id)

  title: =>
    @client 'title'

  hidden: =>
    @client 'hidden?'

  show: =>
    @client 'show'

  hide: =>
    @client 'hide'

  kill: =>
    @client 'kil'

  kill9: =>
    @client 'kill9'


client = wrap 0

Api =

  _model: App

  all: =>
    client('running_apps').then (apps) ->
      apps.map (id) -> new App(id)

module.exports = Api