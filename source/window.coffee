wrap   = require './wrapper'
Screen = require './screen'
App    = require './app'

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
    @client 'frame'

  setFrame: (x, y, w, h) =>
    @client 'set_frame',
      x: x
      y: y
      w: w
      h: h

  size: =>
    @client 'size'

  resize: (width, height) =>
    @client 'set_size'
      w: width
      h: height

  position: =>
    @client 'top_left'

  move: (x, y) =>
    @client 'set_top_left',
      x: x
      y: y

  maximize: =>
    @client 'maximize'

  minimize: =>
    @client 'minimize'

  unminimize: =>
    @client 'un_minimize'

  focus: =>
    @client 'focus_window'

  focusTo: (direction) =>
    @client 'focus_window_' + direction

  normal: =>
    @client 'normal_window?'

  minimized: =>
    @client 'minimized?'

  windowsTo: (directon) =>
    @client 'window_to_' + direction

  otherWindows: (options = {}) =>
    if options.sameScreen
      @client 'other_windows_on_same_screen'
    else
      @client 'other_windows_on_all_screens'


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
