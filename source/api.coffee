_        = require 'lodash'
When     = require 'when'
fn       = require 'when/function'
pipeline = require 'when/pipeline'

# app      = require './app'
# util     = require './util'
# screen   = require './util'
window   = require './window'

class Api

  constructor: (@client) ->
    @stack = []

  then: (func) =>
    if func
      @stack.push if When.isPromise(func) then func else fn.lift(func)
    return this

  force: (seed) =>
    pipeline @stack.slice(0), seed

_.extend Api.prototype, window

module.exports = Api