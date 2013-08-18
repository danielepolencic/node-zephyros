var assert = require('assert'),
    when = require('when'),
    Api = require('./../src/api');

require('when/monitor/console');
describe('Api', function(){

  describe('chain', function(){

    var api;

    beforeEach(function(){
      api = new Api();
    });

    it('should push two calls to the stack', function(){
      api.clipboardContents().then(function(){});
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
      .then(function( one ){
        assert.equal(one, 1);
      })
      .force()
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
      promise.force()
      setTimeout(function(){
        promise.then(function(){
          assert.equal(i, 2)
        }).force().then(done, done);
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
        var deferred = when.defer();
        deferred.resolve.apply( null, stack.shift() );
        if (beforeSendCallback) beforeSendCallback.apply(null, arguments);
        return deferred.promise;
      };

    };

    beforeEach(function(){
      client = new Dispatcher();
    });

    describe('window', function(){

      it('should get the focused window', function(done){
        api = new Api( client.replyWith(99) );
        api.windowFocused().then(function(window){
          assert.equal(window.id, 99);
        }).force().then(done, done);
      });

      it('should get all the visible windows', function(done){
        api = new Api( client.replyWith([5, 6, 7]) );
        api
        .windowsVisible()
        .then(function(windows){
          assert.equal(windows.length, 3);
          assert.equal(windows[0].id, 5);
        }).force().then(done, done);
      });

      it('should get all windows', function(done){
        api = new Api( client.replyWith([7, 8, 9]) );
        api.windows()
        .then(function(windows){
          assert.equal(windows.length, 3);
          assert.equal(windows[0].id, 7);
        }).force().then(done, done);
      });

      it('should get the title', function(done){
        api = new Api(client.replyWith('This is the title'));
        api
        .then( function(){ return {id: 3} } )
        .windowTitle()
        .then(function(window){
          assert.equal(window.id, 3);
          assert.equal(window.title, 'This is the title');
        })
        .force().then(done, done);
      });

      it('should get the window frame', function(done){
        api = new Api( client.replyWith({x: 1, y: 2, w: 3, h: 4}) );
        api
        .then(function(){ return { id: 67 }; })
        .getWindowFrame().then(function(window){
          assert.equal(window.id, 67);
          assert.equal(window.frame.x, 1);
        })
        .force().then(done, done);
      });

      it('should set the window frame', function(done){
        client.replyWith(null).interceptMessage(function(id, command, frame){
          assert.equal(id, 78);
          assert.equal(frame.h, 4);
        });
        api = new Api( client );
        api
        .then(function(){ return { id: 78 }; })
        .setWindowFrame(function(){
          return {
            id: 78,
            frame: {x: 1, y: 2, w: 3, h: 4}
          };
        })
        .force().then(done, done);
      });

      it('should maximize the window', function(done){
        client.replyWith(null).interceptMessage(function(id, command){
          assert.equal(id, 96);
          assert.equal(command, 'maximize');
        });
        api = new Api( client );
        api
        .then( function(){ return {id: 96} } )
        .maximize()
        .force().then(done, done);
      });

      it('should minimize the window', function(done){
        client.replyWith(null).interceptMessage(function(id, command){
          assert.equal(id, 86);
          assert.equal(command, 'minimize');
        });
        api = new Api( client );
        api
        .then( function(){ return {id: 86} } )
        .minimize()
        .force().then(done, done);
      });

      it('should unminimize the window', function(done){
        client.replyWith(null).interceptMessage(function(id, command){
          assert.equal(id, 94);
          assert.equal(command, 'un_minimize');
        });
        api = new Api( client );
        api
        .then( function(){ return {id: 94} } )
        .unminimize()
        .force().then(done, done);
      });

      ['left', 'right', 'up', 'down'].forEach(function(direction){
        it('should focus the window ' + direction, function(done){
          client.replyWith(null).interceptMessage(function(id, command){
            assert.equal(id, 9);
            assert.equal(command, 'focus_window_' + direction);
          });
          api = new Api( client );
          api
          .then( function(){ return {id: 9} } )
          ['windowFocus' + (direction.charAt(0).toUpperCase() + direction.slice(1))]()
          .force().then(done, done);
        });
      });

    });

    describe('screen', function(){

      it('should get the screen of the current window', function(done){
        api = new Api( client.replyWith(3) );
        api
        .then(function(){ return {id: 8}; })
        .screenFromWindow()
        .then(function(screen){
          assert.equal(screen.id, 3);
        })
        .force().then(done, done);
      });

      it('should get the main screen', function(done){
        api = new Api( client.replyWith(32) );
        api
        .mainScreen()
        .then(function(screen){
          assert.equal(screen.id, 32);
        }).force().then(done, done);
      });

      it('should get the frame including dock and menu', function(done){
        api = new Api( client.replyWith({x: 3, y: 4, w: 1, h: 2}) );
        api
        .then( function(){ return {id: 4}; } )
        .frameIncludingDockAndMenu()
        .then(function(screen){
          assert.equal(screen.id, 4);
          assert.equal(screen.frame.x, 3);
          assert.equal(screen.frame.h, 2);
        }).force().then(done, done);
      });

      it('should get the frame without the dock or menu', function(done){
        api = new Api( client.replyWith({x: 4, y: 5, w: 2, h: 3}) );
        api
        .then( function(){ return {id: 5}; } )
        .frameWithoutDockOrMenu()
        .then(function(screen){
          assert.equal(screen.id, 5);
          assert.equal(screen.frame.x, 4);
          assert.equal(screen.frame.h, 3);
        }).force().then(done, done);
      });

      it('should get all screens', function(done){
        api = new Api( client.replyWith([9, 5, 3]) );
        api
        .screens()
        .then(function(screens){
          assert.equal(screens.length, 3);
          assert.equal(screens[2].id, 3);
        }).force().then(done, done);
      });

    });

    describe('app', function(){

      it('should get the app from the current window', function(done){
        api = new Api( client.replyWith(44) );
        api
        .then(function(){ return {id: 3}; })
        .appFromWindow()
        .then(function(app){
          assert.equal(app.id, 44);
        })
        .force().then(done, done);
      });

      it('should get all the running apps', function(done){
        api = new Api( client.replyWith([8, 6, 0]) );
        api
        .apps()
        .then(function(apps){
          assert.equal(apps.length, 3);
          assert.equal(apps[2].id, 0);
        }).force().then(done, done);
      });

    });

    describe('utils', function(){

      it('should get the clipboard content', function(done){
        api = new Api( client.replyWith('This is my clipboard') );
        api.clipboardContents().then(function(clipboard){
          assert.equal('This is my clipboard', clipboard);
        }).force().then(done, done);
      });

      it('should update the settings', function(done){
        client.replyWith(null).interceptMessage(function(id, command){
          assert.equal(command, 'update_settings');
        });
        api = new Api( client );
        api
        .updateSettings().force().then(done, done);
      });

      it('should relaunch the config', function(done){
        client.replyWith(null).interceptMessage(function(id, command){
          assert.equal(command, 'relaunch_config');
        });
        api = new Api( client );
        api
        .relaunchConfig()
        .force().then(done, done);
      });

      it('should prompt an alert', function(done){
        client.replyWith(null).interceptMessage(function(id, command, message, duration){
          assert.equal(command, 'alert');
          assert.equal(message, 'My Alert');
          assert.equal(duration, 3);
        });
        api = new Api( client );
        api
        .alert(function(){
          return {
            message: 'My Alert',
            duration: 3
          }
        }).force().then(done, done);
      });

      it('should log something', function(done){
        client.replyWith(null).interceptMessage(function(id, command, message){
          assert.equal(command, 'log');
          assert.equal(message, 'log something');
        });
        api = new Api( client );
        api
        .log('log something').force().then(done, done);
      });

      it('should choose from a list', function(done){
        client.replyWith([0, 1]);
        api = new Api( client );
        api
        .chooseFrom(function(){
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
        .force().then(done, done);
      });

    });

  });

});
