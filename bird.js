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
			this.consumer.get(
				url,
				req.session.access_token,
				req.session.access_token_secret,
				function(err, data, response){
					cb(err, data, response);
				}
			);
		};

		this.post = function(url, req, cb){
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
		};

		this.send = function(url, req, type, options, cb){
			if (typeof options == 'function') {
				cb = options;
			}
			//stringify options params
			if (typeof options == 'object') {
				url += '?'+qs.stringify(options);
			}

			// use the default base url
			if(!url.match(/http/)) {
				url = this.base_url + url;
			}
			this[type](url, req, cb);
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

			home_timeline : {
				url  : 'statuses/home_timeline.json',
				type : 'get'
			},
			
			mentions : {
				url  : 'statuses/mentions.json',
				type : 'get'
			},

			retweeted_by_me : {
				url  : 'statuses/retweeted_by_me.json',
				type : 'get'
			},

			retweeted_to_me : {
				url  : 'statuses/retweeted_by_me.json',
				type : 'get'
			},

			user_timeline : {
				url  : 'statuses/user_timeline.json',
				type : 'get'
			},

			retweeted_to_user : {
				url  : 'statuses/retweeted_to_user.json',
				type : 'get'
			},

			retweeted_by_user : {
				url  : 'statuses/retweeted_by_user.json',
				type : 'get'
			},

			tweet : {
				url  : 'statuses/update.json',
				type : 'post'
			},

			show : {
				url  : 'statuses/show.json',
				type : 'get'
			},

			retweet_ids : {
				url  : 'statuses/retweets/',
				type : 'get'
			},

			delete_tweet : {
				url  : 'statuses/destroy/',
				type : 'post'
			},

			retweet : {
				url  : 'statuses/retweet/',
				type : 'post'
			},

			oembed : {
				url  : 'statuses/oembed.json',
				type : 'post'
			},

			search : {
				url  : 'http://search.twitter.com/search.json',
				type : 'post'
			},

			direct_messages : {
				url  : 'direct_messages.json',
				type : 'get'
			},

			direct_messages_sent : {
				url  : 'direct_messages/sent.json',
				type : 'get'
			},

			direct_messages_destroy : {
				url  : 'direct_messages/destroy/',
				type : 'post'
			},

			direct_messages_new : {
				url  : 'direct_messages/new/',
				type : 'post'
			},

			direct_messages_show : {
				url  : 'direct_messages/show/',
				type : 'get'
			},

			followers : {
				url  : 'followers/ids.json',
				type : 'get'
			},

			friends : {
				url  : 'friends/ids.json',
				type : 'get'
			},

			friendships_exists : {
				url  : 'friendships/exists.json',
				type : 'get'
			},

			friendships_incomming : {
				url  : 'friendships/incomming.json',
				type : 'get'
			},

			friendships_outgoing : {
				url  : 'friendships/outgoing.json',
				type : 'get'
			},

			friendships_show : {
				url  : 'friendships/show.json',
				type : 'get'
			},

			friendships_create : {
				url  : 'friendships/create.json',
				type : 'post'
			},

			friendships_destroy : {
				url  : 'friendships/destroy.json',
				type : 'post'
			},

			friendships_lookup : {
				url  : 'friendships/lookup.json',
				type : 'get'
			},

			friendships_update : {
				url  : 'friendships/update.json',
				type : 'post'
			},

			friendships_no_retweet_ids : {
				url  : 'friendships/no_retweet_ids.json',
				type : 'get'
			},

			users_lookup : {
				url  : 'users/lookup.json',
				type : 'get'
			},

			users_search : {
				url  : 'users/search.json',
				type : 'get'
			},

			users_show : {
				url  : 'users/show.json',
				type : 'get'
			},

			users_contributees : {
				url  : 'users/contributees.json',
				type : 'get'
			},

			users_contributors : {
				url  : 'users/contributors.json',
				type : 'get'
			},

			favorites : {
				url  : 'favorites.json',
				type : 'get'
			}, 

			favorites_create : {
				url  : 'favorites/create/',
				type : 'post'
			},

			favorites_delete : {
				url  : 'favorites/destroy/',
				type : 'post'
			}, 

			account_rate_limit_status : {
				url  : 'account/rate_limit_status.json',
				type : 'get'
			},

			account_verify_credentials : {
				url  : 'account/verify_credentials.json',
				type : 'get'
			},

			acount_end_session : {
				url  : 'account/end_session.json',
				type : 'post'
			},

			account_update_profile : {
				url  : 'account/update_profile.json',
				type : 'post'
			},

			account_update_profile_background_image : {
				url  : 'account/update_profile_background_image.json',
				type : 'post'
			},

			account_update_profile_colors : {
				url  : 'account/update_profile_colors.json',
				type : 'post'
			},

			account_update_profile_image : {
				url  : 'account/update_profile_image.json',
				type : 'post'
			},

			account_totals : {
				url  : 'account/totals.json',
				type : 'get'
			},

			account_get_settings : {
				url  : 'account/settings.json',
				type : 'get'
			},

			account_update_settings : {
				url  : 'account/settings.json',
				type : 'post'
			},

			/* Undocumented APIs */

			related : {
				url  : 'related_results/show/',
				type : 'get'
			},

			tweet_summary : {
				url  : ['statuses/', '/activity/summary.json'],
				type : 'get'
			}
		}


		//use routes to proxy to send functions
		for(var r in routes) {
			if(routes.hasOwnProperty(r)) {
				this[r] = (function(){
					var url = routes[r].url;
					var type = routes[r].type;
					
					return function(req, options, cb) {
						//if the route is an array use the options.id to create the url
						if (typeof url !== 'string' && options.id) {
							url = routes[r].url[0] + options.id + routes[r].url[1];
							delete options.id;
						}

						if (typeof url == 'string' && options.id) {
							url += options.id + '.json';
							delete options.id;
						}
						
						this.send(url, req, type, options, cb);
					}
				})();
			}
		}
	};

	return new Bird(options);
};