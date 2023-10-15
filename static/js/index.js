// import * as d3 from "d3"; -> does not work (why is reading from a csv weird in js)
let map, infoWindow; 
// var csv = require('jquery-csv'); -> does not work
var heatmap = null;
var showHeatmap = true;
var showUnverified = false;

function initMap() {
  var directionsRendererArr = [];
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 13,
    mapTypeId: "roadmap",
  });
  infoWindow = new google.maps.InfoWindow();

  const locationButton = document.createElement("button");

  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
    
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        },
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });

  //Search Boxes
  // Create the search box and link it to the UI element.
  const input1 = document.getElementById("pac-input1");
  const searchBox1 = new google.maps.places.SearchBox(input1);
  const input2 = document.getElementById("pac-input2");
  const searchBox2 = new google.maps.places.SearchBox(input2);
  const input3 = document.getElementById("location");
  const searchBox3 = new google.maps.places.SearchBox(input3);

  // Controls Position
  // map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox1.setBounds(map.getBounds());
    searchBox2.setBounds(map.getBounds());
  });

  let initMarkers = []; //Can explicitly declare type in Typescript
  let destMarkers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  let prevBounds;
  searchBox1.addListener("places_changed", () => {
    const places1 = searchBox1.getPlaces();

    if (places1.length == 0) {
      return;
    }
    // Clear out the old markers.
    initMarkers.forEach((marker) => {
      marker.setMap(null);
    });
    initMarkers = [];

    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();
    prevBounds = bounds;

    places1.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };

      // Create a marker for each place.
      initMarkers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        }),
      );
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });

  searchBox2.addListener("places_changed", () => {
    const places2 = searchBox2.getPlaces();

    if (places2.length == 0) {
      return;
    }
    // Clear out the old markers.
    destMarkers.forEach((marker) => {
      marker.setMap(null);
    });
    destMarkers = [];

    // For each place, get the icon, name and location.
    const bounds2 = new google.maps.LatLngBounds();

    places2.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };

      // Create a marker for each place.
      destMarkers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        }),
      );
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds2.union(place.geometry.viewport);
      } else {
        bounds2.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds2.union(prevBounds));
  });

  //PLACEHOLDER COORDINATES
  // const sampleCoordinates = [
  //   { lat: 37.772, lng: -122.214 },
  //   { lat: 21.291, lng: -157.821 },
  //   { lat: -18.142, lng: 178.431 },
  //   { lat: -27.467, lng: 153.027 },
  // ];

  //POLYLINE ROUTE DRAWING
  // const route = new google.maps.Polyline({
  //   geodesic: true, //shorteset path
  //   strokeColor: "#0000FF",
  //   strokeOpacity: 1.0,
  //   strokeWeight: 4,
  //   map: map
  // });

  // document.getElementById("generate").addEventListener("click", () => {
  //   const start = initMarkers[0].getPosition(); 
  //   const end = destMarkers[0].getPosition();
  //   const routePts = [{lat : start.lat(), lng : start.lng()}, {lat : end.lat(), lng : end.lng()}]
  //   route.setPath(routePts);
  // });

  //DIRECTIONS SERVICE DRAWING
  let directionsService = new google.maps.DirectionsService();
  let directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  //CONSTANTS
  const rows = 3;
  const columns = 3;

  document.getElementById("generate").addEventListener("click", () => {

    const startLatLng = initMarkers[0].getPosition(); 
    const endLatLng = destMarkers[0].getPosition();

    // Clear previous renders
    if (directionsRendererArr.length != 0){
      for (var i=0; i<directionsRendererArr.length; i++){
        directionsRendererArr[i].setMap(null);
      }
      directionsRendererArr.splice(0,directionsRendererArr.length);
    }

    // Generate new paths
    var hashes = generateHashes(rows, columns);
    var generatedWaypoints = generateWaypoints(rows, columns, startLatLng, endLatLng, hashes);

    for (var i=0; i < generatedWaypoints.length; i++){

      // Generate new requests
      let request = {
        origin:startLatLng,
        destination:endLatLng,
        waypoints: generatedWaypoints[i],
        provideRouteAlternatives: true,
        travelMode: document.querySelector('input[name="mode"]:checked').value,
      };
        directionsService.route(request, function(result, status){ 
          console.log(result);
          if(status == "OK"){
            //console.log(result.routes);
            if (directionsRendererArr.length != 0){
              for (var i=0; i<directionsRendererArr.length; i++){
                directionsRendererArr[i].setMap(null);
              }
              directionsRendererArr.splice(0,directionsRendererArr.length);
            } 
            for (var i =0; i < result.routes.length; i++){
              setTimeout(function(){
            //   directionsService.route(result.routes, directionResults);
                var directionsRenderer = new google.maps.DirectionsRenderer();
                directionsRenderer.setDirections(result);
                directionsRenderer.setRouteIndex(i);
                directionsRenderer.setMap(map);
                directionsRendererArr.push(directionsRenderer);
              },500);
              
            }
          }
        })
      }
  });
  generateHeatmap();
  document.getElementById("heatMapToggle").addEventListener("click", () => {
    showHeatmap = !showHeatmap;
    generateHeatmap();
  })
  document.getElementById("flexSwitchCheckDefault").addEventListener("click", () => {
    showUnverified = !showUnverified;
    heatmap.setMap(null);
    generateHeatmap();
  })
}

function generateHeatmap(){
  if (showHeatmap){
    fetch('/static/STFULLCOMPDATA.csv')
    .then(response => response.text())
    .then(data => {
      // 'data' contains the contents of the CSV file as a string
      // You can now parse and work with the CSV data
      // Example: Parse CSV to an array of objects
      let points = []
  
      const csvArray = data.split('\n').map(row => row.split(','));
      console.log(csvArray); //--> WORKS
      for (let i = 1; i < csvArray.length; i++) {
        points.push({location: new google.maps.LatLng(csvArray[i][7], csvArray[i][6]), weight: csvArray[i][8] * 3});
      }
      // console.log(points);
      if (showUnverified){
        
        var lat = 33.78148;
        var lng = -84.41378;
        points.push({location: new google.maps.LatLng(lat, lng), weight: 1});
        
      }
      // const cellValue = csvArray[0][2]; // "Bob"
      // console.log('Cell Value:', cellValue);
      heatmap = new google.maps.visualization.HeatmapLayer({
        data: points,
        map: map,
        dissipating: true,
        radius: 40,
        opacity: 0.7,
        maxIntensity: 10
      });
  
      heatmap.setMap(heatmap.getMap());
    })
    .catch(error => console.error('Error:', error));
  } else {
    heatmap.setMap(null);
  }

}


function generateHashes(rows, columns){
  const pathHashes = [];
  for (var i=0; i < rows ** columns; i++){
    var j = i;
    var idx = 0;
    // Convert to base rows
    var pathHash = Array(columns).fill(0);
    while (j > 0){
      pathHash[idx] = j % rows
      j = Math.floor(j / rows);
      idx++;
    }
    pathHashes.push(pathHash);
  }
  console.log(pathHashes);
  return pathHashes;
}

function generateWaypoints(rows, columns, start, end, pathHashes){
  var latIncr = Math.abs(end.lat()- start.lat()) / (rows+2);
  var lngIncr = Math.abs(end.lng()- start.lng()) / (columns+2);
  var paths = []; // 
  for (var i = 0; i < pathHashes.length; i++){
    var path = [];
    for (var j = 0; j < pathHashes[i].length; j++){
        var pathLat = Math.min(start.lat(), end.lat()) + (pathHashes[i][j] + 1) * latIncr;
        var pathLng = Math.min(start.lng(), end.lng()) + (j+1) * lngIncr; 
        path.push({location: {lat: pathLat, lng: pathLng}, stopover: false});
    }
    paths.push(path);
  }
  return paths;
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation.",
  );
  infoWindow.open(map);
}

window.initMap = initMap;
// [END maps_map_geolocation]