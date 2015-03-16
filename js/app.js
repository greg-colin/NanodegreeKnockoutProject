/**
 @file app.js
 @author Gregory Colin
 @version 1.0
 */

/**
 @function MapViewModel
 @description This function contains the Knockout viewmodel
 */
var MapViewModel = function() {
  /**
   @var {object} self
   @description Assigning "this" to "self" is a common convention used with knowckout.js
   projects to keep track of the viewmodel's "this".
   */
  var self = this;

  /**
   @var {string} iconBase
   @description iconBase contains the root URL for map marker images for this project.
   */
  var iconBase = "./images/google_map_markers/";

  /**
   @var {string} imgBase
   @description imgBase contains the root URL for Google streetview images for the infoWindows
   that show when the user clicks on a map marker.
   */
  var imgBase = "http://maps.googleapis.com/maps/api/streetview?size=160x120&location=";

  /**
   @var {float} userLat
   @description userLat contains the user's current latitude
   */
  var userLat = ko.observable(40.7586);

  /**
   @var {float} userLong
   @description userLong contains the user's current Logitude
   */
  var userLong = ko.observable(-73.9792);

  /**
   @var {object} myLocation
   @description myLocation combined userLat and userLong into a Google Maps LatLng object
   */
  var myLocation = new google.maps.LatLng(userLat(), userLong());

  /**
   @var {string} searchQuery
   @description The searchQuery is a Knockout observable that contains any texy the user types
   into the controlUI's search bar
   */
  self.searchQuery = ko.observable("");

  /**
   @var {[object]} foursquareVenues
   @description foursquareVenues contains the reply from the application's AJAX call to Foursquare
   in the forms of an array of JSON objects. These are used to construct map markers, and provide
   HTML for the Google Maps InfoWindow associated with each map marker.
   */
  self.foursquareVenues = ko.observableArray([]);

  /**
   @var {object[]} mapMarkers
   @description mapMarkers is a knockout observable array of objects which contain each map marker and it's respective InfoWindow text.
   */
  self.mapMarkers = ko.observableArray([]);

  /**
   @var {object} myLocationMarker
   @description myLocationMarker is a knockout observable object containing a map marker for the user's location
   */
  self.myLocationMarker = ko.observable();

  /**
   @var string[] filteredList
   @description A list of all the map market titles matching the current search criteria
   */
  self.filteredList = ko.observableArray([]);

/**
 @function filterList
 @description Apply the current search bar contents to the list and set the observableArray equal to
 all of the results.
 */
  self.filterList = function() {
    var temp = [];
    $.each(self.mapMarkers(), function() {
      if (this.marker.map != null) {
        temp.push(this.marker.title);
      }
    });
    self.filteredList(temp);
  };

  /**
   @function markOwnLocation
   @description Creates a Google Maps marker for the user's location and adds it to the map
   */
  self.markOwnLocation = function() {
    self.myLocationMarker(new google.maps.Marker({
      map: self.map,
      position: myLocation,
      icon: iconBase + 'green_MarkerA.png',
      title: "My current location"
    }));
  };

  /**
   @function unflagAllMarkers
   @description A listview selection turns a corresponding map marker blue, and selecting a map marker
   turns it red. unflagAllMarkers sets all markers' color back to purple (the default).
   */
  self.unflagAllMarkers = function() {
    $.each(self.mapMarkers(), function() {
      this.marker.setIcon(iconBase + 'purple_MarkerA.png');
    });
  };

  /**
   @function search
   @description The search function limits the Foursquare venues shown in the listview and also removes
   markers for venues that don't match from the visible map.
   shown in the map
   */
  self.search = function(value) {
    var matchingVenueNames = [];
    console.log("Search function called");
    $.each(self.mapMarkers(), function() {
      if (this.marker.title.toLowerCase().indexOf(value.toLowerCase()) != -1) {
        matchingVenueNames.push(this.marker.title);
        this.marker.setMap(self.map);
      } else {
        this.marker.setMap(null);
      }
      console.log("this=");
      console.log(this);
    });

    console.log("Matching venues:");
    console.log(matchingVenueNames)
    return matchingVenueNames;
  }

  /**
   @function selectChange
   @description selectChange is called when the user clicks on a venue in the listview. The marker associated
   with the listview entry (by title) will turn blue.
   */
  self.selectChange = function(event) {
    console.log("Selection change:");
    console.log(event.srcElement.value);
    self.unflagAllMarkers();
    $.each(self.mapMarkers(), function() {
      console.log(this.marker);
      if (this.marker.title == event.srcElement.value) {
        this.marker.setIcon(iconBase + 'blue_MarkerA.png');
      }
    });
  }

  /**
   @function getVenues
   @description Make an AJAX request for Foursquare for checkin venues located near the user. If successful, a marker for each location
   is created along with HTML to populate an associated InfoWindow
   */
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
            $.each(self.mapMarkers(), function() {
              self.filteredList.push(this.marker.title);
            });
          }
    });
  };

  /**
   @function handleInfoWindow
   @param {google.maps.LatLng} latlng The location at which to open the InfoWindow
   @param {string} content HTML describing the location.
   */
  self.handleInfoWindow = function(latlng, content) {
    self.infoWindow.setContent(content);
    self.infoWindow.setPosition(latlng);
    self.infoWindow.open(self.map);
  };

  /**
   @function initalize
   @description Initialize the GoogleMap, sets X/Y offsets (in px) from any marker to open the info windows.
   Creates (but not displays) the info window. Adds UI controls created in the DOM to the map
   */
  self.initialize = function() {
    console.log("in self.initialize");

    var mapOptions = {
      disableDefaultUI: true,
      center: myLocation,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoom: 16
    };

    self.map = new google.maps.Map(document.getElementById('map-div'), mapOptions);

    self.textinput = document.getElementById('textinput');
    self.selectbox = document.getElementById('selectbox');
    self.selectbox.addEventListener('change', self.selectChange);

    var controlUI = (document.getElementById('controlUI'));
    self.map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(controlUI);

    //var searchBox = new google.maps.places.SearchBox((textinput));

    google.maps.event.addListener(self.map, 'dblclick', function(event) {       
        console.log("Map double-clicked. Event follows:");
        console.log(event);
    });

    self.infoWindow = new google.maps.InfoWindow({pixelOffset: new google.maps.Size(0, -25)});

    /**
     @function anonymous callback function
     @description Processes the closing click for the info window. Sets all markers to default
     color, and if an item is selected in the listview, turns it back to blue.
     */
    google.maps.event.addListener(self.infoWindow,'closeclick',function(){
      self.unflagAllMarkers();
      if (selectbox.value) {
        $.each(self.mapMarkers(), function() {
          if (this.marker.title == selectbox.value) {
            this.marker.setIcon(iconBase + 'blue_MarkerA.png');
          }
        });
      }
    });

    self.markOwnLocation();
    self.getVenues();
  };

  self.initialize();
};

var myMapViewModel = new MapViewModel();

// Apply the general knockout bindings,
ko.applyBindings(myMapViewModel);
// Explicit knockout subscription to changes in searchQuery in order to re-call the search function each time
myMapViewModel.searchQuery.subscribe(myMapViewModel.search);
// Explicit knockout subscription to changes in searchQuery in order to re-filter the viewlist each time
myMapViewModel.searchQuery.subscribe(myMapViewModel.filterList);
