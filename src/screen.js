var _ = require('lodash'),
    screen = {};

exports = module.exports = screen;

_.mixin({
  'underscore': function (string) {
    return string.replace(/([A-Z])/g, function ($1) { return "_" + $1.toLowerCase(); });
  }
});

screen.screenFromWindow = function () {
  this.stack.push(function (window) {
    if (_.isUndefined(window) || !_.isNumber(window.id)) { return this; }

    return this.client.once(window.id, 'screen').then(function (screen_id) {
      return { id: screen_id };
    });
  }.bind(this));

  return this;
};

['frameIncludingDockAndMenu', 'frameWithoutDockOrMenu'].forEach(function (frame_type) {
  screen[frame_type] = function () {
    this.stack.push(function (screen) {
      if (_.isUndefined(screen) || !_.isNumber(screen.id)) { return this; }

      return this.client.once(screen.id, _.underscore(frame_type)).then(function (frame) {
        return { id: screen.id, frame: frame };
      });
    }.bind(this));

    return this;
  };
});

screen.mainScreen = function () {

  this.stack.push(function () {
    return this.client.once(0, 'main_screen').then(function (screen_id) {
      return { id: screen_id };
    });
  }.bind(this));

  return this;
};

screen.screens = function () {

  this.stack.push(function () {
    return this.client.once(0, 'all_screens').then(function (screens_ids) {
      return screens_ids.map(function (id) { return {id: id}; });
    });
  }.bind(this));

  return this;
};
