CDUI.homePath = function() {};

var minute = 60000;
var hour = 3600000;
var day = 86400000;
var week = 604800000;

Template.registerHelper('formatDate', function(date) {
    var ago = Date.now() - date;
    if (ago > week) {
        return moment(date).format('MMM-M');
    } else if (ago > day) {
        return Math.floor(ago / day) + 'd ago';
    } else if (ago > hour) {
        return Math.floor(ago / hour) + 'h ago';
    } else if (ago > minute) {
        return Math.floor(ago / minute) + 'm ago';
    } else {
        return 'just now';
    }
});