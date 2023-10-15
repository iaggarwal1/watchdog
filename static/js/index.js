// import * as d3 from "d3"; -> does not work (why is reading from a csv weird in js)
let map, infoWindow; 
// var csv = require('jquery-csv'); -> does not work

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
  document.getElementById("generate").addEventListener("click", () => {
    const startLatLng = initMarkers[0].getPosition(); 
    const endLatLng = destMarkers[0].getPosition();
    // const routePts = [{lat : start.lat(), lng : start.lng()}, {lat : end.lat(), lng : end.lng()}]
    // let start = document.getElementById("pac-input1").value;
    // let end = document.getElementById("pac-input2").value;
    
    //Creating the request
    let request = {
      origin:startLatLng,
      destination:endLatLng,
      provideRouteAlternatives: true,
      travelMode: document.querySelector('input[name="mode"]:checked').value,
    }
    
    directionsService.route(request, function(result, status){
      if(status == "OK"){
        console.log(result.routes);
        if (directionsRendererArr.length != 0){
          for (var i=0; i<directionsRendererArr.length; i++){
            directionsRendererArr[i].setMap(null);
          }
          directionsRendererArr.splice(0,directionsRendererArr.length);

        }
        for (var i =0; i < result.routes.length; i++){
        //   directionsService.route(result.routes, directionResults);
            var directionsRenderer = new google.maps.DirectionsRenderer();
            directionsRenderer.setDirections(result);
            directionsRenderer.setRouteIndex(i);
            directionsRenderer.setMap(map);
            directionsRendererArr.push(directionsRenderer);
          }

        // directionsService.route(request)
        // directionsRenderer.setDirections(result);
        // directionsRenderer.setDirections(result[0]);
        // directionsRenderer.setDirections(result[1]);
        // directionsRenderer.setDirections(result[2]);
      }
    })
    // var cur = 0;
    // function directionResults(result, status){
    //   console.log("mom");

    //   if (status == google.maps.DirectionStatus.OK){
    //     var renderArray = [];
    //     renderArray[cur] = new google.maps.DirectionsRenderer();
    //     renderArray[cur].setMap(map);
    //     renderArray[cur].setDirections(result);
    //     cur++;
    //   }
    // }
  });

function factorial(num) {
  if (num === 0 || num === 1) {
      return 1;
  } else {
      return num * factorial(num - 1);
  }
}

function generateHashes(rows, columns){
  var pathHashes = [];
  for (var i=0; i < rows ** columns; i++){
    // Convert to base rows
    var pathHash = "";
    while (i > 0){
      curRow = i % rows
      pathHash += curRow
      i = Math.floor(i / rows);
    }
    pathHashes.push(pathHash);
  }
  return pathHashes;
}

function generateRoutes(rows, columns, start, end, pathHashes){
  var latIncr = Math.abs(end.lat()- start.lat()) / (rows+2);
  var lngIncr = Math.abs(end.lng()- start.lng()) / (columns+2);
  var paths = []; // 
  for (var i = 0; i < pathHashes.length; i++){
    for (var j = 0; j < pathHashes[i].length; j++){
        var pathLat = start.lat() + (pathHashes[i][j] + 1) * latIncr;
        var pathLng = start.lng() + (j+1) * lngIncr; 
    }
    paths.push({lat: pathLat, lng: pathLng});
  }
  return paths;
}



  //HEAT MAP
  // fetch("http://127.0.0.1:5500/crime_points", {
  //       method: "get",
  //       headers: {
  //         Accept: "text/csv", //Specifying CSV data 
  //         "Content-Type": "text/csv" 
  //       },
  //   }).then((response) => response.text()).then((csvData) => {
  //       let points = [];
  //       console.log(csvData);
  //   })
    
    
        // const csvData = d3.csv(csvData);
        // const csvData = d3.csv("CrimeData.csv");
        // const dataframe = csvData.map(row => ({
        //   name: row.name,            0
        //   dateTime: row.dateTime,    1
        //   location: row.location,    2
        //   victims: row.victims,      3
        //   crimeAgainst: row.crimeAgainst,  4
        //   firearm: row.firearm,    5
        //   longitude: row.longitude,  6
        //   latitude: row.latitude,  7
        //   severity: row.severity   8
        // })); //map function
        // var dataframe = $.csv.toObjects("CrimeData.csv");
        // const latCol = dataframe.map(row => row.latitude);
        // const longCol = dataframe.map(row => row.longitude);
        // const sevCol = dataframe.map(row => row.severity);
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
            console.log(points);
            // const cellValue = csvArray[0][2]; // "Bob"
            // console.log('Cell Value:', cellValue);
            let heatmap = new google.maps.visualization.HeatmapLayer({
              data: points,
              map: map,
              dissipating: true,
              radius: 40,
              opacity: 0.7,
              maxIntensity: 10
            });

            document.getElementById('heatMapToggle').addEventListener("click", () => {
              heatmap.setMap((heatmap.getMap() == null) ? map : null);
            });
            heatmap.setMap(heatmap.getMap());
          })
          .catch(error => console.error('Error:', error));


        // for (let i = 0; i < dataframe.length; i++) {
        //     points.push({location: new google.maps.LatLng(dataframe[i][7], dataframe[i][6]), weight: dataframe[i][8]});
        // }
        // console.log(points);
        // heatmap = new google.maps.visualization.HeatmapLayer({
        //   data: points,
        //   map: map,
        //   dissipating: true,
        //   radius: 40,
        //   opacity: 0.7,
        //   maxIntensity: 10
        // });


        // document
        //   .getElementById("toggle-heatmap")
        //   .addEventListener("click", toggleHeatmap);
    // }

    // heatmap.setMap(heatmap.getMap());

    // function toggleHeatmap() {
    //   heatmap.setMap(heatmap.getMap() ? null : map);
    // }
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