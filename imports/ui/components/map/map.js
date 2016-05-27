import "./map.html";

import { Template } from "meteor/templating";
import { Tracker } from "meteor/tracker";

Template.map.onRendered(function () { // eslint-disable-line prefer-arrow-callback, func-names
  let initialGeolocation = null;

  const defaultLocation = {
    // default to downtown Toronto
    // TODO: default to city set in profile (perhaps facebook location aka city)
    latitude: 43.650033,
    longitude: -79.391594
  };

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
    zoom: 15,
    disableDefaultUI: true,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
    center: {
      lat: defaultLocation.latitude,
      lng: defaultLocation.longitude
    }
  };

  // responsive map
  function resizeHeight() {
    const height = window.innerHeight;
    $("#map").css("height", height);
  }
  window.onresize = function() {
    resizeHeight();
  };
  resizeHeight();

  // init map, pass in mapOptions, set style and give it an id that we set
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  map.mapTypes.set(customMapTypeId, customMapType);
  map.setMapTypeId(customMapTypeId);

  // get device location on first load, and pan map to that location
  Tracker.autorun(() => {
    const currentGeolocation = Geolocation.latLng();
    if (currentGeolocation !== null && initialGeolocation === null) {
      initialGeolocation = currentGeolocation;
      location.latitude = Geolocation.latLng().lat;
      location.longitude = Geolocation.latLng().lng;
      map.panTo(new google.maps.LatLng(location.latitude, location.longitude));
    }
  });
});
