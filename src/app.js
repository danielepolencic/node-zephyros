var when = require('when'),
    app = {};

exports = module.exports = app;

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

