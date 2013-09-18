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

module.exports.Bird = Bird;
