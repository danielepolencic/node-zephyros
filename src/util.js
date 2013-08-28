var when = require('when'),
    _ = require('lodash'),
    util = {};

exports = module.exports = util;

_.mixin({
  'underscore': function(string) {
    return string.replace(/([A-Z])/g, function($1){ return "_" + $1.toLowerCase(); });
  }
});

['relaunchConfig', 'clipboardContents', 'updateSettings'].forEach(function(action){
  util[action] = function(){

    this.stack.push(function(){
      return this.client.once(0, _.underscore(action));
    }.bind(this));

    return this;
  };
});

util.alert = function( func ){
  if(  _.isUndefined(func) ){ return this; }
  if(  _.isFunction(func) ){ this.stack.push(func); }
  if(  _.isString(func) ){
    this.stack.push(function(){ return { message: func }; });
  };
  if(  _.isObject(func) && _.isString(func.message) ){
    this.stack.push(function(){ return func; });
  };

  this.stack.push(function(alert){
    if ( _.isUndefined(alert) || !_.isString(alert.message) ) { return this; }
    return this.client.once(0, 'alert', alert.message, alert.duration || 2);
  }.bind(this));

  return this;
};

util.log = function( func ){
  if(  _.isUndefined(func) ){ return this; }
  if(  _.isFunction(func) ){ this.stack.push(func); }
  if(  _.isString(func) ){
    this.stack.push(function(){ return func; });
  };

  this.stack.push(function(log){
    if ( _.isUndefined(log) || !_.isString(log) ) { return this; }
    return this.client.once(0, 'log', log);
  }.bind(this));

  return this;
};

util.chooseFrom = function( func ){
  if(  _.isUndefined(func) ){ return this; }
  if(  _.isFunction(func) ){ this.stack.push(func); }
  if(  _.isObject(func) && _.isArray(func.list) && !_.isEmpty(func.list) ){
    this.stack.push(function(){ return func; });
  };

  this.stack.push(function(chooseFrom){
    var popup = {
      title: 'Choose From',
      lines_tall: 5,
      chars_wide: 30,
      list: []
    };
    _.extend( popup, chooseFrom );
    return this.client.listen(2, 0, 'choose_from', popup.list, popup.title, popup.lines_tall, popup.chars_wide).then(function(message){
      return message;
    })
  }.bind(this));

  return this;
};
