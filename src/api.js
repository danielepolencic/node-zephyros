var when = require('when'),
    fn = require('when/function'),
    pipeline = require('when/pipeline');

exports = module.exports = Api;

function Api(client){
  this.stack = [];
  this.client = client;
}

Api.prototype.thenGetClipboardContents = function( func ){
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

Api.prototype.force = function( seed ){
  return pipeline(this.stack.slice(0), seed);
};

Api.prototype.thenGetFocusedWindow = function( func ){
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

Api.prototype.thenRelaunchConfig = function( func ){
  func ? this.then( func ) : null;
  var relaunchConfig = function(){
    var deferred = when.defer();
    this.client.once(0, 'relaunch_config').then(function(){
      deferred.resolve();
    });
    return deferred.promise;
  }.bind(this);
  this.then( relaunchConfig );
  return this;
};

Api.prototype.thenGetVisibleWindows = function( func ){
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

Api.prototype.thenGetAllWindows = function( func ){
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

Api.prototype.thenGetMainScreen = function( func ){
  var getMainScreen = function(){
    var deferred = when.defer();
    this.client.once(0, 'main_screen').then(function(screen_id){
      deferred.resolve({ id: screen_id });
    });
    return deferred.promise;
  }.bind(this);
  this.then( getMainScreen );
  func ? this.then( func ) : null;
  return this;
};

Api.prototype.thenGetAllScreens = function( func ){
  var getAllScreens = function(){
    var deferred = when.defer();
    this.client.once(0, 'all_screens').then(function(screens_ids){
      var screens = screens_ids.map(function(id){ return {id: id}; });
      deferred.resolve(screens);
    });
    return deferred.promise;
  }.bind(this);
  this.then( getAllScreens );
  func ? this.then( func ) : null;
  return this;
};

Api.prototype.thenGetRunningApps = function( func ){
  var getRunningApps = function(){
    var deferred = when.defer();
    this.client.once(0, 'running_apps').then(function(apps_ids){
      var apps = apps_ids.map(function(id){ return {id: id}; });
      deferred.resolve(apps);
    });
    return deferred.promise;
  }.bind(this);
  this.then( getRunningApps );
  func ? this.then( func ) : null;
  return this;
};

Api.prototype.thenAlert = function( func_or_obj ){
  if( typeof func_or_obj === 'function' ){
    this.then( func_or_obj );
  } else if( !!func_or_obj && func_or_obj['message'] && func_or_obj['duration'] ){
    this.then( function(){ return func_or_obj; } );
  } else {
    return this;
  }
  var promptAlert = function( alert ){
    var deferred = when.defer();
    this.client.once(0, 'alert', alert.message, alert.duration).then(function(){
      deferred.resolve();
    });
    return deferred.promise;
  }.bind(this);
  this.then( promptAlert );
  return this;
};

Api.prototype.thenLog = function( func_or_else ){
  if( typeof func_or_else === 'function' ){
    this.then( func_or_else );
  } else {
    this.then( function(){ return func_or_else + ''; } );
  }
  var log = function( message ){
    var deferred = when.defer();
    this.client.once(0, 'log', message).then(function(){
      deferred.resolve();
    });
    return deferred.promise;
  }.bind(this);
  this.then( log );
  return this;
};

Api.prototype.thenChooseFrom = function( func_or_obj ){
  if( typeof func_or_obj === 'function' ){
    this.then( func_or_obj );
  } else if( !!func_or_obj && func_or_obj['list'] ){
    func_or_obj['title'] = func_or_obj['title'] || 'Choose From';
    func_or_obj['lines_tall'] = func_or_obj['lines_tall'] || 5;
    func_or_obj['chars_wide'] = func_or_obj['chars_wide'] || 30;
    this.then( function(){ return func_or_obj; } );
  } else {
    return this;
  }
  var chooseFrom = function( message ){
    var deferred = when.defer();
    this.client.once(0, 'choose_from', func_or_obj['list'], func_or_obj['title'], func_or_obj['lines_tall'], func_or_obj['chars_wide']).then(function(message){
      deferred.resolve(message[1]);
    });
    return deferred.promise;
  }.bind(this);
  this.then( chooseFrom );
  return this;
};

Api.prototype.thenUpdateSettings = function( func ){
  var updateSettings = function( message ){
    var deferred = when.defer();
    this.client.once(0, 'update_settings').then(function(){
      deferred.resolve();
    });
    return deferred.promise;
  }.bind(this);
  this.then( updateSettings );
  func ? this.then( func ) : null;
  return this;
};

Api.prototype.thenGetWindowTitle = function( func ){
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

Api.prototype.thenSetWindowOrigin = function( func ){
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

Api.prototype.thenSetWindowSize = function( func ){
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

Api.prototype.thenGetWindowOrigin = function( func ){
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

Api.prototype.thenGetWindowSize = function( func ){
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

Api.prototype.thenWindowMaximize = function( func ){
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

Api.prototype.thenWindowMinimize = function( func ){
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

Api.prototype.thenWindowUnminimize = function( func ){
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

Api.prototype.thenGetAppFromWindow = function( func ){
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

Api.prototype.thenGetScreenFromWindow = function( func ){
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

Api.prototype.thenGetFrameIncludingDockAndMenu = function( func ){
  var getFrameIncludingDockAndMenu = function( screen ){
    var deferred = when.defer();
    if ( (typeof screen === 'undefined') || !screen['id'] || isNaN(screen.id) ) {
      deferred.reject('Error: screen.id is not a number.');
    } else {
      this.client.once(screen.id, 'frame_including_dock_and_menu').then(function(frame){
        deferred.resolve({
          id: screen.id,
          frame: frame
        });
      });
    }
    return deferred.promise;
  }.bind(this);
  this.then( getFrameIncludingDockAndMenu );
  func ? this.then( func ) : null;
  return this;
};

Api.prototype.thenGetFrameWithoutDockOrMenu = function( func ){
  var getFrameWithoutDockOrMenu = function( screen ){
    var deferred = when.defer();
    if ( (typeof screen === 'undefined') || !screen['id'] || isNaN(screen.id) ) {
      deferred.reject('Error: screen.id is not a number.');
    } else {
      this.client.once(screen.id, 'frame_without_dock_or_menu').then(function(frame){
        deferred.resolve({
          id: screen.id,
          frame: frame
        });
      });
    }
    return deferred.promise;
  }.bind(this);
  this.then( getFrameWithoutDockOrMenu );
  func ? this.then( func ) : null;
  return this;
};
