var when = require('when'),
    net = require('net'),
    uuid = require('node-uuid');

exports = module.exports = Client;

function Client(options){
  this.queue = [];
  this.client = net.connect(options);
  this.client.on('data', this.onData.bind(this));
}

Client.prototype.onData = function(data){
  try {
    var raw = data.toString();
    var message = JSON.parse(raw.substring(raw.indexOf('[')))
    if(!Array.isArray(message)) return;
    var id = message.shift();
    var response = message.shift();

    if( ~~response < 0 ) return;

    if( id in this.queue ){
      var callback = this.queue[id];
      if (callback) callback.call(null, response);
    }
  } catch (e) {
    console.log("error: ", e)
  }
}

Client.prototype.once = function(){
  var args = [].slice.call(arguments);
  var deferred = when.defer();
  var id = uuid.v4();

  this.queue[id] = function(response){
    delete this.queue.id;
    deferred.resolve(response);
  }.bind(this);
  args.unshift(id);
  var message = JSON.stringify(args);
  this.client.write(message.length + '\n' + message);

  return deferred.promise;
};

Client.prototype.listen = function(){
  var args = [].slice.call(arguments);
  var deferred = when.defer();
  var id = uuid.v4();
  _callback = function(){}

  this.queue[id] = function(response){
    _callback.call(null, response);
  }.bind(this);
  args.unshift(id);
  var message = JSON.stringify(args);
  this.client.write(message.length + '\n' + message);

  return {
    then : function(callback){
      _callback = callback;
      // manually fix the next promises
    }
  }
};
