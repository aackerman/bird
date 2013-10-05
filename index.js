var request   = require('request');
var qs        = require('querystring');
var _         = require('lodash');
var routefile = require('./routes.json');


var SCHEME = 'https://';
var HOSTNAME = 'api.twitter.com';
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
  return SCHEME + HOSTNAME + '/' + API_VERSION + '/' + url + '.json';
}

var Bird = {
  login: function(opts, callback) {
    this._validateOAuth(opts);
    return request.post({
      url: REQUEST_TOKEN_PATH,
      oauth: opts.oauth,
      json: true
    }, callback);
  },
  auth: function(opts, callback) {
    this._validateOAuth(opts);
    return request.post({
      url: ACCESS_TOKEN_PATH,
      oauth: opts.oauth,
      json: true
    }, callback);
  }
};

// loop through each of the resources
_.each(routefile, function(methods, resource){
  // ensure a namespace for each resource exists
  Bird[resource] = Bird[resource] || {};

  // loop through each method in the resources
  _.each(methods, function(routes, method){

    // loop through the routes and add each route to the Bird prototype
    _.each(routes, function(routeopts, route){

      // create methods for each route
      Bird[resource][route] = function(useropts, callback){
        useropts = useropts || {};
        _validateOAuth(useropts);
        return request[method]({
          url:   _interpolate(routeopts, useropts),
          qs:    useropts.qs,
          oauth: useropts.oauth
        }, callback);
      };
    });
  });
});

module.exports = Bird;
