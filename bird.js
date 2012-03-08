var oauth = require('oauth');
var _ = require('underscore');
var sys = require('sys');

module.exports = function(options){
  var Bird = function(options){
    var oauth_token = options.oauth_token;
    var oauth_token_secret = options.oauth_token_secret;
    this.base_url = 'http://api.twitter.com/1';

    this.consumer = (function(){
      return new oauth.OAuth(
        "https://twitter.com/oauth/request_token",
        "https://twitter.com/oauth/access_token",
        oauth_token, oauth_token_secret, "1.0A", options.callback, "HMAC-SHA1");
    })();

    this.login = function(req, res){
      this.consumer.getOAuthRequestToken(
        function(error, oauth_token, oauth_token_secret, results){
          if (error) {
            res.send("Error getting OAuth request token : " + sys.inspect(error), 500);
          } else {
            req.session.oauth_token = oauth_token;
            req.session.oauth_token_secret = oauth_token_secret;
            res.redirect("https://twitter.com/oauth/authorize?oauth_token="+req.session.oauth_token);
          }
      });
    };

    this.callback = function(req, res){
      this.consumer.getOAuthAccessToken(
        req.session.oauth_token,
        req.session.oauth_token_secret,
        req.query.oauth_verifier,
        function(error, access_token, access_token_secret, results) {
          if (error) {
            console.log(error);
          } else {
            req.session.access_token = access_token;
            req.session.access_token_secret = access_token_secret;
            req.session.signedIn = 1;
            
            res.redirect('/');
          }
        }
      );
    };

    this.home_timeline = function(req, cb){
      this.consumer.get(
        this.base_url+'/statuses/home_timeline.json',
        req.session.access_token,
        req.session.access_token_secret,
        function(err, data, response){
          if (err) {
            cb(err);
          } else {
            cb(data);
          }
        }
      );
    }

    this.self = function(req, cb){
      this.consumer.get(
        'http://twitter.com/account/verify_credentials.json',
        req.session.access_token,
        req.session.access_token_secret,
        function(err, data, response){
          if (err) {
            cb(err);
          } else {
            cb(data);
          }
        }
      );
    }

  };

  return new Bird(options);
};