Template.directory.helpers({

   units: function() {

       var units = [];
       // first gather all units and users in each
       CDUser.users.find({}).forEach(function(user) {
           var unit = user.unit;
           if (unit in units) {
               units[unit].users.push(user);
           } else {
               units[unit] = { unit: unit, users: [ user ] };
           }
       });

       var unitsSearch = Session.get("units-search").toLowerCase();
       // filter on unit, names, and phone
       units = units.filter(function(unit) {

           if (!unitsSearch || (unitsSearch === '')) {
               return true;
           }

           // search unit number
           if (unit.unit.indexOf(unitsSearch) !== -1) {
               return true;
           }

           // look for some user that matches in the unit
           return unit.users.some(function(user) {
               if (user.firstName.toLowerCase().indexOf(unitsSearch) !== -1) {
                   return true;
               } else if (user.lastName.toLowerCase().indexOf(unitsSearch) !== -1) {
                   return true;
               } else if (user.phone.toLowerCase().indexOf(unitsSearch) !== -1) {
                   return true;
               } else {
                   return false;
               }
           });

       });

       return units;
   }

});

Template.directory.events({

    'keyup input[name=search-units]': function(event) {
        Session.set('units-search', event.currentTarget.value);
    }

});

Template.directory.onCreated(function() {
    Session.set('units-search', '');
});