var Bird   = require('../index');
var expect = require('chai').expect;
var path   = require('path');
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
        expect(function(){
          Bird.tweets.show({ oauth: oauth });
        }).to.throw(Error);
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

  describe('Bird.media.upload', function(){
    it('uploads the test image', function(done){
      // increase the timeout to 5s
      this.timeout(5000);

      Bird.media.upload({
        oauth: oauth,
        media: path.resolve('test/test-media.png')
      }, function(err, r, b){
        expect(r.statusCode).to.eq(200);
        done();
      });
    });

    describe('attaching an image to a tweet', function(){
      it('attaches the media by id to a new tweet', function(done){
        // increase the timeout to 5s
        this.timeout(5000);

        Bird.media.upload({
          oauth: oauth,
          media: path.resolve('test/test-media.png')
        }, function(err, r, b){
          expect(r.statusCode).to.eq(200);

          // attach media ids to from uploaded file to tweet
          Bird.tweets.update({
            oauth: oauth,
            status: 'Bird.tweets.update ' + Date.now(),
            media_ids: JSON.parse(b).media_id_string
          }, function(err, r, b){
            expect(r.statusCode).to.eq(200);
            done();
          });
        });
      });
    });
  });

  describe('Bird.application.rateLimits', function(){
    it('returns the current api limits for the application', function(done){
      Bird.application.rateLimits({ oauth: oauth }, function(err, r, b){
        expect(r.statusCode).to.eq(200);
        done();
      });
    });
  });

  describe('Bird.followers.list', function(){
    it('returns the current api limits for the application', function(done){
      Bird.followers.list({ oauth: oauth }, function(err, r, b){
        expect(r.statusCode).to.eq(200);
        done();
      });
    });
  });

  describe('Bird.followers.index', function(){
    it('returns the current api limits for the application', function(done){
      Bird.followers.index({ oauth: oauth }, function(err, r, b){
        expect(r.statusCode).to.eq(200);
        done();
      });
    });
  });

  describe('Bird.help', function(){
    it('is a namespace', function(){
      expect(Bird.help).to.be.an('object');
    });

    describe('Bird.help.configuration', function(){
      it('returns some configuration', function(done){
        Bird.help.configuration({ oauth: oauth }, function(err, r, b){
          expect(r.statusCode).to.eq(200);
          done();
        });
      });
    });

    describe('Bird.help.languages', function(){
      it('returns some language info', function(done){
        Bird.help.languages({ oauth: oauth }, function(err, r, b){
          expect(r.statusCode).to.eq(200);
          done();
        });
      });
    });

    describe('Bird.help.privacy', function(){
      it('returns some privacy info', function(done){
        Bird.help.privacy({ oauth: oauth }, function(err, r, b){
          expect(r.statusCode).to.eq(200);
          done();
        });
      });
    });

    describe('Bird.help.tos', function(){
      it('returns the twitter terms of service', function(done){
        Bird.help.tos({ oauth: oauth }, function(err, r, b){
          expect(r.statusCode).to.eq(200);
          done();
        });
      });
    });

  });

  describe('Bird.trends', function(){
    it('is a namespace', function(){
      expect(Bird.trends).to.be.an('object');
    });

    describe('Bird.trends.place', function(){
      it('returns trending places', function(done){
        Bird.trends.place({ oauth: oauth, id: 1 }, function(err, r, b){
          expect(r.statusCode).to.eq(200);
          done();
        });
      });
    });

    describe('Bird.trends.available', function(){
      it('returns available trends', function(done){
        Bird.trends.available({ oauth: oauth }, function(err, r, b){
          expect(r.statusCode).to.eq(200);
          done();
        });
      });
    });

    describe('Bird.trends.closest', function(){
      it('throws when necessary params are not provided', function(){
        expect(function(){
          Bird.trends.closest({ oauth: oauth });
        }).to.throw(Error);
      });

      it('returns available trends', function(done){
        Bird.trends.closest({ oauth: oauth, lat: 0, long: 0 }, function(err, r, b){
          expect(r.statusCode).to.eq(200);
          done();
        });
      });
    });
  });

});
