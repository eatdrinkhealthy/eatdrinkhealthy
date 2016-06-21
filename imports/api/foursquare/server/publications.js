import { EJSON } from "meteor/ejson";
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { _ } from "meteor/underscore";
import { getFoursquarePlaces } from "./foursquareApi.js";
import { categories } from "../categories.js";

export function getFilteredFoursquarePlaces(filter, latitude, longitude, callback) {
  if (filter.length === 0) {
    _.each(categories, (category) => {
      getFoursquarePlaces(category, latitude, longitude, callback);
    });
  } else {
    // cross reference [filter] with list of all categories.
    _.each(categories, (category, key) => {
      // only add when part of [filter] array
      if (_.indexOf(filter, key) !== -1) {
        getFoursquarePlaces(category, latitude, longitude, callback);
      }
    });
  }
}

Meteor.publish("nearbyPlaces", function nearbyPlaces(latitude, longitude, filter) {
  check(latitude, Number);
  check(longitude, Number);
  check(filter, Array);

  const self = this;

  getFilteredFoursquarePlaces(filter, latitude, longitude, (error, result) => {
    if (!error) {
      const JSONresponse = EJSON.parse(result.content);

      _.each(JSONresponse.response.venues, (venue) => {
        self.added("places", venue.id, venue);
      });
      self.ready();
    } else {
      console.error(error.message);
    }
  });
});

Meteor.publish("listVenues", function listVenues(venueIds) {
  check(venueIds, Array);
  const self = this;
  venueIds.forEach((venueId) => {
    const url = `https://api.foursquare.com/v2/venues/${venueId}`;
    HTTP.call("GET", url, {
      params: {
        client_id: Meteor.settings.foursquare.client_id,
        client_secret: Meteor.settings.foursquare.client_secret,
        v: "20130815",
      },
    },
    (error, result) => {
      if (!error) {
        const JSONresponse = EJSON.parse(result.content);
        const name = JSONresponse.response.venue.name;
        const category = JSONresponse.response.venue.categories[0].name;
        const rating = JSONresponse.response.venue.rating;
        const location = JSONresponse.response.venue.location;
        const venue = {
          name,
          category,
          rating,
          location,
        };
        self.added("places", venueId, venue);
      }
    });
  });
  self.ready();
});

Meteor.publish("venue", function venues(venueId) {
  check(venueId, String);
  const url = `https://api.foursquare.com/v2/venues/${venueId}`;
  HTTP.call("GET", url, {
    params: {
      client_id: Meteor.settings.foursquare.client_id,
      client_secret: Meteor.settings.foursquare.client_secret,
      v: "20130815",
    },
  },
  (error, result) => {
    if (!error) {
      const JSONresponse = EJSON.parse(result.content);
      const name = JSONresponse.response.venue.name;
      const category = JSONresponse.response.venue.categories[0].name;
      const rating = JSONresponse.response.venue.rating;
      const location = JSONresponse.response.venue.location;
      const contact = JSONresponse.response.venue.contact;
      const page = JSONresponse.response.venue.page;
      const photo = JSONresponse.response.venue.bestPhoto;
      const tips = JSONresponse.response.venue.tips;

      const venue = {
        name,
        category,
        rating,
        location,
        contact,
        page,
        photo,
        tips,
      };

      this.added("places", venueId, venue);
    }
  });
  this.ready();
});
