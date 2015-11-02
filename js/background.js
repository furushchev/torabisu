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


var getTokens = function(cb){
  var defaults  = {
    "slack_username": null,
    "slack_token": null
  };
  chrome.storage.sync.get(defaults, cb);
};

var requestRestartTravis = function(repo, job_no, cb){
  getTokens(function(items){
    var url = 'https://slack.com/api/chat.postMessage';
    $.ajax({
      type: 'GET',
      url: url,
      data: {
        token: items.slack_token,
        channel: '#travis',
        as_user: true,
        link_names: true,
//        username: items.slack_username,
        text: 'restart travis ' + repo + ' ' + job_no
      }
    }).done(cb);
  });
};

var fetchBuildInfo = function(repo, build_no, cb){
  getTokens(function(items){
    var url = 'https://api.travis-ci.org/repos/' + repo + '/builds/' + build_no;
    $.ajax({
      type: 'GET',
      url: url,
      headers: {
        'Accept': 'application/vnd.travis-ci.2+json'
      },
      dataType: 'json'
/*      ,data: {
        'token': items.travis_token
      } */
    }).done(cb);
  });
};

var contextMenuCallback = function(info, tab){
  var link_matched = info.linkUrl.match(/^https:\/\/travis-ci\.org\/([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)\/jobs\/([0-9]+)$/);
  var build_no = info.pageUrl.match(/^https:\/\/travis-ci\.org\/([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)\/builds\/([0-9]+)$/)[3];
  var repo = link_matched[1] + '/' + link_matched[2];
  var job_no = link_matched[3];
  fetchBuildInfo(repo, build_no, function(build_info){
    var b = build_info.jobs.find(function(j){
      return j.id == job_no;
    });
    requestRestartTravis(repo, b.number, function(res){
      console.log(res);
      if(!res.ok){
        alert(res.error);
      }
    });
  });
};

chrome.contextMenus.create({
  "type": "normal",
  "title": "Restart Travis",
  "contexts": ["link"],
  "onclick": contextMenuCallback,
  "documentUrlPatterns": ["https://travis-ci.org/*/*/builds/*"
//                         ,"https://magnum.travis-ci.com/*/*/builds/*"
                         ]
}); // contextMenus.create
