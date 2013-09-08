var Api = require('./api'),
    Client = require('./client');

function Zephyros(options) {
  this.client = new Client(options || {path: '/tmp/zephyros.sock'});
}

exports = module.exports = Zephyros;

Zephyros.prototype.bind = function (key, modifier) {
  var api = new Api(this.client);
  this.client.listen(0, 0, 'bind', key, modifier).then(undefined, undefined, api.force.bind(api));
  return api;
};

Zephyros.prototype.api = function () {
  var api = new Api(this.client);
  process.nextTick(api.force.bind(api));
  return api;
};

Zephyros.prototype.listen = function (event) {
  var api = new Api(this.client);
  this.client.listen(0, 0, 'listen', event)
  .then(undefined, undefined, function (window_id) { api.force.call(api, { id: window_id }); });
  return api;
};
