var storage_defaults  = {
  "slack_token": null,
  "show_badge": true,
  "colorize": true,
  "redirect_to_raw_log": true
};

var loadSettings = function(cb){
  chrome.storage.sync.get(storage_defaults, cb);
};

var saveSettings = function(item, cb){
  chrome.storage.sync.set(item, cb);
};
