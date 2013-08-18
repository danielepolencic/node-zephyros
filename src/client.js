var net = require('net'),
    when = require('when'),
    _ = require('lodash'),
    uuid = require('node-uuid');

exports = module.exports = Client;

function Client(options){
  this.queue = {};
  this.client = net.connect(options);
  this.client.on('data', this.onData.bind(this));

  this.once = this.once.bind(this);
}

Client.prototype.onData = function(data){
  var packets;
  packets = data.toString().split(/\s*\d+\n(\[.*\])\s*/gm);
  packets
  .map(this.parsePacket, this)
  .forEach(function(packet){
    if( packet && packet.id in this.queue ){
      var callback = this.queue[packet.id];
      if(callback) callback.call(this, packet.response);
    };
  }, this);
};

Client.prototype.parsePacket = function(packet){
  var message = {}, id, response;
  if( _.isEmpty(packet) ) { return; }
  try {
    message = JSON.parse(packet);
    if(!_.isArray(message)) { return; }
    id = message.shift();
    response = message.shift();

    if( ~~response < 0 ) { return; }

    return { id: id, response: response };
  } catch (e) {
    return;
  }
};

Client.prototype.once = function(){
  var args = [].slice.call(arguments);
  var id = uuid.v4();

  var deferred = when.defer();
  this.queue[id] = function(response){
    delete this.queue[id];
    deferred.resolve(response);
  };

  args.unshift(id);
  var message = JSON.stringify(args);
  this.client.write(message.length + '\n' + message);

  return deferred.promise;
};

Client.prototype.listen = function(){
  var args = [].slice.call(arguments);
  var id = uuid.v4();

  var deferred = when.defer();
  this.queue[id] = function(response){
    deferred.notify(response);
  };

  args.unshift(id);
  var message = JSON.stringify(args);
  this.client.write(message.length + '\n' + message);

  return deferred.promise;
};
