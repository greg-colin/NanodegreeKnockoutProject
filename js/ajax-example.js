    function getVenues() {
        $.ajax({
            type: "GET",
            url: "https://api.foursquare.com/v2/venues/explore?ll="+lat+","+lng+"&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&v=20130619&query="+$("#query").val()+"",
            success: function(data) {
                var dataobj = data.response.groups[0].items;
                $("#venues").html("");
                
                $.each( dataobj, function() {
                    if (this.venue.categories[0]) {
                        str = this.venue.categories[0].icon.prefix;
                        newstr = str.substring(0, str.length - 1);
                        icon = newstr+this.venue.categories[0].icon.suffix;
                    } else {
                        icon = "";
                    }
                    
                    if (this.venue.contact.formattedPhone) {
                        phone = "Phone:"+this.venue.contact.formattedPhone;
                    } else {
                        phone = "";
                    }
                    
                    if (this.venue.location.address) {
                        address = '<p class="subinfo">'+this.venue.location.address+'<br>';
                    } else {
                        address = "";
                    }
                    
                    if (this.venue.rating) {
                        rating = '<span class="rating">'+this.venue.rating+'</span>';
                    }
                    
                    appendeddatahtml = '<div class="venue"><h2><span>'+this.venue.name+'<img class="icon" src="'+icon+'"> '+rating+'</span></h2>'+address+phone+'</p><p><strong>Total Checkins:</strong> '+this.venue.stats.checkinsCount+'</p></div>';
                    $("#venues").append(appendeddatahtml);
                    
                });
            }
        ;
    }