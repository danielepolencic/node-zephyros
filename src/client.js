var when = require('when'),
    net = require('net'),
    uuid = require('node-uuid'),
    _ = require('lodash');

exports = module.exports = Client;

function Client(options){
  this.queue = [];
  this.client = net.connect(options);
  this.client.on('data', this.onData.bind(this));
}

Client.prototype.onData = function(data){
  try {
    var message = JSON.parse(data.toString('ascii').split('\n')[1]);
    var id = message.shift();
    var response = ~~message.shift();

    if( response < 0 ) return;

    if( id in this.queue ){
      var callback = this.queue[id];
      if (callback) callback.call(null, message);
    }
  } catch (e) {
    console.log("error: ", e)
  }
}

Client.prototype.once = function(){
  var args = [].slice.call(arguments);
  var deferred = when.defer();
  var id = uuid.v1();

  this.queue[id] = function(response){
    delete this.queue.id;
    deferred.resolve(response);
  }.bind(this);
  args.unshift(id);
  var message = JSON.stringify(args);
  this.client.write(message.length + '\n' + message, 'ascii');

  return deferred.promise;
};

Client.prototype.listen = function(){
  var args = [].slice.call(arguments);
  var deferred = when.defer();
  var id = uuid.v1();
  _callback = function(){}

  this.queue[id] = function(response){
    _callback.call(null, response);
  }.bind(this);
  args.unshift(id);
  var message = JSON.stringify(args);
  this.client.write(message.length + '\n' + message, 'ascii');

  return {
    then : function(callback){
      _callback = callback;
      // manually fix the next promises
    }
  }
};
