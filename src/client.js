var net = require('net'),
    uuid = require('node-uuid');

exports = module.exports = Client;

function Client(options){
  this.queue = {};
  this.client = net.connect(options);
  this.client.on('data', this.onData.bind(this));
}

Client.prototype.onData = function(data){
  var raw = data.toString().split(/\s*\d+\n(\[.*\])\s*/gm);
  raw.forEach(function(item){
    try {
      if(!item || 0 === item.length) return;
      var message = JSON.parse(item);
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
  }.bind(this));
}

Client.prototype.once = function(){
  var args = [].slice.call(arguments);

  var callback = function( queue, id, response ){
    if( id in queue ) delete queue[id];
    this._callback.call(null, response);
  };

  return new this.sendCommandAndWait( args, this.queue, this.client, callback );
};

Client.prototype.listen = function(){
  var args = [].slice.call(arguments);

  var callback = function( queue, id, response ){
    this._callback.call(null, response);
  };

  return new this.sendCommandAndWait( args, this.queue, this.client, callback );
};

Client.prototype.sendCommandAndWait = function( args, queue, client, callback ){
  var id = uuid.v4();
  this._callback = function(){}

  queue[id] = callback.bind(this, queue, id);

  args.unshift(id);
  var message = JSON.stringify(args);
  client.write(message.length + '\n' + message);

  this.then = function( callback ){
    this._callback = callback;
  };
};
