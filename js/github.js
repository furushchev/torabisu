$(function(){
  chrome.runtime.sendMessage({
    requestBadge: true
  }, function(res) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = "arraybuffer";
      xhr.open("GET", res.badge_url, true);
      xhr.onload = function(){
	  var data = new Uint8Array(this.response);
	  var oURL = URL.createObjectURL(new Blob([data], {type: "image/svg+xml" }));
	  var image = new Image();
	  image.onload = function() {
	      URL.revokeObjectURL(oURL);
	  };
	  image.src = oURL;
	  $('a[data-pjax=#js-repo-pjax-container]').after('<span style="vertical-align: middle; margin-left: 8px"><a href="' + res.travis_url + '"><img width="98" height="20" src="' + res.badge_url + '" /></a></span>');
      };
  });
}); // $.function
