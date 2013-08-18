var assert = require('assert'),
    when = require('when'),
    net = require('net'),
    MockServer = require('./mockServer'),
    Client = require('./../src/client');

describe('Client', function(){

  var mockServer;

  beforeEach(function(){
    mockServer = new MockServer(8124);
  });

  afterEach(function(){
    mockServer.destroy();
  })

  it('should send a json message correctly formatted', function(done){
    var client = new Client({
      port: 8124,
      host: 'localhost'
    });
    mockServer.replyWith('OK');
    client.once(0, 'random_command').then(function(response){
      assert.equal(response, 'OK');
      assert.equal(Object.keys(client.queue).length, 0);
      done();
    });
  });

  it('should send a (JSON) message and wait for other (JSON) messages to come', function(done){
    var client = new Client({
      port: 8124,
      host: 'localhost'
    });
    var i = 0;
    mockServer.replyWith(['-1', 'null', 'null']);
    client.listen(2, 'another_command').then(undefined, undefined, function(response){
      i += 1;
      if( i > 1 ){
        assert.equal(i, 2);
        done();
      }
    });
  });

});
