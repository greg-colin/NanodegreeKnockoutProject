// Model
//  No need to create a LocationData constructor function here
//  Use the new google.maps.LatLng() constructor instead

// View Model
var MapViewModel = function() {
  var self = this;
  var iconBase = "./images/google_map_markers/";
  var imgBase = "http://maps.googleapis.com/maps/api/streetview?size=160x120&location="
  var userLat = ko.observable(40.7586);
  var userLong = ko.observable(-73.9792);
  var myLocation = new google.maps.LatLng(userLat(), userLong());
  this.foursquareVenues = ko.observableArray([]);
  this.mapMarkers = ko.observableArray([]);
  this.myLocationMarker = ko.observable();

  self.markOwnLocation = function() {
    self.myLocationMarker(new google.maps.Marker({
      map: self.map,
      position: myLocation,
      icon: iconBase + 'green_MarkerA.png',
      title: "My current location"
    }));
  };

  self.unflagAllMarkers = function() {
    $.each(self.mapMarkers(), function() {
      this.marker.setIcon(iconBase + 'purple_MarkerA.png');
    });
  };

  self.getVenues = function() {
    $.ajax({
        type: "GET",
        url: "https://api.foursquare.com/v2/venues/search?ll="+userLat()+","+userLong()+"&client_id=OLYPOBMQ003QZVMZGDFOEGEZOGZQPNX1X404PVV1FLPVGFMU&client_secret=3MVWXXYQ5ENWZ4MKW4Q1NDMW2P20UFO243POFRBDZUHALQ4U&v=20150228",
          success: function(data) {
            var phone, category, address, rating;
            self.foursquareVenues(data.response.venues);
              $.each(self.foursquareVenues(), function() {
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
                  var markerpos = new google.maps.LatLng(this.location.lat, this.location.lng, false);
                  console.log("creating marker at " + markerpos.toString());
                  var imageloc = this.location.address + ' ' + this.location.city + ', ' + this.location.state + ' ' + this.location.country;
                  var appendeddatahtml = '<div class="venue">' + 
                                        '<h2>' +
                                          this.name +
                                          category +
                                          rating +
                                          '</h2>' +
                                          address +
                                          phone +
                                          '</p><p><strong>Total Checkins:</strong> ' +
                                          this.stats.checkinsCount +
                                          '<p>' + '<img src="' + imgBase + imageloc + '""></div>';
                  var marker = new google.maps.Marker({
                    position: markerpos,
                    title: this.name,
                    icon: iconBase + 'purple_MarkerA.png',
                    map: self.map
                  });

                  console.log("Created marker:");
                  console.log(marker);
                  self.mapMarkers.push({marker: marker, content: appendeddatahtml});

                  google.maps.event.addListener(marker, 'click', (function(marker) {
                    return function() {
                      console.log("Marker clicked:");
                      console.log(marker);
                      marker.setIcon(iconBase + 'red_MarkerA.png');
                      self.handleInfoWindow(marker.position, appendeddatahtml);
                    };
                  })(marker));
              });
          }
    });
  };

  self.handleInfoWindow = function(latlng, content) {
    console.log("Creating info window at: " + latlng.toString());
    self.infoWindow.setContent(content);
    self.infoWindow.setPosition(latlng);
    self.infoWindow.open(self.map);
  };

  self.initialize = function() {
    console.log("in self.initialize");

    var mapOptions = {
      disableDefaultUI: true,
      center: myLocation,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoom: 16
    };

    self.map = new google.maps.Map(document.getElementById('map-div'), mapOptions);

    var textinput = (document.getElementById('textinput'));
    self.map.controls[google.maps.ControlPosition.TOP_LEFT].push(textinput);

    var controlUI = (document.getElementById('controlUI'));
    self.map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(controlUI);

    var searchBox = new google.maps.places.SearchBox((textinput));

    google.maps.event.addListener(self.map, 'dblclick', function(event) {       
        console.log("Map double-clicked. Event follows:");
        console.log(event);
    });

    self.infoWindow = new google.maps.InfoWindow({pixelOffset: new google.maps.Size(0, -25)});

    google.maps.event.addListener(self.infoWindow,'closeclick',function(){
       self.unflagAllMarkers();
    });

    self.markOwnLocation();
    self.getVenues();
  };

  self.initialize();

};

var myMapViewModel = new MapViewModel();
ko.applyBindings(myMapViewModel);