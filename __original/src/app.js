var _ = require('lodash'),
    app = {};

exports = module.exports = app;

_.mixin({
  'capitalize': function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
});

app.appFromWindow = function () {
  this.stack.push(function (window) {
    if (_.isUndefined(window) || !_.isNumber(window.id)) { return this; }

    return this.client.once(window.id, 'app').then(function (app_id) {
      return { id: app_id };
    });
  }.bind(this));

  return this;
};

app.apps = function () {

  this.stack.push(function () {
    return this.client.once(0, 'running_apps').then(function (apps_ids) {
      return apps_ids.map(function (id) { return {id: id}; });
    });
  }.bind(this));

  return this;
};

app.appTitle = function () {
  this.stack.push(function (app) {
    if (_.isUndefined(app) || !_.isNumber(app.id)) { return this; }

    return this.client.once(app.id, 'title').then(function (app_title) {
      return { id: app.id, title: app_title };
    });
  }.bind(this));

  return this;
};

app.appIsHidden = function () {
  this.stack.push(function (app) {
    if (_.isUndefined(app) || !_.isNumber(app.id)) { return this; }

    return this.client.once(app.id, 'hidden?').then(function (isHidden) {
      return { id: app.id, isHidden: isHidden };
    });
  }.bind(this));

  return this;
};

['show', 'hide', 'kill', 'kill9'].forEach(function (action) {
  app['app' + _.capitalize(action)] = function () {
    this.stack.push(function (app) {
      if (_.isUndefined(app) || !_.isNumber(app.id)) { return this; }

      return this.client.once(app.id, action);
    }.bind(this));

    return this;
  };
});
