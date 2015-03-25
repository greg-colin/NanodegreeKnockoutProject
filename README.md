# Foursquare POI
Foursquare POI is a small application to show points of interest near a particular location.

## Starting the application
Foursquare POI can be started by navigating to:
[http://greg-colin.github.io](http://greg-colin.github.io)

## Using the application
### Opening the application and initial view
Opening the application displays a Google map of the area surrounding Rockefeller Center in New York City.
The user's location is noted as a green "pin" on the map. Points of interest, defined as locations that
Foursquare users have checked into, are displayed as purple pins. Any of the purple pins may be clicked
and when that is done, an information window appears showiung the location name, its primary Foursquare
category, street address (if any), telephone number (if any) and the number of Foursquare checkins. Also,
a Google StreetView image of the location is shown if available. Pins turn red while the information
window is open, and back to purple if the info window is closed or if another pin is selected.

### The controls User Interface (UI)
The lower left corner of the display hosts a list view of the locations, and a search bar. Typing in the
search bar filters the list to those location whose names contain the string in the search, and removes
marker pins from the map corresponding to non-matches. Selecting an item from the list view confines both
the map and the list to a single item. A button is provided to clear the most recent search.

### Other actions
Resizing the window re-centers the map around the user's location, offset slightly by a number of pixels
in both the X and Y planes to account for the control UI.

### Error handling
Status progress is shown with a string at the bottom of the controls UI. In the event that the Foursquare API
does not load, an error message is displayed in red. In the event that the Google Maps API doesn't load, the
map and it's control UI will not be visible, so all of the controls are hidden *except* the error string,
which will inform that the Google API is unavailble.

## References
- The fine AJAX course at Udacity.com!
- w3schools.com
- stackoverflow.com
- Other user submissions in the Udacity forums
