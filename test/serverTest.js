var assert = require('assert'),
    when = require('when'),
    net = require('net'),
    Server = require('./../src/server');

require('when/monitor/console');

describe('Server', function(){

  var relay;

  before(function(done){
    relay = net.createServer(function(connection) {
      connection.on('end', function() {
        console.log('server disconnected');
      });
      connection.on('data', function(data){
        console.log(data.toString());
        connection.write(data)
        setTimeout(function(){ connection.write(data) }, 500);
      });
    });

    relay.listen(8124, done);
  });

  it('should send a json message correctly formatted', function(done){
    var server = new Server({
      port: 8124,
      host: 'localhost'
    });
    server.once(1, 'Daniele').then(function(response){
      assert.equal(response[0], 1);
      assert.equal(response[1], 'Daniele');
      done();
    });
  });

  it('should send a (JSON) message and wait for other (JSON) messages to come', function(done){
    var server = new Server({
      port: 8124,
      host: 'localhost'
    });
    var i = 0;
    server.listen(2, 'Me').then(function(response){
      i += 1;
      if( i > 1 ){
        assert.equal(i, 2);
        done();
      }
    });
  });

});
