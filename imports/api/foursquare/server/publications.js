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
      query: "sushi"
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
