
client = null

class Screen

  constructor: (@id) ->

  frame: (options) =>
    client.once(@id, 'frame_without_dock_or_menu').then (@frame) =>
      @frame

Api =

  main: ->
    client.once(0, 'main_screen').then (id) ->
      new Screen(id)

  all: ->
    client.once(0, 'all_screens').then (screens) ->
      screens.map (id) -> new Screen(id)

module.exports =
  class: Screen
  api: Api
  init: (_client) -> client = _client