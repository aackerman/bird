# Bird [![Build Status](https://travis-ci.org/aackerman/bird.png?branch=master)](https://travis-ci.org/aackerman/bird)

### A wrapper around [request](https://github.com/mikeal/request) to consume the Twitter API

### Examples

A repo with examples can be viewed [here](https://github.com/aackerman/bird-example-app).

### Streams

Bird is a wrapper around [request](https://github.com/mikeal/request). And [request](https://github.com/mikeal/request) offers a stream interface and the standard Node callback interface. Bird does this just as well.

Imagine an express route that returns a users home timeline as json. You can pipe the call directly to the response.

```js
// assuming you have the users oauth credentials
Bird.timelines.home({ oauth: oauth }).pipe(res)
```

### Media

Uploading media [is a 2-part process](https://dev.twitter.com/rest/public/uploading-media-multiple-photos).

```js
var path = require('path');

var options = {
  oauth:  {
    consumer_key: 'XXXXXXXXXXXXXXXXXX',
    consumer_secret: 'XXXXXXXXXXXXXXX',
    token: 'XXXXXXXXXXXXXXXXXX',
    token_secret: 'XXXXXXXXXXXXXXXXX'
  },
  media: path.resolve('path/to/filename')
}

Bird.media.upload(options, function(err, r, body) {
  if (err) throw err;

  var options = {
    oauth:  {
      consumer_key: 'XXXXXXXXXXXXXXXXXX',
      consumer_secret: 'XXXXXXXXXXXXXXX',
      token: 'XXXXXXXXXXXXXXXXXX',
      token_secret: 'XXXXXXXXXXXXXXXXX'
    },
    status: 'hello world',
    media_ids: JSON.parse(body).media_id_string
  }
  Bird.tweets.tweet(options, function(err, r, body){
    if (err) throw err;
    console.log('successfully tweeted media');
  });
});
```

## Promises

Promises are not available directly with `bird`, but it's easy to wrap node-style error first methods with [`Q.denodeify`](https://www.npmjs.com/package/q). Here is an example.

```
var Bird  = require('bird');
var Q     = require('q');
var tweet = Q.denodeify(Bird.tweets.tweet);

tweet({
  oauth: oauth,
  status: 'Tweeting with promises!'
}).then(function(result){
  var resp = result[0], body = result[1];
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
     suggestionsWithSlugMembers: ...,
     reportSpam: ... },
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
  application: { rateLimits: ... },
  media: { upload: ... } }
```

## Author

| [![twitter/_aaronackerman_](http://gravatar.com/avatar/c73ff9c7e654647b2b339d9e08b52143?s=70)](http://twitter.com/_aaronackerman_ "Follow @_aaronackerman_ on Twitter") |
|---|
| [Aaron Ackerman](https://twitter.com/_aaronackerman_) |
