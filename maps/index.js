let map, infoWindow; 

function initMap() {
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
      travelMode: document.getElementById("mode").value
    }

    directionsService.route(request, function(result, status){
      if(status == "OK"){
        directionsRenderer.setDirections(result)
      }
    })
  });
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