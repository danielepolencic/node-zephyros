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

Api.prototype.thenFocusedWindowFrame = function( window_id ){
  var getFocusedWindowFrame = function( window_id ){
    var deferred = when.defer();
    this.client.once(window_id, 'frame').then(function(window_object){
      deferred.resolve(window_object);
    });
    return deferred.promise;
  };
  if ( !isNaN(window_id) ){
    getFocusedWindowFrame.bind(this, window_id);
  }
  this.then( this.thenFocusedWindow );
  this.then( this.getFocusedWindowFrame.bind(this) );
  if ( typeof window_id === 'function' ){
    this.then( window_id );
  }
  return this;
};
