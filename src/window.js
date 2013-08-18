var when = require('when'),
    _ = require('lodash'),
    window = {};

exports = module.exports = window;

_.mixin({
  'capitalize': function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
});

window.windowFocused = function(){

  this.stack.push(function(){
    return this.client.once(0, 'focused_window')
    .then(function(window_id){ return { id: window_id }; });
  }.bind(this));

  return this;
};

window.getWindowFrame = function(){

  this.stack.push(function(window){
    if ( _.isUndefined(window) || !_.isNumber(window.id) ) { return this; }

    return this.client.once(window.id, 'frame').then(function(frame){
      return { id: window.id, frame: frame };
    });
  }.bind(this));

  return this;
};

window.setWindowFrame = function( func ){
  if(  !_.isFunction(func) ){ return this; }

  this.stack.push(func);
  this.stack.push(function(window){
    if ( _.isUndefined(window) || !_.isNumber(window.id) ) { return this; }
    return this.client.once(window.id, 'set_frame', window.frame);
  }.bind(this));

  return this;
};

window.windowsVisible = function(){

  this.stack.push(function(){
    return this.client.once(0, 'visible_windows').then(function(windows_ids){
      return windows_ids.map(function(id){ return {id: id}; });
    });
  }.bind(this));

  return this;
};

window.windows = function(){

  this.stack.push(function(){
    return this.client.once(0, 'all_windows').then(function(windows_ids){
      return windows_ids.map(function(id){ return {id: id}; });
    });
  }.bind(this));

  return this;
};

window.windowTitle = function(){

  this.stack.push(function(window){
    if ( _.isUndefined(window) || !_.isNumber(window.id) ) { return this; }

    return this.client.once(window.id, 'title').then(function(title){
      return { id: window.id, title: title };
    });
  }.bind(this));

  return this;
};

['maximize', 'minimize'].forEach(function(action){
  window[action] = function(){

    this.stack.push(function(window){
      if ( _.isUndefined(window) || !_.isNumber(window.id) ) { return this; }

      return this.client.once(window.id, action);
    }.bind(this));

    return this;
  };
});

window.unminimize = function(){

  this.stack.push(function(window){
    if ( _.isUndefined(window) || !_.isNumber(window.id) ) { return this; }

    return this.client.once(window.id, 'un_minimize');
  }.bind(this));

  return this;
};

['left', 'right', 'up', 'down'].forEach(function(direction){
  window['windowFocus' + _.capitalize(direction)] = function(){
    this.stack.push(function(window){
      if ( _.isUndefined(window) || !_.isNumber(window.id) ) { return this; }

      return this.client.once(window.id, 'focus_window_' + direction);
    }.bind(this));

    return this;
  };
});
