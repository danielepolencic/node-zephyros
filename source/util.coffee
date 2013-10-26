wrap = require './wrapper'

client = wrap 0

Api =

  log: (message) ->
    client 'log', message

  alert: (message, duration) ->
    client 'alert', message, duration

  showBox: (message) ->
    client 'show_box', message

  hideBox: ->
    client 'hide_box'

  relaunch: ->
    client 'relaunch_config'

  updateSettings: (settings) ->
    client 'update_settings', settings

  redo: ->
    client 'redo'

  undo: ->
    client 'undo'

  clipboard: ->
    client 'clipboard_contents'

  chooseFrom: (list, title, height, width) ->
    if list.list?
      title  = list.title
      height = list.height
      width  = list.width
      list   = list.list
    client 'choose_from', list, title, height, width

module.exports = Api
