var when = require('when'),
    window = {};

exports = module.exports = window;

window.thenGetFocusedWindow = function( func ){
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

window.thenGetWindowFrame = function( func ){
  var getWindowFrame = function( window ){
    var deferred = when.defer();
    if ( (typeof window === 'undefined') || !window['id'] || isNaN(window.id) ) {
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

window.thenSetWindowFrame = function( func ){
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

window.thenGetVisibleWindows = function( func ){
  var getVisibleWindows = function(){
    var deferred = when.defer();
    this.client.once(0, 'visible_windows').then(function(windows_ids){
      var windows = windows_ids.map(function(id){ return {id: id}; });
      deferred.resolve(windows);
    });
    return deferred.promise;
  }.bind(this);
  this.then( getVisibleWindows );
  func ? this.then( func ) : null;
  return this;
};

window.thenGetAllWindows = function( func ){
  var getAllWindows = function(){
    var deferred = when.defer();
    this.client.once(0, 'all_windows').then(function(windows_ids){
      var windows = windows_ids.map(function(id){ return {id: id}; });
      deferred.resolve(windows);
    });
    return deferred.promise;
  }.bind(this);
  this.then( getAllWindows );
  func ? this.then( func ) : null;
  return this;
};

window.thenGetWindowTitle = function( func ){
  var getWindowTitle = function( window ){
    var deferred = when.defer();
    if ( (typeof window === 'undefined') || !window['id'] || isNaN(window.id) ) {
      deferred.reject('Error: window.id is not a number.');
    } else {
      this.client.once(window.id, 'title').then(function(title){
        deferred.resolve({
          id: window.id,
          title: title
        });
      });
    }
    return deferred.promise;
  }.bind(this);
  this.then( getWindowTitle );
  func ? this.then( func ) : null;
  return this;
};

window.thenGetWindowOrigin = function( func ){
  var getWindowOrigin = function( window ){
    var deferred = when.defer();
    if ( (typeof window === 'undefined') || !window['id'] || isNaN(window.id) ) {
      deferred.reject('Error: window.id is not a number.');
    } else {
      this.client.once(window.id, 'top_left').then(function(origin){
        deferred.resolve({
          id: window.id,
          origin: origin
        });
      });
    }
    return deferred.promise;
  }.bind(this);
  this.then( getWindowOrigin );
  func ? this.then( func ) : null;
  return this;
};

window.thenSetWindowOrigin = function( func ){
  if( typeof func === 'function' ){
    this.then( func );
  } else {
    return this;
  }
  var setWindowTopLeft = function( window ){
    var deferred = when.defer();
    this.client.once(window.id, 'set_top_left', window.origin).then(function(){
      deferred.resolve();
    });
    return deferred.promise;
  }.bind(this);
  this.then( setWindowTopLeft );
  return this;
};

window.thenGetWindowSize = function( func ){
  var getWindowSize = function( window ){
    var deferred = when.defer();
    if ( (typeof window === 'undefined') || !window['id'] || isNaN(window.id) ) {
      deferred.reject('Error: window.id is not a number.');
    } else {
      this.client.once(window.id, 'size').then(function(size){
        deferred.resolve({
          id: window.id,
          size: size
        });
      });
    }
    return deferred.promise;
  }.bind(this);
  this.then( getWindowSize );
  func ? this.then( func ) : null;
  return this;
};

window.thenSetWindowSize = function( func ){
  if( typeof func === 'function' ){
    this.then( func );
  } else {
    return this;
  }
  var setWindowSize = function( window ){
    var deferred = when.defer();
    this.client.once(window.id, 'set_size', window.size).then(function(){
      deferred.resolve();
    });
    return deferred.promise;
  }.bind(this);
  this.then( setWindowSize );
  return this;
};

window.thenWindowMaximize = function( func ){
  var windowMaximize = function( window ){
    var deferred = when.defer();
    this.client.once(window.id, 'maximize').then(function(){
      deferred.resolve();
    });
    return deferred.promise;
  }.bind(this);
  this.then( windowMaximize );
  func ? this.then( func ) : null;
  return this;
};

window.thenWindowMinimize = function( func ){
  var windowMinimize = function( window ){
    var deferred = when.defer();
    this.client.once(window.id, 'minimize').then(function(){
      deferred.resolve();
    });
    return deferred.promise;
  }.bind(this);
  this.then( windowMinimize );
  func ? this.then( func ) : null;
  return this;
};

window.thenWindowUnminimize = function( func ){
  var windowUnminimize = function( window ){
    var deferred = when.defer();
    this.client.once(window.id, 'un_minimize').then(function(){
      deferred.resolve();
    });
    return deferred.promise;
  }.bind(this);
  this.then( windowUnminimize );
  func ? this.then( func ) : null;
  return this;
};

window.thenGetAppFromWindow = function( func ){
  var getAppFromWindow = function( window ){
    var deferred = when.defer();
    if ( (typeof window === 'undefined') || !window['id'] || isNaN(window.id) ) {
      deferred.reject('Error: window.id is not a number.');
    } else {
      this.client.once(window.id, 'app').then(function(app_id){
        deferred.resolve({ id: app_id });
      });
    }
    return deferred.promise;
  }.bind(this);
  this.then( getAppFromWindow );
  func ? this.then( func ) : null;
  return this;
};

window.thenGetScreenFromWindow = function( func ){
  var getScreenFromWindow = function( window ){
    var deferred = when.defer();
    if ( (typeof window === 'undefined') || !window['id'] || isNaN(window.id) ) {
      deferred.reject('Error: window.id is not a number.');
    } else {
      this.client.once(window.id, 'screen').then(function(screen_id){
        deferred.resolve({ id: screen_id });
      });
    }
    return deferred.promise;
  }.bind(this);
  this.then( getScreenFromWindow );
  func ? this.then( func ) : null;
  return this;
};


['left', 'right', 'up', 'down'].forEach(function(direction){
  window['thenFocusWindow' + (direction.charAt(0).toUpperCase() + direction.slice(1))] = function( func ){
    var focusWindow = function( window ){
      var deferred = when.defer();
      this.client.once(window.id, 'focus_window_' + direction).then(function(){
        deferred.resolve();
      });
      return deferred.promise;
    }.bind(this);
    this.then( focusWindow );
    func ? this.then( func ) : null;
    return this;
  };
});
