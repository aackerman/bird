var request = require('request');
var stream = require('stream');
var qs = require('querystring');

//constructor
var Bird = function(options){
  var consumer_key = options.consumer_key
    , consumer_secret = options.consumer_secret
    , callback = options.callback
    , token = options.token || ''
    , token_secret = options.token_secret || '';

  this.oauth = {
    callback: callback,
    consumer_key: consumer_key,
    consumer_secret: consumer_secret,
    token: token,
    token_secret: token_secret
  };
};

Bird.prototype.login = function(callback){
  var url = 'https://twitter.com/oauth/request_token';
  request.post({url:url, oauth:this.oauth}, callback);
};

Bird.prototype.auth_callback = function(callback){
  var url = 'https://api.twitter.com/oauth/access_token';
  request.post({url:url, oauth: this.oauth}, callback);
};

Bird.prototype.post = function(url, callback){
  if (this.oauth.token) {
    return request.post({url: url, oauth: this.oauth}, callback);
  } else {
    callback({result: 'error', reason: 'missing access token'});
  }
};

Bird.prototype.get = function(url, callback){
  if (this.oauth.token) {
    return request({url: url, oauth: this.oauth}, callback);
  } else {
    callback({result: 'error', reason: 'missing access token'});
  }
};

//add other routes to the prototype
(function(){

  var base_url = 'http://api.twitter.com/1/';

  var routes = {

    get : {
      home_timeline : {
        url  : 'statuses/home_timeline.json',
        omitId   : true
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

  var createRoute = function(route, verb){
    var url = routes[verb][route].url
      , omitId = routes[verb][route].omitId;
    return function(options, callback){
      options = options || {};
      
      if(!options.id && !omitId) {
        var response = {result: 'error', reason: 'missing parameter id in options'}
        if(callback) {callback(response);}
        else {
          var s = new stream.Stream();
          emitError(s, JSON.stringify(response));
          return s;
        } 
      } else {
        var newUrl = parseUrl(url, options, omitId, callback);
        return this[verb](newUrl, callback);
      }
    }
  };

  var parseUrl = function(url, options, omitId, callback){
    // If the url is an array, use this pattern to create the final url
    if(!omitId) {
      if (typeof url == 'array') {
        url = url[0] + options.id + url[1];
        delete options.id;
      }

      // If the url is an string, use this pattern to create the final url
      if (typeof url == 'string') {
        url += options.id + '.json';
        delete options.id;
      }
    }

    //stringify options params
    url += '?' + qs.stringify(options);

    // use the default base url if base protocol is not present
    if(!url.match(/http/)) {
      url = base_url + url;
    }

    return url;
  };

  var emitError = function(stream, err) {
    process.nextTick(function(){
      stream.emit('data', err);
      stream.emit('end');
    });
  };

  //create routes
  for(var verb in routes) {
    if(routes.hasOwnProperty(verb)){
      Object.keys(routes[verb]).forEach(function(route){
        Bird.prototype[route] = createRoute(route, verb);
      }.bind(this));
    }
  }
})();

module.exports = {
  bird: function(options){
    return new Bird(options);
  },
  Bird: Bird
}