var when = require('when'),
    fn = require('when/function'),
    pipeline = require('when/pipeline'),
    _ = require('lodash')

    window = require('./window'),
    app = require('./app'),
    util = require('./util'),
    screen = require('./screen');

exports = module.exports = Api;

function Api(client){
  this.stack = [];
  this.client = client;
}

_.extend( Api.prototype, window, app, screen, util );

Api.prototype.then = function( func ){
  if( func ){
    this.stack.push( when.isPromise(func) ? func : fn.lift(func) );
  }
  return this;
};

Api.prototype.force = function( seed ){
  return pipeline(this.stack.slice(0), seed);
};
