wrap   = require './wrapper'
Screen = require './screen'
App    = require './app'
When   = require 'when'

preloading =
  'title': 'getTitle'
  'frame': 'getFrame'

class Window

  constructor: (@id) ->
    @client = wrap @id
    @windowsTo = []

  getTitle: =>
    @client('title').then (@title) =>
      @title

  getScreen: =>
    @client('screen').then (id) =>
      @screen = new Screen(id)

  getApp: =>
    @client('app').then (app) =>
      @app = new App(app)

  getFrame: =>
    @client('frame').then (@frame) => @frame

  setFrame: (x, y, w, h) =>
    @client 'set_frame',
      x: x
      y: y
      w: w
      h: h

  getSize: =>
    @client('size').then (@size) => @size

  setSize: (width, height) =>
    @client 'set_size',
      w: width
      h: height

  getPosition: =>
    @client('top_left').then (@position) => @position

  setPosition: (x, y) =>
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

  isNormal: =>
    @client('normal_window?').then (@normal) =>
      @normal

  isMinimized: =>
    @client('minimized?').then (@minimized) => @minimized

  getWindowsTo: (direction) =>
    @client('windows_to_' + direction).then (windows) =>
      @windowsTo[direction] = windows.map (id) -> new Window(id)

  otherWindows: (options = {}) =>
    if options.sameScreen
      @client 'other_windows_on_same_screen'
    else
      @client 'other_windows_on_all_screens'

  preload: (params = []) =>
    promises = for param in params
      @[preloading[param]]()
    When.all(promises).then =>
      return this


client = wrap(0)

Api =

  _model: Window

  active: ->
    client('focused_window').then (id) ->
      new Window(id)

  visible: (options) ->
    client('visible_windows').then (windows) ->
      promises = for id in windows
        window = new Window(id)
        window.preload options
      When.all promises

  all: ->
    client('all_windows').then (windows) ->
      windows.map (id) -> new Window(id)

module.exports = Api
