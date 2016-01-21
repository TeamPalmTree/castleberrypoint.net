CDUI.homePath = function() {
    if (CDUser.preparing()) {
        return 'community';
    } else {
        return 'retail';
    }
};