var expect = require('chai').expect;
var UrlBuilder = require("../url-builder");

describe("UrlBuilder", function(){

  it("adds .json to the end of each url", function(){
    var url = UrlBuilder.build({
      url: "statuses/home_timeline"
    });
    expect(url).to.eq("statuses/home_timeline.json");
  });

  it("interpolates external values passed", function(){
    var url = UrlBuilder.build({
      url: "statuses/retweets/:id",
      interpolate: "id"
    }, {
      id: 5
    });

    expect(url).to.eq("statuses/retweets/5.json");
  });

  it("interpolates external values passed", function(){
    var url = UrlBuilder.build({
      url: "statuses/retweets/:slug",
      interpolate: "slug"
    }, {
      slug: 'hello-world'
    });

    expect(url).to.eq("statuses/retweets/hello-world.json");
  });

});
