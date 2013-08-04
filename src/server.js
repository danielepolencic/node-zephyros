var when = require('when'),
    fn = require('when/function'),
    net = require('net'),
    uuid = require('node-uuid'),
    _ = require('lodash'),
    pipeline = require('when/pipeline'),
    nodefn = require("when/node/function");

exports = module.exports = Server;

function Server(options){
  this.queue = [];
  this.client = net.connect(options);
  this.client.on('data', this.onData.bind(this));
}

Server.prototype.onData = function(data){
  console.log("data: ", data.toString())
  console.log("--");
  try {
    var message = JSON.parse(data.toString('ascii').split('\n')[1]);
    var id = message.shift();

    if( id in this.queue ){
      var callback = this.queue[id];
      console.log('call: ', id)
      if (callback) callback.call(null, message);
    }
  } catch (e) {
    console.log("error: ", e)
  }
}

Server.prototype.once = function(){
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

Server.prototype.listen = function(){
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
    }
  }
};
