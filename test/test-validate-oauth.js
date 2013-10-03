var Bird   = require('../index').Bird;
var expect = require('chai').expect;

describe("_validateOAuth", function(){
  it("should throw when no oauth params are present", function(){
    var b = Bird()
    var fn = function(){
      b._validateOAuth();
    }
    expect(fn).to.throw(Error)
  });

  it("should not throw when oauth params are given at initialization", function(){
    var b = Bird({ oauthy: 'stuff' });
    var fn = function(){
      b._validateOAuth();
    }
    expect(fn).to.not.throw(Error)
  });
});
