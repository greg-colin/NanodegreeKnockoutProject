// Model
//  No need to create a LocationData constructor function here
//  Use the new google.maps.LatLng() constructor instead

// View Model
var MapViewModel = function() {
  var self = this;
  var iconBase = "./images/google_map_markers/";
  var userLat = ko.observable(40.7586);
  var userLong = ko.observable(-73.9792);
  var myLocation = new google.maps.LatLng(userLat(), userLong());
  var foursquareVenues = ko.observableArray([]);
  this.mapMarkers = ko.observableArray([]);
  this.myLocationMarker = ko.observable();

  this.markOwnLocation = function() {
    self.myLocationMarker(new google.maps.Marker({
      map: self.map,
      position: myLocation,
      icon: iconBase + 'green_MarkerA.png',
      title: "My current location"
    }));
  };

  self.getVenues = function() {
    $.ajax({
        type: "GET",
        url: "https://api.foursquare.com/v2/venues/search?limit=20&ll="+userLat()+","+userLong()+"&client_id=OLYPOBMQ003QZVMZGDFOEGEZOGZQPNX1X404PVV1FLPVGFMU&client_secret=3MVWXXYQ5ENWZ4MKW4Q1NDMW2P20UFO243POFRBDZUHALQ4U&v=20150228",
          success: function(data) {
            var phone, category, address, rating;
            console.log("response JSON:");
            console.log(JSON.stringify(data));
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
                  console.log("creating marker");
                  var appendeddatahtml = '<div class="venue"><h2><span>'+this.name+category+rating+'</span></h2>'+address+phone+'</p><p><strong>Total Checkins:</strong> '+this.stats.checkinsCount+'<p>Lat: '+this.location.lat+'<br>'+'Long: '+this.location.lng+'</p></div>';
                  var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(this.location.lat, this.location.lng),
                    title: this.name,
                    icon: iconBase + 'purple_MarkerA.png',
                    map: self.map
                  });
                  //
                  console.log(marker);
                  //
                  google.maps.event.addListener(marker, 'click', (function(marker) {
                    return function() {
                      console.log("Marker clicked:");
                      console.log(marker);
                      marker.setIcon(iconBase + 'red_MarkerA.png');
                      self.handleInfoWindow(marker.position, appendeddatahtml);
                    };
                  })(marker));
                  self.mapMarkers.push({marker: marker, content: appendeddatahtml});
              });
          }
    });
  };

  self.handleInfoWindow = function(latlng, content) {
    console.log(latlng.toString());
    self.infoWindow.setContent(content);
    self.infoWindow.setPosition(latlng);
    console.log("opening info window:");
    console.log(self.infoWindow);
    self.infoWindow.open(self.map);
  };

  self.initialize = function() {
    console.log("in self.initialize");
    var mapOptions = {
      disableDefaultUI: false,
      center: myLocation, // referencing the myLocation variable
      position: myLocation,  // same as above
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoom: 17
    };
    self.map = new google.maps.Map(document.getElementById('map-div'), mapOptions);
    self.infoWindow = new google.maps.InfoWindow();
    self.markOwnLocation();
    self.getVenues();
  };

  self.initialize();

};

var myMapViewModel = new MapViewModel();
ko.applyBindings(myMapViewModel);