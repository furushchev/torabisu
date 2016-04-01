$(function(){
  loadSettings(function(items){
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
