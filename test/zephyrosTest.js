var assert = require('assert'),
    net = require('net'),
    when = require('when'),
    Zephyros = require('./../src/zephyros');

describe('Zephyros', function(){

  before(function(done){
    relay = net.createServer(function(connection) {
      connection.on('end', function() {
        console.log('server disconnected');
      });
      connection.on('data', function(data){
        var message = JSON.parse(data.toString('utf-8').split('\n')[1]);
        var id = message.shift();
        var output = JSON.stringify([id, 3, 'Apollo']);
        connection.write(output.length + '\n' + output);
        setTimeout(function(){
          connection.write(output.length + '\n' + output);
        }, 500);
      });
    });
    relay.listen(8125, done);
  });

  it('should bind to a key shortcut twice', function(done){
    var z = new Zephyros({
      port: 8125,
      host: 'localhost'
    });
    var i = 0;
    z.bind('t', ['Cmd', 'Shift']).thenClipboardContents().then(function(clip){
      i += 1
      if( i > 1 ){
        assert.equal(clip[0], 'Apollo');
        done();
      }
    });
  });

});
