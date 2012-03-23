##Bird.js

###Dead simple wrapper for the Twitter API

Like there needed to be another one, right? Well sometimes you just have to write it yourself.

<code>
var express = require('express');
var Bird = require('bird')({
  oauth_token : 'my-twitter-consumer-token',
  oauth_token_secret : 'my-twitter-consumer-token-secret',
  callback: 'http://mytwitterapp.com/callback'
});

var app = express.createServer();

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: "just-the-letter-a"}));

app.get('/', function(req, res){
  if (req.session.signedIn) {
    res.send("Hi " + req.session.screen_name + " it's nice to see you signed in");
  } else {
    res.send('<a href="/login">login</a>');
  }
});

app.get('/login', function(req, res){
    Bird.login(req, function(err, oauth_token, oauth_token_secret, results){
      if (err) {
        //handle the error here if twitter returns an error
        res.send(err);
      } else {
        //set 
        req.session.oauth_token = oauth_token;
        req.session.oauth_token_secret = oauth_token_secret;
        res.redirect("https://twitter.com/oauth/authorize?oauth_token="+req.session.oauth_token);
      }
    });
});

app.get('/callback', function(req, res){
    Bird.auth_callback(req, function(err, access_token, access_token_secret, data){
      if (err) {
      	//handle the error here if twitter returns an error
        res.send(err);
      } else {
        req.session.screen_name = data.screen_name;
        req.session.access_token = access_token;
        req.session.access_token_secret = access_token_secret;
        req.session.signedIn = 1;
        
        res.redirect('/');
      }
    });
});

app.get('/home_timeline', function(req, res){
    var options = req.query || {};
    options.include_entities = true;
    Bird.home_timeline(req, options, function(err, data, response){
      if (err) {
        //handle the error here if twitter returns an error
        res.send(err);
      } else {
        res.send(data);  
      }
    });
});
</code>

