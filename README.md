## Bird.js

### Simple wrapper around request to consume the Twitter API

Like there needed to be another one, right? Well sometimes you just have to write it yourself.

The core API is pretty simple to understand.

All functions (options, callback) signature. All parameters on the options object aside from the oauth parameter will be parsed into the route's url. Bird.login and Bird.auth_callback, only allow for a callback interface all other routes allow the option to use a streaming interface in addition to the standard callback interface.


```javascript
var express = require('express');
var qs = require('querystring');

var Bird = require('bird');
var oauth = {
  consumer_key : 'XXXXXXXXXXXXXXXXXX',
  consumer_secret : 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  callback: 'http://localhost:7700/callback'
};

var app = express.createServer();

//setup express middleware
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: "a"}));

app.get('/', function(req, res){
  res.send('<a href="/login">Login</a><br><a href="/home_timeline.json">Home Timeline</a>');
});

app.get('/login', function(req, res) {
  console.log(req.route.path);
  req.session.oauth = oauth;
  Bird.login(req.session.oauth, function(err,r,body){
    if (err) {
      //add error handling here for when twitter returns an error
      res.send("Error getting OAuth request token");
    } else {
      //parse tokens received from twitter
      var tokens = qs.parse(body);
      //set temporary oauth tokens for the users session
      req.session.oauth.token = tokens.oauth_token;
      req.session.oauth.token_secret = tokens.oauth_token_secret;

      //redirect user to authorize with temporary token
      res.redirect("https://twitter.com/oauth/authorize?oauth_token=" + tokens.oauth_token);
    }
  });
});

app.get('/logout', function(req, res){
  req.session.destroy();
  res.redirect('/');
});

app.get('/callback', function(req, res){
  console.log(req.route.path);
  //set oauth verifier for the users session
  req.session.oauth.verifier = req.query.oauth_verifier;
  Bird.auth_callback(req.session.oauth, function(err, r, body){
    if (err) {
      //add error handling here for when twitter returns an error
      res.send(err);
    } else {
      //parse tokens received from twitter
      var tokens = qs.parse(body);
      //set permanent access tokens for the users session
      req.session.oauth.token = tokens.oauth_token;
      req.session.oauth.token_secret = tokens.oauth_token_secret;

      //redirect the user
      res.redirect('/');
    }
  });
});

//route using a stream
app.get('/home_timeline.json', function(req, res){
  var options = req.query;
  options.oauth = req.session.oauth;

  //Bird.home_timeline will return a stream that can be piped to a response
  Bird.home_timeline(options).pipe(res);
});

var port = 7700;

app.listen(port);

console.log('server listening on port ' + port);
```
