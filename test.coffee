Zephyros = require './source/zephyros'

z = new Zephyros

z.bind('l', ['Cmd']).then ->
  z.window.active().then (win) ->
    win.focusTo 'right'

z.bind('h', ['Cmd']).then ->
  z.window.active().then (win) ->
    win.focusTo 'left'

z.bind('h', ['Cmd', 'Ctrl']).then ->
  z.grid.snapAll()
