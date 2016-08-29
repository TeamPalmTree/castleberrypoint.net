CDUI.menu.items.push(
    { routeName: 'login', title: 'Log In', icon: 'sign-in', condition: 'anonymous' },
    { routeName: 'join', title: 'Join', icon: 'check-square-o', condition: 'anonymous' },
    { routeName: 'user', title: '', icon: 'user', condition: 'authorized' },
    { routeName: 'users', title: 'Users', icon: 'users', condition: 'administrator' },
    { routeName: 'logout', title: 'Logout', icon: 'sign-out', condition: 'authorized' }
);

CDUI.menu.filters.push(function(items) {
    var user = CDUser.user();
    return items.filter(function(item) {
        if (user && (item.routeName === 'user')) {
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