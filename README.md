# Bird [![Build Status](https://travis-ci.org/aackerman/bird.png?branch=master)](https://travis-ci.org/aackerman/bird)

### Simple wrapper around [request](https://github.com/mikeal/request) to consume the Twitter API

Bird methods match up to twitter resources.

```js
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

```js
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

```js
Bird.timelines.home({ oauth: oauth }, function(err, r, body){
  // the body will be an array of tweets
});
```

## Streams

Bird is just a wrapper around [request](https://github.com/mikeal/request). And [request](https://github.com/mikeal/request) offers a stream interface and the standard Node callback interface. So Bird does this just as well.

Imagine an express route that returns a users home timeline as json. You can simply pipe the call to the response.

```js
app.get('timeline', function(req, res){
  // assuming you have the users oauth credentials
  Bird.timelines.home({ oauth: oauth }).pipe(res)
});
```

## Routes

```
❯ node
> require('./index')
{ auth:
   { requestToken: ...,
     accessToken: ... },
  timelines:
   { home: ...,
     mentions: ...,
     user: ...,
     retweetsOfMe: ... },
  tweets:
   { retweets: ...,
     show: ...,
     oembed: ...,
     retweeters: ...,
     update: ...,
     tweet: ...,
     destroy: ...,
     retweet: ...,
     updateWithMedia: ... },
  search: { tweets: ... },
  messages:
   { index: ...,
     sent: ...,
     show: ...,
     destroy: ...,
     new: ... },
  friends: { index: ..., list: ... },
  friendships:
   { noRetweets: ...,
     show: ...,
     lookup: ...,
     incoming: ...,
     outgoing: ...,
     create: ...,
     destroy: ...,
     update: ... },
  followers: { index: ..., list: ... },
  account:
   { settings: ...,
     verify: ...,
     banner: ...,
     updateSettings: ...,
     updateDeliveryDevice: ...,
     updateProfile: ...,
     updateProfileBackgroundImage: ...,
     updateProfileColors: ...,
     updateProfileImage: ...,
     removeProfileBanner: ...,
     updateProfileBanner: ... },
  blocks:
   { list: ...,
     index: ...,
     create: ...,
     destroy: ... },
  users:
   { lookup: ...,
     show: ...,
     search: ...,
     contributees: ...,
     contributors: ...,
     suggestionsWithSlug: ...,
     suggestionsWithSlugMembers: ... },
  favorites:
   { list: ...,
     create: ...,
     destroy: ... },
  lists:
   { list: ...,
     statuses: ...,
     memberships: ...,
     subscribers: ...,
     showSubscribers: ...,
     removeMember: ...,
     createMember: ...,
     removeSubscriber: ...,
     createSubscriber: ... },
  geo:
   { place: ...,
     geocode: ...,
     search: ...,
     similarPlaces: ...,
     createPlace: ... },
  trends:
   { place: ...,
     available: ...,
     closest: ... },
  spam: { report: ... },
  help:
   { configuration: ...,
     languages: ...,
     privacy: ...,
     tos: ... },
  application: { rateLimits: ... } }
```

## Author

| [![twitter/_aaronackerman_](http://gravatar.com/avatar/c73ff9c7e654647b2b339d9e08b52143?s=70)](http://twitter.com/_aaronackerman_ "Follow @_aaronackerman_ on Twitter") |
|---|
| [Aaron Ackerman](https://twitter.com/_aaronackerman_) |
