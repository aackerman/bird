'use strict';
import request from 'request';
import fs from 'fs';
var routespec = require('./routes.json');

var PROTOCOL           = 'https://';
var HOSTNAME           = 'api.twitter.com';
var MEDIA_HOSTNAME     = 'upload.twitter.com';
var API_VERSION        = '1.1';
var REQUEST_TOKEN_PATH = PROTOCOL + [HOSTNAME, 'oauth', 'request_token'].join('/');
var ACCESS_TOKEN_PATH  = PROTOCOL + [HOSTNAME, 'oauth', 'access_token'].join('/');
var MISSING_OAUTH_ERR  = 'Missing `oauth` parameter';

var createRequestUrl = (r, options) => {
  var url = r.url, missing = [], needs, replacements;
  if (r && r.needsAll || r.needsOne) {
    needs = r.needsAll || r.needsOne;
    // replacements is a map of keys and values to
    // interpolate into the URL
    replacements = needs.reduce((memo, key) => {
      if (options[key] !== undefined) {
        memo[key] = options[key];
      } else {
        missing.push(key);
      }
      return memo;
    }, {});

    var replacementKeys = Object.keys(replacements);
    if ( replacementKeys.length > 0 ) {
      // interpolate values directly into the URL
      replacementKeys.forEach((k) => {
        url = url.replace(':' + k, options[k]);
      });
    } else {
      throw new Error('Missing ' + missing.join(', ') + ' value in options');
    }
  }
  var hostname = r.url === 'media/upload' ? MEDIA_HOSTNAME : HOSTNAME;
  return PROTOCOL + hostname + '/' + API_VERSION + '/' + url + '.json';
}

var Bird = {
  auth: {
    requestToken(opts, callback) {
      if ( opts.oauth === undefined ) {
        throw new Error(MISSING_OAUTH_ERR);
      }
      return request.post({
        url: REQUEST_TOKEN_PATH,
        oauth: opts.oauth,
        json: true
      }, callback);
    },
    accessToken(opts, callback) {
      if ( opts.oauth === undefined ) {
        throw new Error(MISSING_OAUTH_ERR);
      }
      return request.post({
        url: ACCESS_TOKEN_PATH,
        oauth: opts.oauth,
        json: true
      }, callback);
    }
  }
};

/**
  Route Spec
  {
    "namespace1": {
      "get": {
        "method1": {
          "url": "url_to_append_to_base",
          "needsOne": ["necessaryParam1", "necessaryParam1"]
        },
        "method2": {
          "url": "url_to_append_to_base",
          "needsAll": ["necessaryParam1", "necessaryParam1"]
        }
      }
    },
    "namespace2": {
      ...
    }
  }
*/
Object.keys(routespec).forEach((namespace) => {
  var verbs = routespec[namespace];

  // ensure a namespace exists
  Bird[namespace] = Bird[namespace] || {};

  // loop through each http verb in the namespaces
  Object.keys(verbs).forEach((verb) => {
    var routes = verbs[verb];

    // loop through the routes and add each route to the Bird namespace
    Object.keys(routes).forEach((route) => {
      var routeopts = routes[route];

      // create methods for each route
      Bird[namespace][route] = (useropts, callback) => {
        useropts = useropts || {};
        if ( useropts.oauth === undefined ) {
          throw new Error(MISSING_OAUTH_ERR);
        }

        var oauth = useropts.oauth;
        delete useropts.oauth;
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
