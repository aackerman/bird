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

Bird.prototype.messages = {
  base: 'direct_messages.json',
  sent: 'direct_messages/sent.json',
  show: 'direct_messages/show.json'
};

Bird.prototype.account = {
  rateLimitStatus: 'account/rate_limit_status.json',
  verifyCredentials: 'account/verify_credentials.json',
  totals: 'account/totals.json',
  settings: 'account/settings.json'
};

module.exports.Bird = Bird;
