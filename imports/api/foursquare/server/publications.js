import { HTTP } from "meteor/http";
import { EJSON } from "meteor/ejson";
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";

const categories = {
  glutenFree: "4c2cd86ed066bed06c3c5209",
  juiceBar: "4bf58dd8d48988d112941735",
  saladPlace: "4bf58dd8d48988d1bd941735",
  veganVegeRestaurant: "4bf58dd8d48988d1d3941735",
  bakery: "4bf58dd8d48988d16a941735",
  cafe: "4bf58dd8d48988d16d941735",
  coffeeShop: "4bf58dd8d48988d1e0931735",
  restaurant: "4bf58dd8d48988d1c4941735",
  farmersMarket: "4bf58dd8d48988d1fa941735",
  butcher: "4bf58dd8d48988d11d951735",
  healthFoodStore: "50aa9e744b90af0d42d5de0e",
  organicGrocery: "52f2ab2ebcbc57f1066b8b45",
  grocery: "4bf58dd8d48988d118951735",
  supermarket: "52f2ab2ebcbc57f1066b8b46",
  fruitVegeStore: "52f2ab2ebcbc57f1066b8b1c",
  market: "50be8ee891d4fa8dcc7199a7"
};

let categoryString;
let setFirstCategory = false;
_.each(categories, (category) => {
  if (!setFirstCategory) {
    categoryString = category;
    setFirstCategory = true;
  } else {
    categoryString = `${categoryString},${category}`;
  }
});

Meteor.publish("nearbyPlaces", function nearbyPlaces(latitude, longitude) {
  check(latitude, Number);
  check(longitude, Number);

  const self = this;
  const latLng = `${latitude},${longitude}`;

  HTTP.call("GET", "https://api.foursquare.com/v2/venues/search", {
    params: {
      client_id: "1N0C5KTWP05QQRKEKHPNVOI4IKAXCJDRFNZDY0QKHBFABA30",
      client_secret: "U1B0UHK22EW5PMKKZIK0AF1LPN32B4M35S4N41HXCH4WTRFW",
      v: "20130815", // api version
      ll: latLng,
      limit: "50",
      radius: "800", // in meters
      categoryId: categoryString
    }
  },
  (error, result) => {
    if (!error) {
      const JSONresponse = EJSON.parse(result.content);
      _.each(JSONresponse.response.venues, (venue) => {
        self.added("places", venue.id, venue);
      });
      self.ready();
    }
  });
});

// * * * SAMPLE Foursquare calls

// https://api.foursquare.com/v2/venues/search
//   ?client_id=1N0C5KTWP05QQRKEKHPNVOI4IKAXCJDRFNZDY0QKHBFABA30
//   &client_secret=U1B0UHK22EW5PMKKZIK0AF1LPN32B4M35S4N41HXCH4WTRFW
//   &v=20130815
//   &ll=40.7,-74
//   &query=sushi

// https://api.foursquare.com/v2/venues/search?client_id=1N0C5KTWP05QQRKEKHPNVOI4IKAXCJDRFNZDY0QKHBFABA30&client_secret=U1B0UHK22EW5PMKKZIK0AF1LPN32B4M35S4N41HXCH4WTRFW&v=20130815&ll=40.7,-74&query=sushi