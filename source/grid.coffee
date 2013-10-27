window = require './window'
screen = require './screen'


Api =

  snapAll: ->
    screen.main().then (screen) ->
      screen.frame(noDock: yes).then (frame) ->

        w = frame.w / 2
        h = frame.h / 2
        x = frame.x
        y = frame.y

        window.visible().then (windows) ->
          for window, i in windows
            window.setFrame x, y, w, h
            x += w
            if i isnt 0 and i % 3 is 0
              x = 0
              y += h


module.exports = Api