var assert = require('assert'),
    when = require('when'),
    Api = require('./../src/api');

require('when/monitor/console');
describe.only('Api', function(){

  describe('chain', function(){

    var api;

    beforeEach(function(){
      api = new Api();
    });

    it('should push two calls to the stack', function(){
      api.thenGetClipboardContents().then(function(){});
      assert.equal(api.stack.length, 2);
    });

    it('should solve the stack (async)', function(done){
      api
      .then(function(){
        var deferred = when.defer();
        setTimeout(function(){
          deferred.resolve('done');
        }, 500);
        return deferred.promise;
      })
      .then(function(value){
        assert.equal(value, 'done');
        return 1;
      })
      .force(function( one ){
        assert.equal(one, 1);
      })
      .then(done, done);
    });

    it('should solve the stack twice', function(done){
      var i = 0;
      var promise = api
      .then(function(){
        var deferred = when.defer();
        setTimeout(function(){
          deferred.resolve('done');
          i += 1;
        }, 200);
        return deferred.promise;
      });
      promise.force(function(){})
      setTimeout(function(){
        promise.force(function(){
          assert.equal(i, 2)
        }).then(done, done);
      }, 800);
    });

  });

  describe('endpoints', function(){

    var api,
        client;

    var Dispatcher = function(){
      var stack = [];
      var beforeSendCallback;

      this.replyWith = function(/* args */){
        stack.push( [].slice.call(arguments) );
        return this;
      };

      this.interceptMessage = function( func ){
        beforeSendCallback = func;
        return this;
      }

      this.once = function(){
        if (beforeSendCallback) beforeSendCallback.apply(null, arguments);
        return this;
      };

      this.then = function( callback ){
        if (callback && stack.length) callback.apply(null, stack.shift());
        return this;
      };

    };

    beforeEach(function(){
      client = new Dispatcher();
    });

    it('should get the clipboard content', function(done){
      api = new Api( client.replyWith('This is my clipboard') );
      api.thenGetClipboardContents().force(function(clipboard){
        assert.equal('This is my clipboard', clipboard);
      }).then(done, done);
    });

    it('should get the focused window', function(done){
      api = new Api( client.replyWith(99) );
      api.thenGetFocusedWindow().force(function(window){
        assert.equal(window.id, 99);
      }).then(done, done);
    });

    it('should get the window frame', function(done){
      api = new Api( client.replyWith({x: 1, y: 2, w: 3, h: 4}) );
      api
      .then(function(){ return { id: 67 }; })
      .thenGetWindowFrame().force(function(window){
        assert.equal(window.id, 67);
        assert.equal(window.frame.x, 1);
      })
      .then(done, done);
    });

    it('should set the window frame', function(done){
      client.replyWith('OK').interceptMessage(function(id, command, frame){
        assert.equal(id, 78);
        assert.equal(frame.h, 4);
      });
      api = new Api( client );
      api
      .thenSetWindowFrame(function(){
        return {
          id: 78,
          frame: {x: 1, y: 2, w: 3, h: 4}
        };
      })
      .force(done, done);
    });

  });

});
