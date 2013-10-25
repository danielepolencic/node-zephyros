Screen = require './screen'
wrap = require './wrapper'
Frame = require './frame'

class Window

  constructor: (@id) ->
    @client = wrap @id

  title: =>
    @client 'title'

  screen: =>
    @client('screen').then (id) ->
      new Screen(id)

  app: =>
    @client('app').then (app) ->
      new App(app)

  frame: =>
    @client('frame').then (frame) ->
      new Frame(frame)

  setFrame: (frame) =>
    @client('set_frame', frame)

  size: =>
    @client('size').then (size) ->
      new Size(size)

  resize: (width, height) =>
    @client 'set_size',
      w: width
      h: height

  maximize: =>
    @client 'maximize'

  minimize: =>
    @client 'minimize'

  unminimize: =>
    @client 'un_minimize'

  focus: =>
    @client 'focus_window'

  focusUp: =>
    @client 'focus_window_up'

  focusDown: =>
    @client 'focus_window_down'

  focusLeft: =>
    @client 'focus_window_left'

  focusRight: =>
    @client 'focus_window_right'

  normal: =>
    @client 'normal_window?'

  minimized: =>
    @client 'minimized?'


client = wrap(0)

Api =

  _model: Window

  active: ->
    client('focused_window').then (id) ->
      new Window(id)

  visible: ->
    client('visible_windows').then (windows) ->
      windows.map (id) -> new Window(id)

  all: ->
    client('all_windows').then (windows) ->
      windows.map (id) -> new Window(id)

module.exports = Api
