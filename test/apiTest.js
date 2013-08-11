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

    it('should relaunch the config', function(done){
      client.replyWith('OK').interceptMessage(function(id, command){
        assert.equal(command, 'relaunch_config');
      });
      api = new Api( client );
      api
      .thenRelaunchConfig()
      .force(done, done);
    });

    it('should get all the visible windows', function(done){
      api = new Api( client.replyWith([5, 6, 7]) );
      api
      .thenGetVisibleWindows(function(windows){
        assert.equal(windows.length, 3);
        assert.equal(windows[0].id, 5);
      }).force(done, done);
    });

    it('should get all windows', function(done){
      api = new Api( client.replyWith([7, 8, 9]) );
      api
      .thenGetAllWindows(function(windows){
        assert.equal(windows.length, 3);
        assert.equal(windows[0].id, 7);
      }).force(done, done);
    });

    it('should get the main screen', function(done){
      api = new Api( client.replyWith(32) );
      api
      .thenGetMainScreen(function(screen){
        assert.equal(screen.id, 32);
      }).force(done, done);
    });

    it('should get all screens', function(done){
      api = new Api( client.replyWith([9, 5, 3]) );
      api
      .thenGetAllScreens(function(screens){
        assert.equal(screens.length, 3);
        assert.equal(screens[2].id, 3);
      }).force(done, done);
    });

    it('should get all the running apps', function(done){
      api = new Api( client.replyWith([8, 6, 0]) );
      api
      .thenGetRunningApps(function(apps){
        assert.equal(apps.length, 3);
        assert.equal(apps[2].id, 0);
      }).force(done, done);
    });

    it('should prompt an alert', function(done){
      client.replyWith('OK').interceptMessage(function(id, command, message, duration){
        assert.equal(command, 'alert');
        assert.equal(message, 'My Alert');
        assert.equal(duration, 3);
      });
      api = new Api( client );
      api
      .thenAlert(function(){
        return {
          message: 'My Alert',
          duration: 3
        }
      }).force(done, done);
    });

    it('should log something', function(done){
      client.replyWith('OK').interceptMessage(function(id, command, message){
        assert.equal(command, 'log');
        assert.equal(message, 'log something');
      });
      api = new Api( client );
      api
      .thenLog('log something').force(done, done);
    });

    it('should choose from a list', function(done){
      client.replyWith([0, 1]);
      api = new Api( client );
      api
      .thenChooseFrom(function(){
        return {
          title: 'My Todo List',
          list: ['One banana', 'Two cherries'],
          lines_tall: 4,
          chars_wide: 5
        };
      })
      .then(function(index_chosen){
        assert.equal(index_chosen, 1);
      })
      .force(done, done);
    });

    it('should update the settings', function(done){
      client.replyWith('OK').interceptMessage(function(id, command){
        assert.equal(command, 'update_settings');
      });
      api = new Api( client );
      api
      .thenUpdateSettings().force(done, done);
    });

  });

});
