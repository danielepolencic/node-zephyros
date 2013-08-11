var Api = require('./api'),
    Client = require('./client');

function Zephyros(options){
  var default_options = {
    port: 1235,
    host: 'localhost'
  };
  if (options) {
    options['port'] = options['port'] || default_options.port;
    options['host'] = options['host'] || default_options.host;
  } else {
    options = default_options;
  }
  this.client = new Client(options);
}

exports = module.exports = Zephyros;

Zephyros.prototype.bind = function( key, modifier ){
  var api = new Api(this.client);
  this.client.listen(0, 'bind', key, modifier).then(api.force.bind(api));
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
  .then(function(window_id){ api.force.call(api, { id: window_id }); })
  return api;
};
