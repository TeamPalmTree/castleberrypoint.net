var businesses = [
    { _id: 0, title: 'The Wine Shoe', url: 'http://www.wineshoeatlanta.com', address: '339 Nelson St SW, Atlanta, GA 30313', phone: '404-220-9042', description: 'Education-focused wine shop stocking global wines in a dog-friendly, rustic, cellar-inspired space.', logo: 'the-wine-shoe.jpg', jumbotron: 'the-wine-shoe.jpg' },
    { _id: 1, title: 'Atlanta Movie Tours', url: 'http://atlantamovietours.com', address: '327 Nelson St SW, Atlanta, GA 30313', phone: '855-255-3456', description: 'Gift shop & affiliated tour company focusing on films made in Atlanta, including zombie flicks.', logo: 'atlanta-movie-tours.jpg', jumbotron: 'atlanta-movie-tours.jpg' },
    { _id: 2, title: 'Sweet Tooth Desert Bar', url: 'http://www.stdessertbar.com', address: '335 Nelson St SW, Atlanta, GA 30313', phone: '470-728-4068', description: 'A colorful pastry shop & cafe by day, serving plated desserts at night with wine, coffee & tea.', logo: 'sweet-tooth-desert-bar.png', jumbotron: 'sweet-tooth-desert-bar.jpg' },
    { _id: 3, title: 'Castleberry Point Lofts', url: 'http://www.castleberrypoint.net', address: '333 Nelson St SW, Atlanta, GA 30313', phone: '404-688-9900', description: 'Modern loft- and flat-style condominiums near downtown Atlanta.',logo: 'castleberry-point-lofts.png', jumbotron: 'castleberry-point-lofts.jpg' },
    { _id: 4, title: 'Iwi Fresh Garden Day Spa', url: 'http://www.iwifresh.com', address: '341 Nelson St SW, Atlanta, GA 30313', phone: '404-577-8072', description: "We parhner with local farms and gardens hand pick fresh fruits, veggies, and herbs and make skincare recipes. We are a farm to skin spa. The Skincare Chef Yolanda Owens makes all the products from scratch 'handmade'. She uses orangic aroma fresh", logo: 'iwi-fresh-garden-day-spa.jpg', jumbotron: 'iwi-fresh-garden-day-spa.jpg' },
    { _id: 5, title: 'Libra Loft Hair Salon', url: 'http://www.libraloft.com', address: '315 Nelson St SW, Atlanta, GA 30313', phone: '404-474-7654', description: 'A contemporary and sophisticated salon focused on achieving healthy, natural hair. Owned and operated by experienced stylists and colorists who maintain a serene and professional environment. A spa for your hair.',logo: 'libra-loft-hair-salon.jpg', jumbotron: 'libra-loft-hair-salon.jpg' },
    { _id: 6, title: 'Super7 Pizza Shoppe', url: 'http://www.super7pizza.com', address: '110 Centennial Olympic Park Dr, Atlanta, GA 30313', phone: '404-464-5471', description: 'Nestled in the burgeoning Castleberry Hills community, centrally located under a mile from the Georgia Dome, Phillips Arena and World Congress Center, Super 7 has all your game day needs.', logo: 'super7-pizza-shoppe.png', jumbotron: 'super7-pizza-shoppe.jpg' },
    { _id: 7, title: 'The Smoke Ring', url: 'http://www.smokeringatlanta.com', address: '309 Nelson St SW, Atlanta, GA 30313', phone: '404-228-6377', description: 'Rustic-chic smokehouse offering contemporary barbecue, Southern sides & cocktails in a sleek space.', logo: 'the-smoke-ring.png', jumbotron: 'the-smoke-ring.jpg' },
    { _id: 8, title: 'ZuCot Gallery', url: 'http://zucotgallery.com', address: '100 Centennial Olympic Park Dr, Atlanta, GA 30313', phone: '404-380-1040', description: 'H&T Art Partners was formed with the collective assets and knowledge of Atlanta based ZuCot Gallery and Premier Art, Inc. Partners Troy Taylor, Onaje Henderson, and Omari Henderson came together with years of existing experience in the arts to form a full service art business focused on promoting original pieces by living African American Artists. The company’s art gallery, (ZuCot Gallery) located in downtown Atlanta, is a modern facility that is designed to house some of the most prolific artists of our generation.', logo: 'zucot-gallery.jpg', jumbotron: 'zucot-gallery.jpeg' }
];

var featuredBusinessIndex = new ReactiveVar(0);

var jumbotronInterval;

var playJumbotron = function() {
    jumbotronInterval = setInterval(function() {
        var index = featuredBusinessIndex.get();
        if (index >= (businesses.length - 1)) {
            featuredBusinessIndex.set(0);
        } else {
            featuredBusinessIndex.set(index + 1);
        }
    }, 5000);
};

var pauseJumbotron = function() {
    clearInterval(jumbotronInterval);
}

Template.retail.helpers({

    featuredBusinesses: function() {
        return [ businesses[featuredBusinessIndex.get()] ];
    },

    businesses: function() {
        return businesses.filter(function() {
            return true;
        });
    }

});

Template.retail.events({

    'mouseover a': function() {
        pauseJumbotron();
        featuredBusinessIndex.set(businesses.indexOf(this));
    },
    'mouseout a': function() {
        playJumbotron();
    }

});

Template.retail.onRendered(function() {

    this.find('.jumbotron')._uihooks = {
        insertElement: function(node, next) {
            var parent = $(next).parent();
            $(node).on('animationend', function() {
                parent.find(':not(:last)').remove();
            });
            parent.append(node);
        },
        removeElement: function() {}
    };

});

Template.retail.onCreated(function() {

    playJumbotron();

});

Template.retail.onDestroyed(function() {

    pauseJumbotron();

});