var Bird   = require('../index');
var expect = require('chai').expect;
var oauth  = {
  consumer_key: process.env.TW_CONSUMER_KEY,
  consumer_secret: process.env.TW_CONSUMER_SECRET,
  token: process.env.TW_TEST_TOKEN,
  token_secret: process.env.TW_TEST_TOKEN_SECRET
};

describe("Bird", function(){

  describe('requestToken', function(){
    it('returns a valid oauth token', function(done){
      Bird.auth.requestToken({
        oauth: {
          consumer_key: oauth.consumer_key,
          consumer_secret: oauth.consumer_secret
        }
      }, function(err, res, body){
        expect(err).to.be.null;
        expect(res.statusCode).to.eq(200);
        done();
      });
    });
  });

  describe('Bird.timelines', function(){
    it('is a namespace for each of the twitter timeline routes', function() {
      expect(Bird.timelines).to.be.an('object');
    });

    describe("Bird.timelines.home", function(){
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

    describe("Bird.timelines.mentions", function(){
      it("returns a valid json response", function(done){
        Bird.timelines.mentions({ oauth: oauth }, function(err, r, b){
          expect(r.statusCode).to.eq(200);
          done();
        })
      });

      it("throws an error when not given oauth parameters", function(){
        expect(Bird.timelines.mentions).to.throw(Error);
      });
    });

    describe("Bird.timelines.user", function(){
      it("returns a valid json response", function(done){
        Bird.timelines.user({ oauth: oauth }, function(err, r, b){
          expect(r.statusCode).to.eq(200);
          done();
        })
      });

      it("throws an error when not given oauth parameters", function(){
        expect(Bird.timelines.user).to.throw(Error);
      });
    });

    describe("Bird.timelines.retweetsOfMe", function(){
      it("returns a valid json response", function(done){
        Bird.timelines.retweetsOfMe({ oauth: oauth }, function(err, r, b){
          expect(r.statusCode).to.eq(200);
          done();
        })
      });

      it("throws an error when not given oauth parameters", function(){
        expect(Bird.timelines.retweetsOfMe).to.throw(Error);
      });
    });
  });

  describe('Bird.tweets', function(){
    it('is a namespace for each of the twitter tweets routes', function() {
      expect(Bird.tweets).to.be.an('object');
    });

    describe('Bird.tweets.retweets', function(){
      it("throws an error when not given an id parameter", function(){
        var fn = function(){
          Bird.tweets.show({ oauth: oauth });
        }
        expect(fn).to.throw(Error);
      });
    });

    describe('Bird.tweets.update', function(){
      it('sends new tweets', function(done){
        Bird.tweets.update({ oauth: oauth, status: 'Bird.tweets.update ' + Date.now() }, function(err, r, b){
          expect(r.statusCode).to.eq(200);
          done();
        })
      });

      it("throws an error when not given an status parameter", function(){
        var fn = function(){
          Bird.tweets.update({ oauth: oauth });
        }
        expect(fn).to.throw(Error);
      });
    });

    describe("Bird.tweets.show", function(){
      it("throws an error when not given an id parameter", function(){
        var fn = function(){
          Bird.tweets.show({ oauth: oauth });
        }
        expect(fn).to.throw(Error);
      });
    });
  });

});
