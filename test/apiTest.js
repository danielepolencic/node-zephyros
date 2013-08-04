var assert = require('assert'),
    when = require('when'),
    Api = require('./../src/api');

describe('Api', function(){

  describe('chain', function(){

    it('should push two calls to the stack', function(){
      var api = new Api();
      api.thenClipboardContents().then(function(){});
      assert.equal(api.stack.length, 2);
    });

    it('should solve the stack (async)', function( done ){
      var api = new Api();
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
        done();
      });
    });

    it('should solve the stack twice', function(done){
      var api = new Api();
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
          done();
        })
      }, 800);
    });

  });

});
