var request   = require('request');
var _         = require('lodash');
var routefile = require('./routes.json');
var fs        = require('fs');


var SCHEME = 'https://';
var HOSTNAME = 'api.twitter.com';
var MEDIA_HOSTNAME = 'upload.twitter.com';
var API_VERSION = '1.1';
var REQUEST_TOKEN_PATH = SCHEME + [HOSTNAME, 'oauth', 'request_token'].join('/');
var ACCESS_TOKEN_PATH = SCHEME + [HOSTNAME, 'oauth', 'access_token'].join('/');

var _validateOAuth = function(options){
  if ( !options.oauth ) {
    throw new Error('You must pass oauth as an option');
  }
};

var _interpolate = function(opts, options) {
  var url = opts.url, val;
  if (opts && opts.needs) {
    val = options[opts.needs];
    if (val) {
      url = url.replace(":" + opts.needs, options[opts.needs]);
    } else {
      throw new Error('Missing interpolation value ' + opts.needs + ' in options');
    }
  }
  return SCHEME + ((opts.url == "media\/upload") ? MEDIA_HOSTNAME : HOSTNAME) + '/' + API_VERSION + '/' + url + '.json';
}

var Bird = {
  auth: {
    requestToken: function(opts, callback) {
      this._validateOAuth(opts);
      return request.post({
        url: REQUEST_TOKEN_PATH,
        oauth: opts.oauth,
        json: true
      }, callback);
    },
    accessToken: function(opts, callback) {
      this._validateOAuth(opts);
      return request.post({
        url: ACCESS_TOKEN_PATH,
        oauth: opts.oauth,
        json: true
      }, callback);
    }
  }
};

// loop through each of the resources
_.each(routefile, function(methods, namespace){
  // ensure a namespace for each namespace exists
  Bird[namespace] = Bird[namespace] || {};

  // loop through each method in the namespaces
  _.each(methods, function(routes, method){

    // loop through the routes and add each route to the Bird namespace
    _.each(routes, function(routeopts, route){

      // create methods for each route
      Bird[namespace][route] = function(useropts, callback){
        useropts = useropts || {};
        _validateOAuth(useropts);
        var oauth = useropts.oauth;
        delete useropts.oauth
        var request_options = {
          url:   _interpolate(routeopts, useropts),
          qs:    useropts,
          oauth: oauth
        };
        if (request_options.qs.media) {
          request_options.formData = { "media": fs.createReadStream(request_options.qs.media) };
          delete request_options.qs;
        }
        return request[method](request_options, callback);
      };
    });
  });
});

module.exports = Bird;
