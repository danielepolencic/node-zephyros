client = null

Api =

  log: (message) ->
    client.once(0, 'log', message)

  alert: (message, duration) ->
    client.once(0, 'alert', message, duration)

  showBox: (message) ->
    client.once(0, 'show_box', message)

  hideBox: ->
    client.once(0, 'hide_box')

module.exports =
  api: Api
  init: (_client) -> client = _client