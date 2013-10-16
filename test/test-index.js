var Bird   = require('../index');
var expect = require('chai').expect;
var oauth  = {
  "consumer_key": process.env.TW_CONSUMER_KEY,
  "consumer_secret": process.env.TW_CONSUMER_SECRET,
  "token": process.env.TW_TOKEN,
  "token_secret": process.env.TW_TOKEN_SECRET
};

describe("Bird", function(){

  describe("timelines.home", function(){
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

  describe("tweets.show", function(){
    it("throws an error when not given an id parameter", function(){
      var fn = function(){
        Bird.tweets.show({ oauth: oauth });
      }
      expect(fn).to.throw(Error);
    });
  });
});
