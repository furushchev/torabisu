$(function(){
  loadSettings(function(items){
    // redirect
    if(items.redirect_to_raw_log){
      $('li').click(function(e){
        console.log("element", e);
        console.log("children", $(e).children());
        var href = $(e).attr('href');
        if (!href) return;
        var job_no = href.match(/^(.+)jobs\/([0-9]+)$/);
        if(!job_no) return;
        console.log("job_no", job_no);
        var new_href = 'https://s3.amazonaws.com/archive.travis-ci.org/jobs/' + job_no[2] + '/log.txt';
        location.href = new_href;
      });
      $('a:has(div.job-anchor)').click(function(e){
        e.preventDefault();
        console.log("redirect to", $(e).attr('href'));
        location.href = $(e).attr('href');
      });
    }
  });
});
