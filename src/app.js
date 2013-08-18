var when = require('when'),
    _ = require('lodash'),
    app = {};

exports = module.exports = app;

app.appFromWindow = function(){
  this.stack.push(function(window){
    if ( _.isUndefined(window) || !_.isNumber(window.id) ) { return this; }

    return this.client.once(window.id, 'app').then(function(app_id){
      return { id: app_id };
    });
  }.bind(this));

  return this;
};

app.runningApps = function(){

  this.stack.push(function(window){
    return this.client.once(0, 'running_apps').then(function(apps_ids){
      return apps_ids.map(function(id){ return {id: id}; });
    });
  }.bind(this));

  return this;
};
