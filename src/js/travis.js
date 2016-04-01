$(function(){
  loadSettings(function(items){
    // redirect
    if(items.redirect_to_raw_log){
      console.log(location.href);
      if(location.href.match(/(.+)\/jobs\/([0-9]+)$/)){
        chrome.runtime.sendMessage({
          requestRedirect: true
        }, function(res){
          console.log("res", res);
        });
      }
    }

    // colorize
    if(items.colorize){
      $('pre').html(ansi_up.ansi_to_html($('pre').text()));
    }
  });

  // summerize
  var queries = ["RESULT: FAIL"];
  queries.forEach(function(q) {
    var matched = $('pre').text().match(new RegExp(q));
    console.log(matched);
  });
});
