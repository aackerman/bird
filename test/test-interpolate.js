var Bird   = require('../index').Bird;
var expect = require('chai').expect;

describe("_interpolate", function(){

  it("adds .json to the end of each url", function(){
    var b = Bird();
    var url = b._interpolate({
      url: "statuses/mentions_timeline"
    });
    expect(url).to.eq("https://api.twitter.com/1.1/statuses/mentions_timeline.json");
  });

  it("handles external values passed", function(){
    var b = Bird();
    var url = b._interpolate({
      url: "statuses/retweets/:id",
      interpolate: "id"
    }, {
      id: 5
    });

    expect(url).to.eq("https://api.twitter.com/1.1/statuses/retweets/5.json");
  });

  it("throws on missing values", function(){
    var b = Bird();
    var fn = function(){
      b._interpolate({
        url: "statuses/retweets/:id",
        interpolate: "id"
      }, {});
    };
    expect(fn).to.throw(Error);
  });

});
