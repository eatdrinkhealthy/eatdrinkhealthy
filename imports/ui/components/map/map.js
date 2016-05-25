import "./map.html";
import { Template } from "meteor/templating";

Template.map.onRendered(function () { // eslint-disable-line prefer-arrow-callback, func-names
  const location = {
    // downtown Toronto
    latitude: 43.650033,
    longitude: -79.391594
  };

  if (Geolocation.latLng() != null) {
    location.latitude = Geolocation.latLng().lat;
    location.longitude = Geolocation.latLng().lng;
  }

  const mapOptions = {
    zoom: 15,
    disableDefaultUI: true,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
    center: {
      lat: location.latitude,
      lng: location.longitude
    }
  };

  function resizeHeight() {
    const height = window.innerHeight;
    $("#map").css("height", height);
  }
  window.onresize = function() {
    resizeHeight();
  };
  resizeHeight();

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

  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  map.mapTypes.set(customMapTypeId, customMapType);
  map.setMapTypeId(customMapTypeId);
});
