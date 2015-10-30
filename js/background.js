chrome.runtime.onMessage.addListener(function(req, sender, res) {
  if (!"requestBadge" in req) return;
  var url = sender.url;
  var matched = url.match(/https:\/\/github.com\/([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)/);
  if (matched != null){
    var author = matched[1];
    var repo = matched[2];

    var travis_url = "https://travis-ci.org/" + author + "/" + repo;
    var badge_url = travis_url + ".svg";

    var branchp = url.match(/https:\/\/github.com\/([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)\/tree\/([a-zA-Z0-9-_.]+)$/);
    if (branchp != null) {
      var branch = branchp[3];
      badge_url += "?branch=" + branch;
    }

    res({
      "badge_url": badge_url,
      "travis_url": travis_url
    });
  }
}); // runtime.onMessage
