var net = require('net');

exports = module.exports = MockServer

function MockServer(port){
  this.server = net.createServer(function(connection) {
    this.socket = connection;
  }.bind(this)).listen(port);
  this.stack = [];
  this.server.on('connection', function(socket){
    this.socket = socket;
  }.bind(this));
}

MockServer.prototype.replyWith = function( messages ){
  messages = Array.isArray(messages) ? messages : [messages];
  this.stack.push(function(socket){

    return function(data){
      var message = JSON.parse(data.toString('utf-8').split('\n')[1]);
      var id = message.shift();
      messages.forEach(function(message, index){
        setTimeout(function(){
          var output = JSON.stringify([id].concat(message));
          socket.write(output);
        }, index * 100);
      });
    };

  });

  var nextItemFromStack = function(data){
    if( this.stack.length ){
      var reply = this.stack.shift();
      reply(this.socket)(data);
    }
    this.socket.once('data', nextItemFromStack);
  }.bind(this);

  var waitForConnection = function(){
    if( this.socket ){
      this.socket.once('data', nextItemFromStack);
    } else {
      setTimeout( waitForConnection, 50 );
    }
  }.bind(this);

  waitForConnection();
};

MockServer.prototype.destroy = function(callback){
  this.server.close(callback);
};
