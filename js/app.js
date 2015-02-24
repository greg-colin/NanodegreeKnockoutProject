// Model
//  No need to create a LocationData constructor function here
//  Use the new google.maps.LatLng() constructor instead

// View Model
var MapViewModel = function() {
  var self = this;
  var iconBase = "./images/google_map_markers/"
  var userLat = ko.observable(40.7586);
  var userLong = ko.observable(-73.9792);
  var myLocation = new google.maps.LatLng(userLat(), userLong());
  var foursquareVenues = ko.observableArray();
  var mapMarkers = ko.observableArray();
  var myLocationMarker = ko.observable();

  self.markOwnLocation = function() {
    myLocationMarker(new google.maps.Marker({
      map: map,
      position: myLocation,
      icon: iconBase + 'green_MarkerA.png',
      title: "My current location"
    }))
  }

  self.createMapMarker = function(venue) {
    var googleLatLng = new google.maps.LatLng(venue.location.lat, venue.location.lng);

    var marker = new google.maps.Marker({
      map: map,
      position: googleLatLng,
      icon: iconBase + 'purple_MarkerA.png',
      title: venue.name
    });

    var infoWindow = new google.maps.InfoWindow({
      content: "This is: " + venue.name
    });

    // hmmmm, I wonder what this is about...
    google.maps.event.addListener(marker, 'click', function() {
      console.log(infoWindow);
      marker.setIcon(iconBase + 'red_MarkerA.png');
      infoWindow.open(map, marker);
    });

    google.maps.event.addListener(infoWindow, 'closeclick', function() {
      marker.setIcon(iconBase + 'purple_MarkerA.png');
    });
    mapMarkers().push(marker);
  }

  self.getVenues = function() {
    $.ajax({
        type: "GET",
        url: "https://api.foursquare.com/v2/venues/search?ll="+userLat()+","+userLong()+"&client_id=OLYPOBMQ003QZVMZGDFOEGEZOGZQPNX1X404PVV1FLPVGFMU&client_secret=3MVWXXYQ5ENWZ4MKW4Q1NDMW2P20UFO243POFRBDZUHALQ4U&v=20150217",
          success: function(data) {
            foursquareVenues(data.response.venues);
              $("#venues").html("");
              $.each(foursquareVenues(), function() {
                  if (this.contact.formattedPhone) {
                      phone = "Phone:"+this.contact.formattedPhone;
                  } else {
                      phone = "";
                  }

                  if (this.categories[0]) {
                    category = " [ " + this.categories[0].name + " ] ";
                  } else {
                    category = "";
                  }
                  
                  if (this.location.address) {
                      address = '<p class="subinfo">'+this.location.address+'<br>';
                  } else {
                      address = "";
                  }
                  
                  if (this.rating) {
                      rating = '<span class="rating">'+this.rating+'</span>';
                  } else {
                    rating = "";
                  }
                  self.createMapMarker(this);
                  //
                  appendeddatahtml = '<div class="venue"><h2><span>'+this.name+category+rating+'</span></h2>'+address+phone+'</p><p><strong>Total Checkins:</strong> '+this.stats.checkinsCount+'</p></div>';
                  $("#venues").append(appendeddatahtml);
                  
              });
          }
    });
  }

  self.initialize = function() {
    console.log("in self.initialize");
    var mapOptions = {
      disableDefaultUI: false,
      center: myLocation, // referencing the myLocation variable
      position: myLocation,  // same as above
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoom: 16
    };
    map = new google.maps.Map(document.getElementById('map-div'), mapOptions);
  };

  self.initialize();
  self.markOwnLocation();
  self.getVenues();
};

var myMapViewModel = new MapViewModel();
ko.applyBindings(myMapViewModel);