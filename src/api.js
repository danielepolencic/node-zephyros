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
      deferred.resolve({
        id: window_id
      });
    });
    return deferred.promise;
  }.bind(this);
  this.then( getFocusedWindow );
  func ? this.then( func ) : null;
  return this;
};

Api.prototype.thenGetWindowFrame = function( func ){
  var getWindowFrame = function( window ){
    var deferred = when.defer();
    if ( !window['id'] && isNaN(window.id) ) {
      deferred.reject('Error: window.id is not a number.');
    } else {
      this.client.once(window.id, 'frame').then(function(frame){
        deferred.resolve({
          id: window.id,
          frame: frame
        });
      });
    }
    return deferred.promise;
  }.bind(this);
  this.then( getWindowFrame );
  func ? this.then( func ) : null;
  return this;
};

Api.prototype.thenSetWindowFrame = function( func ){
  if( typeof func === 'function' ){
    this.then( func );
  } else {
    return this;
  }
  var setWindowFrame = function( window ){
    var deferred = when.defer();
    this.client.once(window.id, 'set_frame', window.frame).then(function(){
      deferred.resolve();
    });
    return deferred.promise;
  }.bind(this);
  this.then( setWindowFrame );
  return this;
};
