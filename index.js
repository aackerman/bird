var request   = require('request');
var routefile = require('./routes.json');
var fs        = require('fs');

var PROTOCOL = 'https://';
var HOSTNAME = 'api.twitter.com';
var MEDIA_HOSTNAME = 'upload.twitter.com';
var API_VERSION = '1.1';
var REQUEST_TOKEN_PATH = PROTOCOL + [HOSTNAME, 'oauth', 'request_token'].join('/');
var ACCESS_TOKEN_PATH = PROTOCOL + [HOSTNAME, 'oauth', 'access_token'].join('/');

var throwOnInvalidOauth = function(options){
  if ( !options.oauth ) {
    throw new Error('You must pass oauth as an option');
  }
};

var createRequestUrl = function(opts, options) {
  var url = opts.url, replacements = {};
  if (opts && opts.needs) {

    // replacements is a map of keys and values to
    // interpolate into the URL
    if (Array.isArray(opts.needs)) {
      replacements = opts.needs.reduce(function(memo, key){
        if (options[key] !== undefined) { memo[key] = options[key]; }
        return memo;
      }, {});
    } else if (opts.needs && options[opts.needs] !== undefined) {
      replacements[opts.needs] = options[opts.needs];
    }

    if ( Object.keys(replacements).length > 0 ) {
      // interpolate values directly into the URL
      Object.keys(replacements).forEach(function(k){
        url = url.replace(":" + k, options[k]);
      });
    } else {
      throw new Error('Missing ' + opts.needs + ' value in options');
    }
  }
  return PROTOCOL + ((opts.url == "media/upload") ? MEDIA_HOSTNAME : HOSTNAME) + '/' + API_VERSION + '/' + url + '.json';
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
