Client  = require './client'
window  = require './window'
screen  = require './screen'
util    = require './util'
wrapper = require './wrapper'

class Zephyros

  constructor: (options = path: '/tmp/zephyros.sock') ->
    @client = new Client(options)
    wrapper._init @client

  bind: (key, modifier) =>
    @client.listen(0, 0, 'bind', key , modifier)

  app:    app
  util:   util
  window: window
  screen: screen

module.exports = Zephyros