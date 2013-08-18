var assert = require('assert'),
    net = require('net'),
    when = require('when'),
    MockServer = require('./mockServer'),
    Zephyros = require('./../src/zephyros');

describe('Zephyros', function(){

  var mockServer;

  beforeEach(function(){
    mockServer = new MockServer(8125);
  });

  afterEach(function(){
    mockServer.destroy();
  });

  it('should bind to a key shortcut twice', function(done){
    var z = new Zephyros({
      port: 8125,
      host: 'localhost'
    });
    mockServer.replyWith([ '-1', 'null' ]);
    mockServer.replyWith('My clipboard');
    z.bind('t', ['Cmd', 'Shift']).clipboardContents().then(function(clip){
      assert.equal(clip, 'My clipboard');
      done();
    });
  });

  it('should bind to a key shorcut and execute calls outside of bind', function(done){
    var z = new Zephyros({
      port: 8125,
      host: 'localhost'
    });
    mockServer.replyWith([ '-1', 'null' ]);
    mockServer.replyWith('Clip');
    z.bind('r', ['Cmd', 'Shift']).then(function(){
      z.api().clipboardContents().then(function(clip){
        assert(clip, 'Clip');
        done();
      });
    });
  });

  it('should listen for two events', function(done){
    var z = new Zephyros({
      port: 8125,
      host: 'localhost'
    });
    mockServer.replyWith([ '-1', '77' ]);
    z.listen('window_created').then(function(window){
      assert.equal(window.id, 77);
    }).then(done, done);
  });

});
