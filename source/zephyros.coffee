Client  = require './client'
window  = require './window'
screen  = require './screen'
util    = require './util'
wrapper = require './wrapper'
app     = require './app'
grid    = require './grid'
Stack   = require './stack'

class Zephyros

  constructor: (options = path: '/tmp/zephyros.sock') ->
    @client = new Client(options)
    wrapper._init @client

  bind: (key, modifier) =>
    stack = new Stack()
    @client
      .listen(0, 0, 'bind', key , modifier)
      .then undefined, undefined, stack.run
    return stack

  listen: (event) =>
    stack = new Stack()
    @client
      .listen(0, 0, 'listen', event)
      .then undefined, undefined, stack.run
    return stack

  app:    app
  util:   util
  window: window
  screen: screen
  grid:   grid

module.exports = Zephyros