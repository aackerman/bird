var request   = require('request');
var routefile = require('./routes.json');
var fs        = require('fs');

var SCHEME = 'https://';
var HOSTNAME = 'api.twitter.com';
var MEDIA_HOSTNAME = 'upload.twitter.com';
var API_VERSION = '1.1';
var REQUEST_TOKEN_PATH = SCHEME + [HOSTNAME, 'oauth', 'request_token'].join('/');
var ACCESS_TOKEN_PATH = SCHEME + [HOSTNAME, 'oauth', 'access_token'].join('/');

var throwOnInvalidOauth = function(options){
  if ( !options.oauth ) {
    throw new Error('You must pass oauth as an option');
  }
};

var createRequestUrl = function(opts, options) {
  var url = opts.url, val;
  if (opts && opts.needs) {
    val = options[opts.needs];
    if (val) {
      url = url.replace(":" + opts.needs, options[opts.needs]);
    } else {
      throw new Error('Missing interpolation value ' + opts.needs + ' in options');
    }
  }
  return SCHEME + ((opts.url == "media/upload") ? MEDIA_HOSTNAME : HOSTNAME) + '/' + API_VERSION + '/' + url + '.json';
}

var Bird = {
  auth: {
    requestToken: function(opts, callback) {
      throwOnInvalidOauth(opts);
      return request.post({
        url: REQUEST_TOKEN_PATH,
        oauth: opts.oauth,
        json: true
      }, callback);
    },
    accessToken: function(opts, callback) {
      throwOnInvalidOauth(opts);
      return request.post({
        url: ACCESS_TOKEN_PATH,
        oauth: opts.oauth,
        json: true
      }, callback);
    }
  }
};

// loop through each of the resources
Object.keys(routefile).forEach(function(namespace) {
  var verbs = routefile[namespace];

  // ensure a namespace for each namespace exists
  Bird[namespace] = Bird[namespace] || {};

  // loop through each http verb in the namespaces
  Object.keys(verbs).forEach(function(verb){
    var routes = verbs[verb];

    // loop through the routes and add each route to the Bird namespace
    Object.keys(routes).forEach(function(route){
      var routeopts = routes[route];

      // create methods for each route
      Bird[namespace][route] = function(useropts, callback){
        useropts = useropts || {};
        throwOnInvalidOauth(useropts);
        var oauth = useropts.oauth;
        delete useropts.oauth
        var opts = {
          url:   createRequestUrl(routeopts, useropts),
          qs:    useropts,
          oauth: oauth
        };
        if (opts.qs.media) {
          opts.formData = { media: fs.createReadStream(opts.qs.media) };
          delete opts.qs;
        }
        return request[verb](opts, callback);
      };
    });
  });
});

module.exports = Bird;
