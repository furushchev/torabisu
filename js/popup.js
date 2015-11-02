$(function(){
  var defaults  = {
    "slack_username": null,
    "slack_token": null,
    "travis_token": null
  };

  chrome.storage.sync.get(defaults,
                          function(items){
                            $('#slack-username').val(items.slack_username);
                            $('#slack-token').val(items.slack_token);
                            $('#travis-token').val(items.travis_token);
                          });

  $('#save-button').click(function(e){
    e.preventDefault();
    // if (!$('#slack-username').val()) {
    //   $('#save-result').text('Username is empty!');
    // } else
    if (!$('#slack-token').val()) {
      $('#save-result').text('Slack Token is empty!');
    // } else if (!$('#travis-token').val()) {
    //   $('#travis-token').text('Travis Token is empty!');
    } else {
      defaults.slack_username = $('#slack-username').val();
      defaults.slack_token = $('#slack-token').val();
      defaults.travis_token = $('#travis-token').val();
      chrome.storage.sync.set(defaults,
                              function(){
                                $('#save-result').text('Saved!');
                              });
    }
    setTimeout(function(){
      $('#save-result').val('');
    }, 3000);
  });
}); // $
