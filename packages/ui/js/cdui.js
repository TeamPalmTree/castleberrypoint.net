CDUI = {};

CDUI.menu = {
    items: [],
    filters: []
};

CDUI.menu.filterItems = function() {
    var filteredItems = CDUI.menu.items;
    CDUI.menu.filters.forEach(function(filter) {
        filteredItems = filter(filteredItems);
    });
    return filteredItems;
};