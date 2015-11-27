$(function(){
  var showSaveStatus = function(status){
    $('#save-result').text(status);
    setTimeout(function(){
      $('#save-result').text('');
    }, 3000);
  };

  $('#save-button').click(function(e){
    e.preventDefault();
    loadSettings(function(item){
      if (!$('#slack-token').val()) {
        showSaveStatus('Slack Token is empty!');
        return;
      }
      item.slack_token = $('#slack-token').val();
      item.show_badge = $('#show-badge-switch').prop('checked');
      item.colorize = $('#colorize-switch').prop('checked');
      item.redirect_to_raw_log = $('#redirect-switch').prop('checked');
      saveSettings(item, function(){
        showSaveStatus('Saved!');
      });
    });
  });

  loadSettings(function(items){
    $('#slack-token').val(items.slack_token);
    $('#show-badge-switch').prop('checked', items.show_badge);
    $('#colorize-switch').prop('checked', items.colorize);
    $('#redirect-switch').prop('checked', items.redirect_to_raw_log);
  });
  $('#slack-token').focus();
}); // $
