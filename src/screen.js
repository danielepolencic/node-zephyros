var when = require('when'),
    screen = {};

exports = module.exports = screen;

screen.thenGetScreenFromWindow = function( func ){
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

screen.thenGetFrameIncludingDockAndMenu = function( func ){
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

screen.thenGetFrameWithoutDockOrMenu = function( func ){
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

screen.thenGetMainScreen = function( func ){
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

screen.thenGetAllScreens = function( func ){
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

