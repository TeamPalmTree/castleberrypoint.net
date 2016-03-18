Template.postImage.events({

    'click .delete': function(event) {
        CDCommunity.deleteImage(this.image._id, function(error) {
            if (error) {
                alert(error.reason);
            }
        });
    },

    'click .up': function(event) {
        CDCommunity.upImage(this.image._id, function(error) {
            if (error) {
                alert(error.reason);
            }
        });
    },

    'click .down': function(event) {
        CDCommunity.downImage(this.image._id, function(error) {
            if (error) {
                alert(error.reason);
            }
        });
    },

    'click img': CDCommunity.showImage

});