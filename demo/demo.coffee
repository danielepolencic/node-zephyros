Zephyros = require '../'

z = new Zephyros()

z.bind('m', ['Cmd', 'Ctrl']).then ->
  z.window.focused().then (win) -> win.maximize()

z.screen.main().then (screen) ->
  screen.frame(noDock: yes).then (frame) ->
    mainFrame = frame

z.bind('right', ['Cmd', 'Ctrl', 'Alt']).then ->
  z.window.focused().then (win) ->
    win.screen().then (screen) ->
      screen.frame(noDock: yes).then (frame) ->
        win.setFrame (coords) ->
          coords.x = coords.w = frame.w / 2
          coords.h = frame.h
          coords.y = frame.y
          return coords

z.bind('right', ['Cmd', 'Ctrl', 'Alt']).then ->
  z.window.focused().then (win) ->
    win.moveTo
      x: 0.5
      y: 0
      w: 0.5
      h: 1

z.bind('h', ['Cmd', 'Ctrl']).then ->
  z.window.focused().with('frame').then (win) ->
    grid = win.snapToGrid()
    grid.x += 1
    win.moveTo grid

z.bind(']', ['Cmd', 'Ctrl']).then ->
  z.window.focused().then (win) ->
    grid = win.snapToGrid()
    grid.h += 1
    win.moveTo grid

z.bind('c', ['Cmd', 'Alt', 'Ctrl']).then ->
  z.util.clipboard().then (clipboard) ->
    z.util.alert clipboard.toString()

z.window.gridify()
  # loop through all visible windows
  # position each one in a part of the grid
  # use window.windowsTo('north') to select them and move them around
