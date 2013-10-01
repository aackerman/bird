var request    = require('request');
var qs         = require('querystring');
var _          = require('lodash');
var routes     = require('./routes.json');
var isValid    = require('./validates').isValid;
var urlBuilder = require('./url-builder');

var Bird = function() {
  this.hostname         = 'api.twitter.com';
  this.requestTokenPath = [this.hostname, 'oauth', 'request_token'].join('/');
  this.accessTokenPath  = [this.hostname, 'oauth', 'access_token'].join('/');
  this.apiVersion       = '1.1';
};

Bird.prototype.login = function(oauth) {
  return request.post({
    url: this.requestTokenPath,
    oauth: oauth
  });
};

Bird.prototype.auth = function(oauth) {
  return request.post({
    url: this.accessTokenPath,
    oauth: oauth
  });
};

// loop through each of the resources
_.each(routes, function(methods, resource){
  // ensure a namespace for each resource exists
  Bird.prototype[resource] = Bird.prototype[resource] || {};

  // loop through each method in the resources
  _.each(methods, function(routeHash, httpMethod){

    // loop through the routes and add each route to the Bird prototype
    _.each(routeHash, function(routeOptions, route){

      // create methods for each route
      Bird.prototype[resource][route] = function(options){
        // validate route
        if (routeOptions.validations) {
          isValid(route, routeOptions.validations);
        }
        // construct the url
        var url = urlBuilder.build(routeOptions.url, options);

        return request[httpMethod]({
          url:   url,
          qs:    options.qs,
          oauth: options.oauth
        });
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
