CDUI.menu.items.push(
    { 'name': 'login', title: 'Log In', icon: 'sign-in', condition: 'anonymous' },
    { 'name': 'join', title: 'Join', icon: 'check-square-o', condition: 'anonymous' },
    { 'name': 'user', title: '', icon: 'user', condition: 'authorized' },
    { 'name': 'users', title: 'Users', icon: 'users', condition: 'administrator' },
    { 'name': 'logout', title: 'Logout', icon: 'sign-out', condition: 'authorized' }
);

CDUI.menu.filters.push(function(items) {
    var user = CDUser.user();
    return items.filter(function(item) {
        if (user && (item.name === 'user')) {
            item.title = user.username;
        }
        switch (item.condition) {
            case 'any':
                return true;
            case 'authorized':
                return user;
            case 'administrator':
                return user && user.admin;
            case 'anonymous':
                return !user;
        }
    });
});