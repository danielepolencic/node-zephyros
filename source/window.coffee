wrap   = require './wrapper'
Screen = require('./screen')._model
App    = require('./app')._model
preload = require './preload'

class Window

  _index:
    title: 'getTitle'
    screen: 'getScreen'
    app: 'getApp'
    frame: 'getFrame'
    size: 'getSize'
    position: 'getPosition'
    normal: 'isNormal'
    minimized: 'isMinimized'

  constructor: (@id) ->
    @client = wrap @id
    @windowsTo = []

  getTitle: =>
    @client('title').then (@title) => @title


  getScreen: =>
    @client('screen').then (id) =>
      @screen = new Screen(id)

  getApp: =>
    @client('app').then (app) =>
      @app = new App(app)


  getFrame: =>
    @client('frame').then (@frame) => @frame

  setFrame: (x, y, w, h) =>
    @client 'set_frame', if x.x? then x else { x:x, y:y, w:w, h:h }


  getSize: =>
    @client('size').then (@size) => @size

  setSize: (w, h) =>
    @client 'set_size', if w.w? then w else { w:w, h:h }

  resize: (w, h) =>
    @getSize().then =>
      @setSize
        w: @size.w + w
        h: @size.h + h


  getPosition: =>
    @client('top_left').then (@position) => @position

  setPosition: (x, y) =>
    @client 'set_top_left', if x.x? then x else { x:x, y:y }

  nudge: (x, y) =>
    @getPosition().then =>
      @setPosition
        x: @position.x + x
        y: @position.y + y


  maximize: =>
    @client 'maximize'

  minimize: =>
    @client 'minimize'

  unminimize: =>
    @client 'un_minimize'


  focus: =>
    @client 'focus_window'

  focusTo: (direction) =>
    # return unless direction in ['up', 'down', 'left', 'right']
    @client 'focus_window_' + direction


  getWindowsTo: (direction) =>
    # return unless direction in ['north', 'south', 'east', 'west']
    @client('windows_to_' + direction).then (windows) =>
      @windowsTo[direction] = windows.map (id) -> new Window(id)

  getOtherWindows: (options = {}) =>
    if options.all
      @client 'other_windows_on_all_screens'
    else
      @client 'other_windows_on_same_screen'


  isNormal: =>
    @client('normal_window?').then (@normal) => @normal

  isMinimized: =>
    @client('minimized?').then (@minimized) => @minimized

  preload: preload.extend

client = wrap(0)

Api =

  _model: Window

  active: (attrs...) ->
    client('focused_window').then (id) ->
      preload attrs, new Window(id)

  visible: (attrs...) ->
    client('visible_windows').then (windows) ->
      preload attrs, windows.map (id) -> new Window(id)

  all: (attrs...) ->
    client('all_windows').then (windows) ->
      preload attrs, windows.map (id) -> new Window(id)

module.exports = Api
