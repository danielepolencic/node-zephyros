Zephyros = require '../'

z = new Zephyros

# mixins

focus = (direction) ->
  z.window.active().then (win) ->
    win.focusTo direction

nudge = (x, y) ->
  z.window.active().then (win) ->
    win.nudge x, y

resize = (w, h) ->
  z.window.active().then (win) ->
    win.resize w, h

snap = (direction) ->
  z.window.active('frame', 'screen').then (win) ->
    win.screen.getFrame().then (screen) ->

      frame =
        x: screen.x
        y: screen.y
        w: screen.w
        h: screen.h

      switch direction

        when 'up'
          frame.x = win.frame.x
          frame.y = frame.y
          frame.w = win.frame.w
          frame.h = frame.h / 2

        when 'down'
          frame.x = win.frame.x
          frame.y = frame.y + frame.h / 2
          frame.w = win.frame.w
          frame.h = frame.h / 2

        when 'right'
          frame.x += frame.w / 2
          frame.w /= 2

        when 'left'
          frame.w /= 2

      win.setFrame frame

# bindings

x = 100

z.bind('l', ['Cmd']).then -> focus 'right'
z.bind('h', ['Cmd']).then -> focus 'left'
z.bind('j', ['Cmd']).then -> focus 'down'
z.bind('k', ['Cmd']).then -> focus 'up'

z.bind('h', ['Cmd', 'Shift']).then -> nudge -x, 0
z.bind('l', ['Cmd', 'Shift']).then -> nudge x, 0
z.bind('j', ['Cmd', 'Shift']).then -> nudge 0, x
z.bind('k', ['Cmd', 'Shift']).then -> nudge 0, -x

z.bind('[', ['Cmd', 'Ctrl']).then -> resize -x, 0
z.bind(']', ['Cmd', 'Ctrl']).then -> resize x, 0
z.bind('-', ['Cmd', 'Ctrl']).then -> resize 0, -x
z.bind('=', ['Cmd', 'Ctrl']).then -> resize 0, x

z.bind('h', ['Cmd', 'Ctrl']).then -> snap 'left'
z.bind('l', ['Cmd', 'Ctrl']).then -> snap 'right'
z.bind('j', ['Cmd', 'Ctrl']).then -> snap 'down'
z.bind('k', ['Cmd', 'Ctrl']).then -> snap 'up'