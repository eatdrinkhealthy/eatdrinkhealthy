import "./map.html";

import { $ } from "meteor/jquery";
import { _ } from "meteor/underscore";
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { Tracker } from "meteor/tracker";
import { ReactiveVar } from "meteor/reactive-var";
import { FlowRouter } from "meteor/kadira:flow-router";
import { Places } from "../../../api/places/client/places";
import { mapStylings } from "./map-style.js";
import { Filters } from "./map-filters.js";
import { currentReportingUser } from "../../../api/utils.js";

/* global Geolocation, analytics */

// store marker objects for reference (ie to clear and construct the pop ups)
let markersArray = [];
let markers = {};

function clearMarkers() {
  // remove all markers
  for (let i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(null);
  }
  markersArray = [];
  markers = {};
}

const defaultLocation = {
  // default to downtown Toronto
  // TODO: default to city set in profile (perhaps facebook location aka city)
  latitude: 43.650033,
  longitude: -79.391594,
};

const mapCenterLocation = new ReactiveVar(defaultLocation);
const filter = new ReactiveVar([]);

function trackFilter() {
  // TODO: currently this can be called when the filter window is opened and
  // closed, which will track the filter via analytics, although no change
  // was made. Consider preventing the duplicate reporting.
  const currentFilters = filter.get();

  if (currentFilters.length) {
    analytics.track("Filtered Search", {
      user: currentReportingUser(),
      filters: currentFilters,
    });
  }
}

Template.map.onCreated(function () { // eslint-disable-line prefer-arrow-callback, func-names
  this.autorun(() => {
    this.subscribe("nearbyPlaces",
      mapCenterLocation.get().latitude,
      mapCenterLocation.get().longitude,
      filter.get()
    );
  });
});

Template.map.onRendered(function () { // eslint-disable-line prefer-arrow-callback, func-names
  if (Meteor.isCordova) {
    $(".nav").animate({ paddingTop: "+=20px", height: "+=20px" }, 100);
    $(".toggle-filter, .toggle-sidebar").animate({ top: "+=20px" }, 100);
    $(".filter-header").animate({ paddingTop: "+=20px", height: "+=20px" }, 100);
    $(".push-filter-items").animate({ height: "+=20px" }, 100);

    // close the sidebar if user starts to drag close
    setInterval(() => {
      if (scrollX !== 0) {
        $(".map-container").removeClass("map-container--open-left");
      } else {
        $("body").scrollLeft(0);
      }
    }, 1000);
  }

  let initialGeolocation = null;
  const googleMaps = google.maps; // eslint-disable-line no-undef
  // clear objects and arrays on rendered for to plotMarkers() correctly on first load
  markersArray = [];
  markers = {};

  // map styling
  // TODO: find out how to import these, seems to break map on iOS only
  const customMapType = new googleMaps.StyledMapType(mapStylings, {
    name: "Custom Style",
  });

  const customMapTypeId = "custom_style";

  const mapOptions = {
    zoom: 16,
    disableDefaultUI: true,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM, // eslint-disable-line no-undef
    },
    center: {
      lat: mapCenterLocation.get().latitude,
      lng: mapCenterLocation.get().longitude,
    },
  };

  // responsive map
  function resizeHeight() {
    const height = window.innerHeight;
    $(".map").css("height", height);
  }
  window.onresize = function () {
    resizeHeight();
  };
  resizeHeight();

  // init map, pass in mapOptions, set style and give it an id that we set
  const map = new googleMaps.Map(document.getElementById("map"), mapOptions);

  map.mapTypes.set(customMapTypeId, customMapType);
  map.setMapTypeId(customMapTypeId);

  // When a user drags the map - call at end of drag
  googleMaps.event.addListener(map, "dragend", () => {
    mapCenterLocation.set({ latitude: map.getCenter().lat(), longitude: map.getCenter().lng() });
  });

  // Set Marker style
  const mapMarker = {
    url: "/images/pinMarker3x.png",
    size: new googleMaps.Size(31, 39),
    origin: new googleMaps.Point(0, 0),
    anchor: new googleMaps.Point(15, 39),
    scaledSize: new googleMaps.Size(31, 39),
  };

  const infowindow = new googleMaps.InfoWindow;

  // Add a marker to the map and push to the array for comparison.
  function addMarker(latLng, name, id, category, location) {
    if (!markers[id]) {
      markers[id] = true;
      const marker = new googleMaps.Marker({
        position: latLng,
        map,
        title: name,
        icon: mapMarker,
      });

      // store markers in array to clear during filter actions
      markersArray.push(marker);

      // Set up info window for marker
      const contentString = `
        <div>
        <a href="${FlowRouter.path("/place/:_id", { _id: id })}">${name}</a>
        </div>
        <div class="info-address">
          ${location.address || ""} ${location.city || ""} ${location.postalCode || ""}
        </div>
        <div class="info-category">${category}</div>
        `;

      googleMaps.event.addListener(marker, "click", () => {
        infowindow.setContent(contentString);
        infowindow.open(map, marker);
      });
    }
  }

  function plotMarkers() {
    _.each(Places.find().fetch(), (place) => {
      const latLng = new googleMaps.LatLng(place.location.lat, place.location.lng);
      addMarker(latLng, place.name, place.id, place.categories[0].name, place.location);
    });
  }

  // get device location on first load, and pan map to that location
  Tracker.autorun(() => {
    const currentGeolocation = Geolocation.latLng();
    if (currentGeolocation !== null && initialGeolocation === null) {
      initialGeolocation = currentGeolocation;
      location.latitude = currentGeolocation.lat;
      location.longitude = currentGeolocation.lng;
      map.panTo(new googleMaps.LatLng(location.latitude, location.longitude));
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

// [saladPlace, glutenFree, juiceBar]
Template.map.events({
  "click input[name='filter']": (event) => {
    const setFilters = filter.get();

    if (event.target.checked) {
      // add the checked filter to current filter list
      filter.set(_.union(setFilters, event.target.value));
    } else {
      // remove the unchecked filter from current filter list
      filter.set(_.without(setFilters, event.target.value));
    }

    clearMarkers();
  },
  "click [data-action=toggle-filter]": () => {
    if ($(".map-container").hasClass("map-container--open-right")) {
      $(".map-container").removeClass("map-container--open-right");
      $(".filter").removeClass("filter--show");
      trackFilter();
    } else {
      $(".map-container").removeClass("map-container--open-left");
      $(".map-container").addClass("map-container--open-right");
      $(".filter").addClass("filter--show");
    }
  },
  "click .toggle-sidebar": function () { // eslint-disable-line object-shorthand, func-names
    if ($(".map-container").hasClass("map-container--open-left")) {
      $(".map-container").removeClass("map-container--open-left");
    } else {
      $(".filter").removeClass("filter--show");
      $(".map-container").removeClass("map-container--open-right");
      $(".map-container").addClass("map-container--open-left");
    }
  },
});

Template.map.helpers({
  filters: () => Filters,
  filterSet: (value) => {
    let isSet = false;
    if (_.indexOf(filter.get(), value) !== -1) {
      isSet = true;
    }
    return isSet;
  },
});
