import "./map.html";

import { Template } from "meteor/templating";
import { Tracker } from "meteor/tracker";
import { ReactiveVar } from "meteor/reactive-var";

markersArray = [];

Template.map.onRendered(function () { // eslint-disable-line prefer-arrow-callback, func-names
  let initialGeolocation = null;

  // map styling
  // TODO: find out how to import these, seems to break map on iOS only
  const customMapType = new google.maps.StyledMapType([
    {
      featureType: "landscape.man_made",
      elementType: "geometry",
      stylers: [
        {
          color: "#f7f1df"
        }
      ]
    },
    {
      featureType: "landscape.natural",
      elementType: "geometry",
      stylers: [
        {
          color: "#d0e3b4"
        }
      ]
    },
    {
      featureType: "landscape.natural.terrain",
      elementType: "geometry",
      stylers: [
        {
          visibility: "off"
        }
      ]
    },
    {
      featureType: "poi.business",
      elementType: "all",
      stylers: [
        {
          visibility: "off"
        }
      ]
    },
    {
      featureType: "poi.medical",
      elementType: "geometry",
      stylers: [
        {
          color: "#fbd3da"
        }
      ]
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [
        {
          color: "#bde6ab"
        }
      ]
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [
        {
          visibility: "off"
        }
      ]
    },
    {
      featureType: "road.highway",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#ffe15f"
        }
      ]
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#efd151"
        }
      ]
    },
    {
      featureType: "road.arterial",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#ffffff"
        }
      ]
    },
    {
      featureType: "road.local",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "black"
        }
      ]
    },
    {
      featureType: "transit.station.airport",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#cfb2db"
        }
      ]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: "#a2daf2"
        }
      ]
    }
  ], {
    name: "Custom Style"
  });

  const customMapTypeId = "custom_style";

  const mapOptions = {
    zoom: 16,
    disableDefaultUI: true,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
    center: {
      lat: mapCenterLocation.get().latitude,
      lng: mapCenterLocation.get().longitude
    }
  };

  // responsive map
  function resizeHeight() {
    const height = window.innerHeight;
    $("#map").css("height", height);
  }
  window.onresize = function () {
    resizeHeight();
  };
  resizeHeight();

  // init map, pass in mapOptions, set style and give it an id that we set
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  map.mapTypes.set(customMapTypeId, customMapType);
  map.setMapTypeId(customMapTypeId);

  // When a user drags the map - call at end of drag
  google.maps.event.addListener(map, "dragend", () => {
    mapCenterLocation.set({ latitude: map.getCenter().lat(), longitude: map.getCenter().lng() });
  });

  // Set Marker style
  markers = {};
  const mapMarker = {
    url: "/images/pinMarker3x.png",
    size: new google.maps.Size(31, 39),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(15, 39),
    scaledSize: new google.maps.Size(31, 39)
  };

  // Add a marker to the map and push to the array for comparison.
  function addMarker(location, name, id) {
    if (!markers[id]) {
      markers[id] = true;
      const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: name,
        icon: mapMarker
      });

      // store markers in array to clear during filter actions
      markersArray.push(marker);

      // Set up info window for marker
      const contentString = name;
      const infowindow = new google.maps.InfoWindow({
        content: contentString
      });
      google.maps.event.addListener(marker, "click", () => {
        infowindow.open(map, marker);
      });
    }
  }

  function plotMarkers() {
    _.each(Places.find().fetch(), (place) => {
      const location = new google.maps.LatLng(place.location.lat, place.location.lng);
      addMarker(location, place.name, place.id);
    });
  }

  // get device location on first load, and pan map to that location
  Tracker.autorun(() => {
    const currentGeolocation = Geolocation.latLng();
    if (currentGeolocation !== null && initialGeolocation === null) {
      initialGeolocation = currentGeolocation;
      location.latitude = Geolocation.latLng().lat;
      location.longitude = Geolocation.latLng().lng;
      map.panTo(new google.maps.LatLng(location.latitude, location.longitude));
      // set mapCenterLocation for the subscription to run again
      mapCenterLocation.set({ latitude: location.latitude, longitude: location.longitude });
    }
  });

  this.autorun(() => {
    if (this.subscriptionsReady()) {
      plotMarkers();
    }
  });
});

Template.map.onCreated(function () { // eslint-disable-line prefer-arrow-callback, func-names
  const defaultLocation = {
    // default to downtown Toronto
    // TODO: default to city set in profile (perhaps facebook location aka city)
    latitude: 43.650033,
    longitude: -79.391594
  };
  mapCenterLocation = new ReactiveVar(defaultLocation);
  this.autorun(() => {
    this.subscribe("nearbyPlaces",
      mapCenterLocation.get().latitude,
      mapCenterLocation.get().longitude
    );
  });
});
