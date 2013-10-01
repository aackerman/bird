var request = require('request');
var qs      = require('querystring');
var _       = require('lodash');
var routes  = require('./routes.json');
var isValid = require('./vaidates').isValid;

var Bird = function() {
  this.hostname         = 'api.twitter.com';
  this.requestTokenPath = [this.hostname, 'oauth', 'request_token'].join('/');
  this.accessTokenPath  = [this.hostname, 'oauth', 'access_token'].join('/');
  this.apiVersion       = '1.1';
};

Bird.prototype.login = function(options) {
  return request.post({
    url: this.requestTokenPath,
    options: options
  });
};

Bird.prototype.auth = function(options) {
  return request.post({
    url: this.accessTokenPath,
    options: options
  });
};

function buildUrl(url, options) {
  var newUrl = url;
  if (options.interpolate) {
    options.interpolate = options.interpolate.replace(':', '');
    newUrl = newUrl.replace(options.interpolate, options[options.interpolate]);
  }
  return newUrl + '.' + 'json';
}

// loop through each of the resources
_.each(routes, function(methods, resource){
  // ensure a namespace for each resource exists
  Bird.prototype[resource] = Bird.prototype[resource] || {};

  // loop through each method in the resources
  _.each(methods, function(routeHash, httpMethod){

    // loop through the routes and add each route to the Bird prototype
    _.each(routeHash, function(routeOptions, route){

      // create methods for each route
      Bird.prototype[resource][route] = function(){
        if (routeOptions.validations) {
          isValid(route, routeOptions.validations);
        }
        var url = buildUrl(routeOptions.url, options);
        return request[httpMethod]({
          url: url,
          options: options
        });
      };
    });
  });
});

module.exports.Bird = Bird;
