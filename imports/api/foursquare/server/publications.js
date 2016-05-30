import { HTTP } from "meteor/http";
import { EJSON } from "meteor/ejson";
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";

Meteor.publish("nearbyPlaces", function (latitude, longitude) {
  console.log(latitude);
  check(latitude, Number);
  check(longitude, Number);

  let self = this;

  const latLng = `${latitude},${longitude}`;


  console.log(latLng);


  HTTP.call("GET", "https://api.foursquare.com/v2/venues/search", {
    params: {
      client_id: "1N0C5KTWP05QQRKEKHPNVOI4IKAXCJDRFNZDY0QKHBFABA30",
      client_secret: "U1B0UHK22EW5PMKKZIK0AF1LPN32B4M35S4N41HXCH4WTRFW",
      v: "20130815",
      ll: latLng,
      limit: "50",
      radius: "800",
      categoryId: "4c2cd86ed066bed06c3c5209,4bf58dd8d48988d112941735,4bf58dd8d48988d1bd941735,4bf58dd8d48988d1d3941735,4bf58dd8d48988d16a941735,4bf58dd8d48988d16d941735,4bf58dd8d48988d1e0931735,4bf58dd8d48988d1c4941735,4bf58dd8d48988d1fa941735,4bf58dd8d48988d11d951735,50aa9e744b90af0d42d5de0e,52f2ab2ebcbc57f1066b8b45,4bf58dd8d48988d118951735,52f2ab2ebcbc57f1066b8b46,52f2ab2ebcbc57f1066b8b1c,50be8ee891d4fa8dcc7199a7"
      //           gluten-free              juice bar                salad place              vege/vegan restaurant    bakery                   cafe                     coffee shop              restaurant               farmers market           butcher                  health food store        organic groceries        grocery store            supermarket              fruit and vege store     market
      // query: "healthy"
    }
  },
  function (error, result) {
    if (!error) {
      console.log("all good!", result);

      let JSONresponse = EJSON.parse(result.content);
      console.log("this is my json response", JSONresponse);

      _.each(JSONresponse.response.venues, function(venue) {
        console.log("my man, my venue", venue);
        self.added("places", venue.id, venue);
      });
      console.log("I'M READY BABY!");
      self.ready();

    } else {
      console.log(error);
    }

  });
  

  

  // return Places;


});

// https://api.foursquare.com/v2/venues/search
//   ?client_id=1N0C5KTWP05QQRKEKHPNVOI4IKAXCJDRFNZDY0QKHBFABA30
//   &client_secret=U1B0UHK22EW5PMKKZIK0AF1LPN32B4M35S4N41HXCH4WTRFW
//   &v=20130815
//   &ll=40.7,-74
//   &query=sushi

// https://api.foursquare.com/v2/venues/search?client_id=1N0C5KTWP05QQRKEKHPNVOI4IKAXCJDRFNZDY0QKHBFABA30&client_secret=U1B0UHK22EW5PMKKZIK0AF1LPN32B4M35S4N41HXCH4WTRFW&v=20130815&ll=40.7,-74&query=sushi
