var when = require('when'),
    app = {};

exports = module.exports = app;

app.thenGetAppFromWindow = function( func ){
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

app.thenGetRunningApps = function( func ){
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

