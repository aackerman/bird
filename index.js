var request   = require('request');
var qs        = require('querystring');
var _         = require('lodash');
var routefile = require('./routes.json');

var Bird = function(oauth) {
  if ( !(this instanceof Bird) ) {
    return new Bird(oauth);
  }
  this.scheme           = 'https://';
  this.hostname         = 'api.twitter.com';
  this.requestTokenPath = [this.hostname, 'oauth', 'request_token'].join('/');
  this.accessTokenPath  = [this.hostname, 'oauth', 'access_token'].join('/');
  this.apiVersion       = '1.1';
  this.oauth            = oauth || {};
};

Bird.prototype.login = function(oauth) {
  this._validateOAuth();
  return request.post({
    url: this.requestTokenPath,
    oauth: oauth
  });
};

Bird.prototype.auth = function(oauth) {
  this._validateOAuth();
  return request.post({
    url: this.accessTokenPath,
    oauth: oauth
  });
};

Bird.prototype._validateOAuth = function(options){
  if ( !this.ouath && !options.oauth ) {
    throw new Error('You must pass oauth parameters');
  }
};

Bird.prototype._interpolate = function(opts, options) {
  var url = opts.url, val;
  if (opts && opts.interpolate) {
    val = options[opts.interpolate];
    if (val) {
      url = url.replace(":" + opts.interpolate, options[opts.interpolate]);
    } else {
      throw new Error('Missing interpolation value ' + opts.interpolate + ' in options');
    }
  }
  return this.scheme + this.hostname + '/' + this.apiVersion + '/' + url + '.json';
};

// loop through each of the resources
_.each(routefile, function(methods, resource){
  // ensure a namespace for each resource exists
  Bird.prototype[resource] = Bird.prototype[resource] || {};

  // loop through each method in the resources
  _.each(methods, function(routes, method){

    // loop through the routes and add each route to the Bird prototype
    _.each(routes, function(routeopts, route){

      // create methods for each route
      Bird.prototype[resource][route] = function(useropts, callback){
        useropts = useropts || {};
        this._validateOAuth(useropts);
        return request[method]({
          url:   this._interpolate(routeopts, useropts),
          qs:    useropts.qs,
          oauth: this.oauth || useropts.oauth
        }, callback);
      };
    });
  });
});

// // create a new Bird instance
// var bird = new Bird();

// // tweet
// bird.tweets.tweet({
//   // required parameters should be in the top level of the object
//   status: 'hello world!',
//   oauth: { oauthy: 'stuff' },
//   // optional parameters should be qs sub-object
//   qs: {

//   }
// });

// // retrieve a timeline
// bird.timelines.home();

module.exports.Bird = Bird;
