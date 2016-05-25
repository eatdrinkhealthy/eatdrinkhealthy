import "./map.html";
import { customMapType, customMapTypeId } from "./map-style.js";

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

  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  map.mapTypes.set(customMapTypeId, customMapType);
  map.setMapTypeId(customMapTypeId);
});
