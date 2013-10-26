wrap = require './wrapper'
preload = require './preload'

class Screen

  _index:
    frame: 'getFrame'
    fullFrame: 'getFullFrame'

  constructor: (@id) ->
    @client = wrap @id

  getFrame: =>
    @client('frame_without_dock_or_menu').then (@frame) => @frame

  getFullFrame: =>
    @client('frame_including_dock_and_menu').then (@fullFrame) => @fullFrame

  previous: =>
    @client('previous_screen').then (id) -> new Screen(id)

  next: =>
    @client('next_screen').then (id) -> new Screen(id)

  rotate: (degree) =>
    # return unless degree in [0, 90, 180, 270]
    @client 'rotate_to', degree

  preload: preload.extend


client = wrap 0

Api =

  _model: Screen

  main: (attrs...) ->
    client('main_screen').then (id) ->
      preload attrs, new Screen(id)

  all: (attrs...) ->
    client('all_screens').then (screens) ->
      preload attrs, screens.map (id) -> new Screen(id)

module.exports = Api