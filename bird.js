var oauth = require('oauth');
var qs = require('querystring');

module.exports = function(options){

  var Bird = function(options){
    var oauth_token = options.oauth_token;
    var oauth_token_secret = options.oauth_token_secret;
    this.base_url = 'http://api.twitter.com/1/';

    /**
      Util functions
     **/
    this.consumer = (function(){
      return new oauth.OAuth(
        "https://twitter.com/oauth/request_token",
        "https://twitter.com/oauth/access_token",
        oauth_token, oauth_token_secret, "1.0A", options.callback, "HMAC-SHA1");
    })();

    this.get = function(url, req, cb){
      if (req.session.access_token && req.session.access_token_secret) {
        this.consumer.get(
          url,
          req.session.access_token,
          req.session.access_token_secret,
          function(err, data, response){
            cb(err, data, response);
          }
        );  
      } else {
        cb({result: 'error', reason: 'missing access token'});
      }
    };

    this.post = function(url, req, cb){
      if (req.session.access_token && req.session.access_token_secret) {
        this.consumer.post(
          url,
          req.session.access_token,
          req.session.access_token_secret,
          null,
          null,
          function(err, data, response){
            cb(err, data, response);
          }
        );
      } else {
        cb({result: 'error', reason: 'missing access token'});
      }
    };

    this.send = function(url, req, verb, cb){
      this[verb](url, req, cb);
    }

    /**
      Auth functions
    **/
    this.login = function(req, cb){
      this.consumer.getOAuthRequestToken(
        function(err, oauth_token, oauth_token_secret, results){
          cb(err, oauth_token, oauth_token_secret, results);
      });
    };

    this.auth_callback = function(req, cb){
      this.consumer.getOAuthAccessToken(
        req.session.oauth_token,
        req.session.oauth_token_secret,
        req.query.oauth_verifier,
        function(err, access_token, access_token_secret, results) {
          cb(err, access_token, access_token_secret, results);
        }
      );
    };

    /**
      Routes
    **/
    var routes = {

      get : {
        home_timeline : {
          url  : 'statuses/home_timeline.json'
        },
        
        mentions : {
          url  : 'statuses/mentions.json'
        },

        retweeted_by_me : {
          url  : 'statuses/retweeted_by_me.json'
        },

        retweeted_to_me : {
          url  : 'statuses/retweeted_by_me.json'
        },

        user_timeline : {
          url  : 'statuses/user_timeline.json'
        },

        retweeted_to_user : {
          url  : 'statuses/retweeted_to_user.json'
        },

        retweeted_by_user : {
          url  : 'statuses/retweeted_by_user.json'
        },

        show : {
          url  : 'statuses/show.json'
        },

        retweet_ids : {
          url  : 'statuses/retweets/'
        },

        direct_messages : {
          url  : 'direct_messages.json'
        },

        direct_messages_sent : {
          url  : 'direct_messages/sent.json'
        },

        direct_messages_show : {
          url  : 'direct_messages/show/'
        },

        followers : {
          url  : 'followers/ids.json'
        },

        friends : {
          url  : 'friends/ids.json'
        },

        friendships_exists : {
          url  : 'friendships/exists.json'
        },

        friendships_incomming : {
          url  : 'friendships/incomming.json'
        },

        friendships_outgoing : {
          url  : 'friendships/outgoing.json'
        },

        friendships_show : {
          url  : 'friendships/show.json'
        },

        friendships_lookup : {
          url  : 'friendships/lookup.json'
        },

        friendships_no_retweet_ids : {
          url  : 'friendships/no_retweet_ids.json'
        },

        users_lookup : {
          url  : 'users/lookup.json'
        },

        users_search : {
          url  : 'users/search.json'
        },

        users_show : {
          url  : 'users/show.json'
        },

        users_contributees : {
          url  : 'users/contributees.json'
        },

        users_contributors : {
          url  : 'users/contributors.json'
        },

        favorites : {
          url  : 'favorites.json'
        },

        account_rate_limit_status : {
          url  : 'account/rate_limit_status.json'
        },

        account_verify_credentials : {
          url  : 'account/verify_credentials.json'
        },

        account_totals : {
          url  : 'account/totals.json'
        },

        account_get_settings : {
          url  : 'account/settings.json'
        },

        /* Undocumented APIs */
        related : {
          url  : 'related_results/show/'
        },

        tweet_summary : {
          url  : ['statuses/', '/activity/summary.json']
        }
      },

      post : {
        tweet : {
          url  : 'statuses/update.json'
        },
        delete_tweet : {
          url  : 'statuses/destroy/'
        },

        retweet : {
          url  : 'statuses/retweet/'
        },

        oembed : {
          url  : 'statuses/oembed.json'
        },

        search : {
          url  : 'http://search.twitter.com/search.json'
        },

        direct_messages_destroy : {
          url  : 'direct_messages/destroy/'
        },

        direct_messages_new : {
          url  : 'direct_messages/new/'
        },

        friendships_create : {
          url  : 'friendships/create.json'
        },

        friendships_destroy : {
          url  : 'friendships/destroy.json'
        },

        friendships_update : {
          url  : 'friendships/update.json'
        },

        favorites_create : {
          url  : 'favorites/create/'
        },

        favorites_delete : {
          url  : 'favorites/destroy/'
        }, 

        acount_end_session : {
          url  : 'account/end_session.json'
        },

        account_update_profile : {
          url  : 'account/update_profile.json'
        },

        account_update_profile_background_image : {
          url  : 'account/update_profile_background_image.json'
        },

        account_update_profile_colors : {
          url  : 'account/update_profile_colors.json'
        },

        account_update_profile_image : {
          url  : 'account/update_profile_image.json'
        },

        account_update_settings : {
          url  : 'account/settings.json'
        }
      }
    }

    var parseUrl = function(url, options, cb){
      // If the url is an array, use this pattern to create the final url
      if(!options.id) {
        cb({result: 'error', reason: 'missing parameter id in options')});
        return;
      } else {
        if (typeof url == 'array') {
          url = url[0] + options.id + url[1];
          delete options.id;
        }

        // If the url is an string, use this pattern to create the final url
        if (typeof url == 'string') {
          url += options.id + '.json';
          delete options.id;
        }

        //stringify options params
        url += '?' + qs.stringify(options);

        // use the default base url if base protocol is not present
        if(!url.match(/http/)) {
          url = this.base_url + url;
        }

        return url;
      }
    }

    var applyRoute = function(route, verb){
      var url = routes[route].url;

      return function(req, options, cb){
        var url = parseUrl(url, options, cb);
        this.send(url, req, verb, cb);
      }
    }

    //partially apply routes
    for(var verb in routes) {
      if(routes.hasOwnProperty(verb)){
        verb.forEach(function(route){
          this[route] = applyRoute(route, verb);
        });
      }
    }
  };

  return new Bird(options);
};