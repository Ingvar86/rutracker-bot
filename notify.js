const exec = require('child_process').exec;

exports.send = function(message) {
    exec('notify-send -u "critical" "New on torrent" ' + '"' + message + '"');
};
