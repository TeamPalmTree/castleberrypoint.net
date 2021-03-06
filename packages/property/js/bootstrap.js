CDUI.menu.items.push(
    { routeName: 'directory', title: 'Directory', icon: 'list-alt', condition: 'authorized' },
    { routeName: 'retail', title: 'Retail', icon: 'building-o', condition: 'any' }
);

var userJoinFields = [
    { name: 'unit', icon: 'home', placeholder: 'Unit Number', required: true, order: 100 },
    { name: 'firstName', icon: 'user', placeholder: 'First Name', required: true, order: 101 },
    { name: 'lastName', icon: 'user', placeholder: 'Last Name', required: true, order: 102 },
    { name: 'phone', icon: 'phone', placeholder: 'Phone Number', required: true, order: 103 }
];

CDUser.forms.join.fields = CDUser.forms.join.fields.concat(userJoinFields);
CDUser.forms.modify.fields = CDUser.forms.modify.fields.concat(userJoinFields);
