When = require 'when'
fn = require 'when/function'
pipeline = require 'when/pipeline'

class Stack

  constructor: ->
    @stack = []

  run: (seed) =>
    pipeline @stack.slice(0), seed

  then: (func) =>
    @stack.push if When.isPromise func then func else fn.lift func
    return this

module.exports = Stack