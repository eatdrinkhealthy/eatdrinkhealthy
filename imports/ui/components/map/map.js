import "./map.html";

import { $ } from "meteor/jquery";
<<<<<<< HEAD
=======
import { _ } from "meteor/underscore";
>>>>>>> master
import { Template } from "meteor/templating";
import { Tracker } from "meteor/tracker";
import { ReactiveVar } from "meteor/reactive-var";
import { FlowRouter } from "meteor/kadira:flow-router";

<<<<<<< HEAD
let markersArray = [];
=======
import { Places } from "../../../api/places/client/places";

/* global Geolocation */

// store marker objects for reference (ie to clear and construct the pop ups)
let markersArray = [];
let markers = {};
>>>>>>> master

function clearMarkers() {
  // remove all markers
  for (let i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(null);
  }
  markersArray = [];
  markers = {};
}

const Filters = [
  {
    name: "Gluten Free",
    value: "glutenFree",
  },
  {
    name: "Juice Bars",
    value: "juiceBar",
  },
  {
    name: "Salad Places",
    value: "saladPlace",
  },
  {
    name: "Vegan / Vegetarian",
    value: "veganVegeRestaurant",
  },
  {
    name: "Bakeries",
    value: "bakery",
  },
  {
    name: "Cafés",
    value: "cafe",
  },
  {
    name: "Coffee Shops",
    value: "coffeeShop",
  },
  {
    name: "Restaurants",
    value: "restaurant",
  },
  {
    name: "Farmers Markets",
    value: "farmersMarket",
  },
  {
    name: "Butchers",
    value: "butcher",
  },
  {
    name: "Health Food Stores",
    value: "healthFoodStore",
  },
  {
    name: "Organic Grocery Stores",
    value: "organicGrocery",
  },
  {
    name: "Grocery Stores",
    value: "grocery",
  },
  {
    name: "Supermarkets",
    value: "supermarket",
  },
  {
    name: "Fruit & Vege Stores",
    value: "fruitVegeStore",
  },
  {
    name: "Markets",
    value: "market",
  },
];

const defaultLocation = {
  // default to downtown Toronto
  // TODO: default to city set in profile (perhaps facebook location aka city)
  latitude: 43.650033,
  longitude: -79.391594,
};

const mapCenterLocation = new ReactiveVar(defaultLocation);
const filter = new ReactiveVar([]);

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
  let initialGeolocation = null;
  const googleMaps = google.maps; // eslint-disable-line no-undef

  // map styling
  // TODO: find out how to import these, seems to break map on iOS only
  const customMapType = new googleMaps.StyledMapType([
    {
      featureType: "landscape.man_made",
      elementType: "geometry",
      stylers: [
        {
          color: "#f7f1df",
        },
      ],
    },
    {
      featureType: "landscape.natural",
      elementType: "geometry",
      stylers: [
        {
          color: "#d0e3b4",
        },
      ],
    },
    {
      featureType: "landscape.natural.terrain",
      elementType: "geometry",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi.business",
      elementType: "all",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi.medical",
      elementType: "geometry",
      stylers: [
        {
          color: "#fbd3da",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [
        {
          color: "#bde6ab",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#ffe15f",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#efd151",
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#ffffff",
        },
      ],
    },
    {
      featureType: "road.local",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "black",
        },
      ],
    },
    {
      featureType: "transit.station.airport",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#cfb2db",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: "#a2daf2",
        },
      ],
    },
  ], {
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
  const map = new googleMaps.Map(
  document.getElementById("map"),
  mapOptions);

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
    if (event.target.checked && _.indexOf(setFilters, event.target.value) === -1) {
      setFilters.push(event.target.value);
    } else {
      setFilters.pop(event.target.value);
    }
    filter.set(setFilters);
    clearMarkers();
  },
  "click [data-action=toggle-filter]": () => {
    if ($(".map").hasClass("map--open-right")) {
      $(".map").removeClass("map--open-right");
      $(".nav").removeClass("nav--open-right");
      $(".filter").removeClass("filter--show");
    } else {
      $(".map").removeClass("map--open-left");
      $(".map").addClass("map--open-right");
      $(".nav").addClass("nav--open-right");
      $(".filter").addClass("filter--show");
    }
  },
  "click .toggle-sidebar": function () { // eslint-disable-line object-shorthand, func-names
    if ($(".map").hasClass("map--open-left")) {
      $(".map").removeClass("map--open-left");
      $(".nav").removeClass("nav--open-left");
    } else {
      $(".filter").removeClass("filter--show");
      $(".map").removeClass("map--open-right");
      $(".map").addClass("map--open-left");
      $(".nav").addClass("nav--open-left");
    }
  },
});

Template.map.helpers({
  filters: () => Filters,
});
