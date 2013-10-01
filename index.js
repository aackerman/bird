var request = require('request');
var qs      = require('querystring');
var _       = require('lodash');
var routes  = require('./routes.json');

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

_.each(routes, function(methods, resource){
  _.each(methods, function(routeHash, httpMethod){
    _.each(routeHash, function(url, route){
      Bird.prototype[resource] = Bird.prototype[resource] || {};
      Bird.prototype[resource][route] = function(options){
        return request[httpMethod]({
          url: url,
          options: options
        });
      };
    });
  });
});

module.exports.Bird = Bird;
