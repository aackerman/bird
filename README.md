## Bird :bird:

### Simple wrapper around [request](https://github.com/mikeal/request) to consume the Twitter API

Bird methods match up to twitter resources.

```
Bird.auth.requestToken({
  oauth: {
    consumer_key: 'XXXXXXXXXXXXXXXXXXXXX',
    consumer_secret: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXX'
  }
}, function(err, response, body){
  var token = qs.parse(body);
  // save the users token for later use
  // redirect user to https://api.twitter.com/oauth/authorize?oauth_token= + token.oauth_token
});
```

If the users authorizes your application, Twitter will make a `GET` request to your Twitter application callback URL. The request query string will contain an `oauth_verifier`. Then you can request a permanent access token to handle requests to the Twitter API on behalf of the user.

```
Bird.auth.accessToken({
  oauth: {
    consumer_key: 'XXXXXXXXXXXXXXXXXXXXX',
    consumer_secret: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    token: 'XXXXXXXXXXXXX' // the users OAuth token from `requestToken`
    verifier: 'XXXXXXXXXXXXX' // the verifier sent to your Twitter application callback route
  }
}, function(err, response, body){
  var token = qs.parse(body)
  // save the users `token.oauth_token` and `token.oauth_token_secret` here
})
```

If you have the oauth token and token secret for a user you are ready to handle requests to Twitter on their behalf.
