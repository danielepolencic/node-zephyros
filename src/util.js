var when = require('when'),
    util = {};

exports = module.exports = util;

util.thenRelaunchConfig = function( func ){
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

util.thenGetClipboardContents = function( func ){
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

util.thenAlert = function( func_or_obj ){
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

util.thenLog = function( func_or_else ){
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

util.thenChooseFrom = function( func_or_obj ){
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

util.thenUpdateSettings = function( func ){
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
