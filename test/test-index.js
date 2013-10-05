var Bird   = require('../index');
var expect = require('chai').expect;
var oauth  = require('../oauth.json');

describe("Bird", function(){

  describe("timeline.home", function(){
    it("returns a valid json response", function(done){
      Bird.timelines.home({ oauth: oauth }, function(err, r, b){
        expect(r.statusCode).to.eq(200);
        done();
      })
    });

    it("throws an error when not given oauth parameters", function(){
      expect(Bird.timelines.home).to.throw(Error);
    });
  });
});
