wrap = require './wrap'

class Screen

  constructor: (@id) ->
    @client = wrap @id

  frame: (options) =>
    name = if options.withoutDock
      'frame_without_dock_or_menu'
    else
      'frame_including_dock_and_menu'
    @client name

  previous: =>
    @client('previous_screen').then (id) ->
      new Screen(id)

  next: =>
    @client('next_screen').then (id) ->
      new Screen(id)

  # Where degree in [0, 90, 180, 270]
  rotate: (degree) =>
    @client 'rotate_to', degree


client = wrap 0

Api =

  _model: Screen

  main: ->
    client.once(0, 'main_screen').then (id) ->
      new Screen(id)

  all: ->
    client.once(0, 'all_screens').then (screens) ->
      screens.map (id) -> new Screen(id)

module.exports = Api