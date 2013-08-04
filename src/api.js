var when = require('when'),
    fn = require('when/function'),
    pipeline = require('when/pipeline');

exports = module.exports = Api;

function Api(){
  this.stack = [];
}

Api.prototype.thenClipboardContents = function(){
  var func = function(){
    var deferred = when.defer();
    this.server.once(0, 'clipboard_contents').then(function(clipboard){
      deferred.resolve(clipboard);
    });
    return deferred.promise;
  }.bind(this);
  this.then( func );
  return this;
};

Api.prototype.then = function( func ){
  if( func ){
    this.stack.push( when.isPromise(func) ? func : fn.lift(func) );
  }
  return this;
};

Api.prototype.force = function( func ){
  pipeline(this.stack.slice(0)).then( func );
}
