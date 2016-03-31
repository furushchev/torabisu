/*
  show travis badge on github page
*/
loadSettings(function(items){
  if (items.show_badge){
    chrome.runtime.onMessage.addListener(function(req, sender, res) {
      if (!req.hasOwnProperty("requestBadge")) return;
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
  }
});

/*
  travis restart from context menu
*/
var requestRestartTravis = function(repo, job_no, cb){
  loadSettings(function(items){
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
  loadSettings(function(items){
    var url = 'https://api.travis-ci.org/repos/' + repo + '/builds/' + build_no;
    $.ajax({
      type: 'GET',
      url: url,
      headers: {
        'Accept': 'application/vnd.travis-ci.2+json'
      },
      dataType: 'json'
//      ,data: {'token': items.travis_token }
    }).done(cb);
  });
};

var restartTravisContextMenuCallback = function(info, tab){
  if (info.menuItemId !== "restart_travis") return;
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
        alert(res.error + '\nPlease click "torabisu" icon on the top right corner of the browser, then check your Slack token is correctly set.');
      }
    });
  });
};

chrome.contextMenus.create({
  "id": "restart_travis",
  "title": "Restart Travis",
  "contexts": ["link"],
  "documentUrlPatterns": ["https://travis-ci.org/*/*/builds/*"
//                         ,"https://magnum.travis-ci.com/*/*/builds/*"
                         ]
}); // contextMenus.create
chrome.contextMenus.onClicked.addListener(restartTravisContextMenuCallback);

/*
  paste to github issue
*/
var fetchJobInfo = function(job_no, cb){
  $.ajax({
    type: 'GET',
    url: 'https://api.travis-ci.org/jobs/' + job_no,
    headers: {
      'Accept': 'application/vnd.travis-ci.2+json'
    },
    dataType: 'json'
  }).done(cb);
};

var commentGithubContextMenuCallback = function(info){
  if(info.menuItemId !== "comment_on_github") return;
  var link_matched = info.pageUrl.match(/^(.+)\/jobs\/([0-9]+)\/log.txt$/);
  chrome.tabs.executeScript(
    null,
    { code: "window.getSelection().toString()" },
    function(selection){
      var selected_text = selection[0];
      console.log("selected_text", selection);
      if (link_matched && link_matched.length == 3) {
        var job_no = link_matched[2];
        fetchJobInfo(job_no, function(res) {
          chrome.tabs.create({
            url: res.commit.compare_url,
            active: true
          }, function(tab){
            chrome.runtime.onMessage.addListener(function onmessagefunc(msg, sender, resfunc){
              if (res.commit.compare_url === sender.url && msg.hasOwnProperty("requestQuote")){
                chrome.runtime.onMessage.removeListener(onmessagefunc);
                resfunc({ quote: selected_text });
              }
            });
          });
        });
      }
    });
};

chrome.contextMenus.create({
  "id": "comment_on_github",
  "title": "Quote Selected Codes to Github",
  "contexts": ["selection"],
  "documentUrlPatterns": ["https://s3.amazonaws.com/archive.travis-ci.org/jobs/*/log.txt"]
}); // contextMenus.create
chrome.contextMenus.onClicked.addListener(commentGithubContextMenuCallback);
