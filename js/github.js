$(function(){
  /*
    show travis badge on github page
  */
  loadSettings(function(items){
    if(items.show_badge){
      chrome.runtime.sendMessage(
        { requestBadge: true },
        function(res) {
          var img = new Image();
          img.onload = function(){
            $('div.repohead-details-container h1.entry-title').append(img);
          };
          img.src = res.badge_url;
          img.height = 16;
          $(img).css('margin-top', '4px');
        });
    }
  });

  /*
    paste to github issue
  */
  chrome.runtime.sendMessage(
    { requestQuote: true },
    function(res){
      if(res && res.hasOwnProperty("quote")) {
        $('#new_comment_field').text("\n```\n" + res.quote + "\n```\n");
        $('html,body').animate({
          scrollTop: $("#new_comment_field").offset().top
        });
      }
    });
}); // $.function
