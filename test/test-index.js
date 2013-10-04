var Bird   = require('../index').Bird;
var expect = require('chai').expect;
var oauth  = require('../oauth.json');

describe("Bird", function(){

  describe("timeline.home", function(){
    it("returns a valid json response", function(done){
      var b = Bird(oauth);
      b.home(null, function(err, r, b){
        expect(r.statusCode).to.eq(200);
        done()
      })
    });
  });
});
