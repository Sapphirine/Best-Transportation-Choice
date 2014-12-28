/*
####################################################
# Columbia University
# Department of Electrical Engineering
# Big Data - Final Project
# Fall 2014
# Andre Cunha
# Joseph Machado 
# Xia Shang
# Zhao Pan
####################################################
*/
var map;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var markerArray = [];
var text = '';


function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var mapOptions = {
    zoom: 7,
    center: new google.maps.LatLng(40.7711329, -73.9741874)
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  directionsDisplay.setMap(map);

  var control = document.getElementById('control');
  var panel = document.getElementById('panel');
  control.style.display = 'block';
  panel.style.display = 'block';
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(control);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(panel);
}

function calcRoute() {
  var start = document.getElementById('start').value;
  var end = document.getElementById('end').value;
  var request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.TRANSIT
  };
  
  // First, remove any existing markers from the map.
  for (var i = 0; i < markerArray.length; i++) {
    markerArray[i].setMap(null);
  }

  // Now, clear the array itself.
  markerArray = [];
  
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      showSteps(response);
    }
  });
  return false;
}

function showSteps(directionResult) {
  // For each step, place a marker, and add the text to the marker's
  // info window. Also attach the marker to an array so we
  // can keep track of it and remove it when calculating new
  // routes.
  text = '';
  
  var myRoute = directionResult.routes[0].legs[0];
  var delay = 0;
  var m = 0;
  var h = 0;

  
  for (var i = 0; i < myRoute.steps.length; i++) {
    if(myRoute.steps[i].travel_mode == "TRANSIT"){
    
      var location = myRoute.steps[i].start_location.toString().split(",");
      var aux = parseFloat(location[0].replace('(', '')).toFixed(6);
      var array_index;
      var delay = 0;
      
      $.getJSON('calcStation.php?search=',{destination:aux, direction: myRoute.steps[i].transit.headsign, steps:myRoute.steps[i].transit.num_stops,ajax: 'true'}, function(j){
		text += '<table class="pa"><tr><td>Station</td><td>Average Delay (s)</td><td>Grade</td></tr>';
		for (var i = 0; i < j.length; i++) {
			options += '<tr><td>' + j[i].station_name + ' St</td><td>' + j[i].avg_delay + ' sec</td><td>' + j[i].grade + '</td></tr>';
			var title = j[i].station_name+' St: '+j[i].avg_delay+' sec';
			var myLatLng = new google.maps.LatLng(location);
			delay += j[i].avg_delay;
			var infowindow = new google.maps.InfoWindow({
				  content: title,
				  position: location
			});
			infowindow.open(map);
		}
		text += '</table>';
	});
    }
    
    var marker = new google.maps.Marker({
      position: myRoute.steps[i].start_location,
      map: map
    });
    markerArray[i] = marker;
  }
  $('#panel').html(text);
  var time_tmp = (myRoute.arrival_time.text).split(':');
  h = parseInt(time_tmp[0]);
  m = (parseInt(time_tmp[1])+(-1)*(delay/60)).toFixed();
  if (m > 60) {
    h = parseInt(time_tmp[0])+1;
    m = (m - 60).toFixed();
  }
  
  $('#control_time').html('<hr>Original Arrival Time: '+myRoute.arrival_time.text+'<br>Calculated Delay: '+(delay/60).toFixed(2) +' minutes<br>Total Time: '+h+':'+m);
}

google.maps.event.addDomListener(window, 'load', initialize);
