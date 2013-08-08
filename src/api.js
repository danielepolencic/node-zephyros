var when = require('when'),
    fn = require('when/function'),
    pipeline = require('when/pipeline');

exports = module.exports = Api;

function Api(client){
  this.stack = [];
  this.client = client;
}

Api.prototype.thenClipboardContents = function( func ){
  var getClipboardContents = function(){
    var deferred = when.defer();
    this.client.once(0, 'clipboard_contents').then(function(clipboard){
      deferred.resolve(clipboard);
    });
    return deferred.promise;
  }.bind(this);
  this.then( getClipboardContents );
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
  pipeline(this.stack.slice(0)).then( func || function(){} );
};

Api.prototype.thenFocusedWindow = function( func ){
  var getFocusedWindow = function(){
    var deferred = when.defer();
    this.client.once(0, 'focused_window').then(function(window_id){
      deferred.resolve(window_id);
    });
    return deferred.promise;
  }.bind(this);
  this.then( getFocusedWindow );
  func ? this.then( func ) : null;
  return this;
};

Api.prototype.thenWindowFrame = function( func ){
  var getWindowFrame = function( window_id ){
    var deferred = when.defer();
    if ( isNaN(window_id) ) {
      deferred.reject('Error: window_id is not a number.');
    } else {
      this.client.once(window_id, 'frame').then(function(frame){
        deferred.resolve(frame);
      });
    }
    return deferred.promise;
  }.bind(this);
  this.then( getWindowFrame );
  func ? this.then( func ) : null;
  return this;
};
