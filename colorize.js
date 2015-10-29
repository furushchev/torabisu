$(function(){
    //$('pre').html(ansi_up.ansi_to_html($('pre').val()));
    $('pre').html(("hogehoge" + ansi_up.ansi_to_html($('pre').text())));
});
