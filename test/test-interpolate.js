var Bird   = require('../index').Bird;
var expect = require('chai').expect;

describe("UrlBuilder", function(){

  it("adds .json to the end of each url", function(){
    var b = Bird();
    var url = b._interpolate_url({
      url: "statuses/mentions_timeline"
    });
    expect(url).to.eq("https://api.twitter.com/1.1/statuses/mentions_timeline.json");
  });

  it("interpolates external values passed", function(){
    var b = Bird();
    var url = b._interpolate_url({
      url: "statuses/retweets/:id",
      interpolate: "id"
    }, {
      id: 5
    });

    expect(url).to.eq("https://api.twitter.com/1.1/statuses/retweets/5.json");
  });

  it("interpolates external values passed", function(){
    var b = Bird();
    var url = b._interpolate_url({
      url: "statuses/retweets/:slug",
      interpolate: "slug"
    }, {
      slug: 'hello-world'
    });

    expect(url).to.eq("https://api.twitter.com/1.1/statuses/retweets/hello-world.json");
  });

});
