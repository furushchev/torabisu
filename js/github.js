$(function(){
  chrome.runtime.sendMessage({
    requestBadge: true
  }, function(res) {
    console.log(res);
    $('a[data-pjax=#js-repo-pjax-container]').after('<span style="vertical-align: middle; margin-left: 8px"><a href="' + res.travis_url + '"><img width="98" height="20" src="' + res.badge_url + '" /></a></span>');
  });
}); // $.function
