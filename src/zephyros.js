var Api = require('./api'),
    Client = require('./client'),
    _ = require('lodash');

function Zephyros(options){
  var default_options = {
    port: 1235,
    host: 'localhost'
  };
  _.extend(default_options, options);
  this.client = new Client(default_options);
}

exports = module.exports = Zephyros;

Zephyros.prototype.bind = function( key, modifier ){
  var api = new Api(this.client);
  this.client.listen(0, 'bind', key, modifier).then(undefined, undefined, api.force.bind(api));
  return api;
};

Zephyros.prototype.api = function(){
  var api = new Api(this.client);
  process.nextTick(api.force.bind(api));
  return api;
};

Zephyros.prototype.listen = function( event ){
  var api = new Api(this.client);
  this.client.listen(0, 'listen', event)
  .then(undefined, undefined, function(window_id){ api.force.call(api, { id: window_id }); })
  return api;
};
