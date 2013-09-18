var request = require('request');
var qs      = require('querystring');

var Bird = function() {
  this.hostname         = 'api.twitter.com';
  this.requestTokenPath = this.hostname + '/oauth/request_token';
  this.accessTokenPath  = this.hostname + '/oauth/access_token';
  this.apiVersion       = '1.1';
};

Bird.prototype.login = function(options) {
  return request.post({
    url: this.requestTokenPath,
    options: options.oauth
  });
};

Bird.prototype.auth = function(options) {
  request.post({
    url: this.accessTokenPath,
    options: options.oauth
  });
};

Bird.prototype.timelines = {
  home: 'statuses/home_timeline.json',
  mentions: 'statuses/mentions_timeline.json',
  user: 'statuses/user_timeline.json'
};

Bird.prototype.retweets = {
  ofMe: 'statuses/retweeted_of_me.json',
  toUser: 'statuses/retweeted_to_user.json',
  byUser: 'statuses/retweeted_by_user.json'
};

Bird.prototype.directMessages = {
  base: 'direct_messages.json',
  sent: 'direct_messages/sent.json',
  show: 'direct_messages/show.json'
};

Bird.prototype.account = {
  rateLimitStatus: 'account/rate_limit_status.json',
  verifyCredentials: 'account/verify_credentials.json',
  totals: 'account/totals.json',
  settings: 'account/settings.json'
}



module.exports.Bird = Bird;

//add other methods to the prototype
(function(){

  var routes = {

    get : {

      show : {
        url  : 'statuses/show.json'
      },

      retweet_ids : {
        url  : 'statuses/retweets/'
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
        url  : 'direct_messages/destroy.json'
      },

      direct_messages_new : {
        url  : 'direct_messages/new.json'
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
  };

  var createRoute = function(route, verb){
    var url = routes[verb][route].url;
    return function(options, callback){
      options = options || {};
      options.url = parseUrl(url, options);
      return Bird[verb](options, callback);
    };
  };

  var parseUrl = function(url, options){
    //deal with adding options id to the url
    if (typeof url == 'array') {
      url = url[0] + options.id + url[1];
      delete options.id;
    }

    if (typeof url == 'string' && !url.match(/json/)) {
      url += options.id + '.json';
      delete options.id;
    }

    //make sure oauth isn't added to the url
    var oauth = options.oauth;
    delete options.oauth;

    //stringify url
    url += '?' + qs.stringify(options);

    //re-add oauth
    options.oauth = oauth;

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

  var wrapCreateRoute = function(route) {
    Bird[route] = createRoute(route, verb);
  };

  //create routes and add them to the prototype
  for(var verb in routes) {
    if(routes.hasOwnProperty(verb)){
      Object.keys(routes[verb]).forEach(wrapCreateRoute);
    }
  }
})();

module.exports = Bird;
