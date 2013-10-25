Api = require './api'
Client = require './client'
window = require './window'
screen = require './screen'
util   = require './util'
wrapper = require './wrapper'

class Zephyros

  constructor: (options = path: '/tmp/zephyros.sock') ->
    @client = new Client(options)
    wrapper._init @client

  bind: (key, modifier) =>
    @client.listen(0, 0, 'bind', key , modifier)

  window: window
  screen: screen
  util:   util

module.exports = Zephyros